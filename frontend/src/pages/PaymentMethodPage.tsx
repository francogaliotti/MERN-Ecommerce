import { useNavigate } from "react-router-dom"
import { Store } from "../Store"
import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { CheckoutSteps } from "../components/CheckoutSteps"
import { Helmet } from "react-helmet-async"
import { Button, Form } from "react-bootstrap"

export const PaymentMethodPage = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useContext(Store)
    const { cart: { shippingAddress, paymentMethod } } = state
    const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'PayPal')

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [navigate, shippingAddress])

    const submitHandler = (e: SyntheticEvent) => {
        e.preventDefault()
        dispatch({
            type: 'SAVE_PAYMENT_METHOD',
            payload: paymentMethodName
        })
        localStorage.setItem('paymentMethod', paymentMethodName)
        navigate('/placeorder')
    }

    return (
        <div>
            <Helmet>
                <title>Payment Method</title>
            </Helmet>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <div className="container small-container">
                <h1 className="my-3">Payment Method</h1>
                <Form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="PayPal"
                            label="PayPal"
                            value="PayPal"
                            checked={paymentMethodName === 'PayPal'}
                            onChange={(e) => setPaymentMethodName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Stripe"
                            label="Stripe"
                            value="Stripe"
                            checked={paymentMethodName === 'Stripe'}
                            onChange={(e) => setPaymentMethodName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Button type="submit">Continue</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
