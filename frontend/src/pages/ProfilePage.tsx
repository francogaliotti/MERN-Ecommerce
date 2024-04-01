import { SyntheticEvent, useContext, useState } from "react"
import { Store } from "../Store"
import { useUpdateProfileMutation } from "../hooks/userHooks"
import { toast } from "react-toastify"
import { getError } from "../utils"
import { ApiError } from "../types/ApiError"
import { Helmet } from "react-helmet-async"
import { Button, Form } from "react-bootstrap"
import { LoadingBox } from "../components/LoadingBox"

export const ProfilePage = () => {
    const { state, dispatch } = useContext(Store)
    const { userInfo } = state
    const [name, setName] = useState(userInfo!.name)
    const [email, setEmail] = useState(userInfo!.email)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation()

    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            if (password !== confirmPassword) {
                toast.error('Passwords do not match')
                return
            }
            const data = await updateProfile({
                name,
                email,
                password
            })
            dispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            toast.success('User updated successfully!')
        } catch (err) {
            toast.error(getError(err as ApiError))
        }
    }

    return (
        <div className="container small-container">
            <Helmet>
                <title>{name}'s Profile</title>
            </Helmet>
            <h1 className="my-3">User Profile</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        required
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button disabled={isPending} type="submit">
                        Update Profile
                    </Button>
                    {isPending && <LoadingBox />}
                </div>
            </Form>
        </div>
    )
}
