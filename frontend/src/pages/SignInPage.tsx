import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Store } from "../Store"
import { useSignInMutation } from "../hooks/userHooks"
import { toast } from "react-toastify"
import { getError } from "../utils"
import { ApiError } from "../types/ApiError"
import { Button, Container, Form } from "react-bootstrap"
import { Helmet } from "react-helmet-async"
import { LoadingBox } from "../components/LoadingBox"


export const SignInPage = () => {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state

    const { mutateAsync: signin, isPending } = useSignInMutation()

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const data = await signin({
                email,
                password
            })
            dispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect)
        } catch (err) {
            toast.error(getError(err as ApiError))
        }
    }


    return (
        <Container className="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button disabled={isPending} type="submit">
                        Sign In
                    </Button>
                    { isPending && <LoadingBox/> }
                </div>
                <div className="mb-3">
                    new customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create yout account</Link>
                </div>
            </Form>
        </Container>
    )
}
