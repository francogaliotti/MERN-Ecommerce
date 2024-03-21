import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Store } from "../Store"
import { useCreateOrderMutation } from "../hooks/orderHooks"
import { toast } from "react-toastify"
import { getError } from "../utils"
import { ApiError } from "../types/ApiError"
import { CheckoutSteps } from "../components/CheckoutSteps"
import { Helmet } from "react-helmet-async"
import { Button, Card, CardBody, Col, ListGroup, Row } from "react-bootstrap"
import { LoadingBox } from "../components/LoadingBox"

export const PlaceOrderPage = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useContext(Store)
    const { cart } = state

    const round2 = (n: number) => Math.round(n * 100 + Number.EPSILON) / 100

    cart.itemsPrice = round2(cart.cartItems.reduce((acc, c) => acc + c.quantity * c.price, 0))
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10)
    cart.taxPrice = round2(0.15 * cart.itemsPrice)
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice

    const { mutateAsync: createOrder, isPending } = useCreateOrderMutation()

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart, navigate])

    const placeOrderHandler = async () => {
        try {
            const data = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            })
            dispatch({ type: 'CART_CLEAR' })
            localStorage.removeItem('cartItems')
            navigate(`/order/${data.order._id}`)
        } catch (err) {
            toast.error(getError(err as ApiError))
        }
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1 className="my-3">Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <CardBody>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name: </strong> {cart.shippingAddress.fullName} <br />
                                <strong>Address: </strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </Card.Text>
                            <Link to='/shipping'>Edit</Link>
                        </CardBody>
                    </Card>
                    <Card className="mb-3">
                        <CardBody>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method: </strong> {cart.paymentMethod}
                            </Card.Text>
                            <Link to='/payment'>Edit</Link>
                        </CardBody>
                    </Card>
                    <Card className="mb-3">
                        <CardBody>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img src={item.image} alt={item.name} className="img-fluid rounded thumbnail" />
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
                            <Link to='/cart'>Edit</Link>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>{cart.itemsPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>{cart.shippingPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>{cart.taxPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Total</strong></Col>
                                        <Col><strong>{cart.totalPrice.toFixed(2)}€</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button type="button" onClick={placeOrderHandler} disabled={cart.cartItems.length === 0 || isPending}>
                                            Place Order
                                        </Button>
                                        {isPending && <LoadingBox />}
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
