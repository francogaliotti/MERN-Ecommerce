import { Badge, Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { Store } from './Store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LinkContainer } from 'react-router-bootstrap'

function App() {

  const { state: { mode, cart, userInfo }, dispatch } = useContext(Store)

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signOutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  return (
    <div className='d-flex flex-column vh-100'>
      <header>
        <ToastContainer position='bottom-center' limit={1} />
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
            {userInfo ? (
              <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                <LinkContainer to='/orderhistory'>
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signOutHandler}
                >
                  {' '}
                  Sign Out{' '}
                </Link>
              </NavDropdown>
            ) : (
              <Nav.Link href='/signin'>Sign In</Nav.Link>
            )}
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
