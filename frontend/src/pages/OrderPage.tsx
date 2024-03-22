import { Link, useParams } from "react-router-dom"
import { useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from "../hooks/orderHooks"
import { LoadingBox } from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import { getError } from "../utils"
import { ApiError } from "../types/ApiError"
import { Helmet } from "react-helmet-async"
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap"
import { toast } from "react-toastify"
import { PayPalButtons, PayPalButtonsComponentProps, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useEffect } from "react"


export const OrderPage = () => {

    const params = useParams()
    const { id: orderId } = params

    const {
        data: order,
        isPending,
        error,
        refetch
    } = useGetOrderDetailsQuery(orderId!)

    const { mutateAsync: payOrder } = usePayOrderMutation()

    const testPayHandler = async () => {
        const res = await payOrder({ orderId: orderId! })
        if (res.order) {
            refetch()
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
    }

    const [{ isPending: paypalPending, isRejected: paypalRejected }, paypalDispatch] = usePayPalScriptReducer()

    const { data: paypalConfig } = useGetPaypalClientIdQuery()

    const paypalButtonTransactionProps: PayPalButtonsComponentProps = {
        style: { layout: 'vertical' },
        async createOrder(data, actions) {
            const orderID = await actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: order!.totalPrice.toString(),
                            currency_code: 'EUR'
                        }
                    }
                ],
                intent: "CAPTURE"
            })
            return orderID
        },
        async onApprove(data, actions) {
            const details = await actions.order!.capture()
            try {
                await payOrder({ orderId: orderId!, ...details })
                refetch()
                toast.success('Order is paid successfully')
            } catch (err) {
                toast.error(getError(err as ApiError))
            }
        },
        onError: (err) => {
            toast.error(getError(err as ApiError))
        }
    }

    useEffect(() => {
        if (paypalConfig && paypalConfig.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        clientId: paypalConfig!.clientId,
                        currency: 'EUR'
                    }
                })
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: SCRIPT_LOADING_STATE.PENDING
                })
            }
            loadPaypalScript()
        }
    }, [paypalConfig])

    return isPending ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
    ) : !order ? (
        <MessageBox variant="danger">Order Not Found</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Order #{orderId}</title>
            </Helmet>
            <h1 className="my-3">Order #{orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name: </strong> {order.shippingAddress.fullName} <br />
                                <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </Card.Text>
                            {order.isDelivered ? (
                                <MessageBox variant="success">
                                    Delivered at {order.deliveredAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="warning">
                                    Not Delivered
                                </MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method: </strong> {order.paymentMethod}
                            </Card.Text>
                            {order.isPaid ? (
                                <MessageBox variant="success">
                                    Paid at {order.paidAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="warning">
                                    Not Paid
                                </MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {order.items.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img src={item.image} alt={item.name} className="img-fluid rounded thumbnail" />{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>
                                                {item.price}€
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>{order.itemsPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>{order.shippingPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>{order.taxPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Total</strong></Col>
                                        <Col><strong>{order.totalPrice.toFixed(2)}€</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {paypalPending ? (
                                            <LoadingBox />
                                        ) : paypalRejected ? (
                                            <MessageBox variant="error">
                                                Error in connecting with PayPal
                                            </MessageBox>
                                        ) : (
                                            <div>
                                                <PayPalButtons {...paypalButtonTransactionProps}></PayPalButtons>
                                                <Button onClick={testPayHandler}>Test Pay</Button>
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
