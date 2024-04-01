import { SyntheticEvent, useState } from 'react'
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export const SearchBox = () => {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')

    const submitHandler = (e: SyntheticEvent) => {
        e.preventDefault()
        navigate(query ? `/search?query=${query}` : '/search')
    }
    return (
        <Form className='flex-grow-1 d-flex me-auto' onSubmit={submitHandler}>
            <InputGroup>
                <FormControl
                    type='text'
                    name='q'
                    id='q'
                    placeholder='Search'
                    aria-label='Search'
                    aria-describedby='button-search'
                    onChange={(e) => setQuery(e.target.value)}
                    ></FormControl>
                <Button
                    variant='outline-primary'
                    type='submit'
                    id='button-search'
                >
                    <i className="fas fa-search"></i>
                </Button>
            </InputGroup>
        </Form>
    )
}
