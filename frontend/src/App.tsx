import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { Store } from './Store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LinkContainer } from 'react-router-bootstrap'

function App() {

  const { state: { mode, cart }, dispatch } = useContext(Store)

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  return (
    <div className='d-flex flex-column vh-100'>
      <header>
      <ToastContainer position='bottom-center' limit={1}/>
        <Navbar expand='lg'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Mern-Ecommerce</Navbar.Brand>
          </LinkContainer>
        </Container>
        <Nav>
          <Button variant={mode} onClick={switchModeHandler}>
            <i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}></i>
          </Button>
          <Nav.Link href='/cart'>
            Cart
            {cart.cartItems.length > 0 && (
              <Badge pill bg='danger'>
                {cart.cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </Badge>
            )}
          </Nav.Link>
          <Nav.Link href='/signin'>Sign In</Nav.Link>
        </Nav>
      </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer>
        <div className="text-center">
          All right reserved
        </div>
      </footer>
    </div>
  )
}

export default App
