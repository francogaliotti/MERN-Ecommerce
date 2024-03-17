import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProductDetailsBySlugQuery } from '../hooks/productHooks'
import { LoadingBox } from '../components/LoadingBox'
import { convertProductToCartItem, getError } from '../utils'
import { ApiError } from '../types/ApiError'
import MessageBox from '../components/MessageBox'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Rating } from '../components/Rating'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { toast } from 'react-toastify'

function ProductPage() {
  const params = useParams()
  const slug = params.slug
  const { data: product, refetch, isLoading, error } = useGetProductDetailsBySlugQuery(slug!)
  const { state, dispatch } = useContext(Store)
  const { cart: { cartItems } } = state
  const navigate = useNavigate()

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x: CartItem) => x._id === item._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product!.countInStock < quantity) {
      toast.error('Sorry, product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity }
    })
    toast.success('Item added to cart')
    navigate('/cart')
  }

  return (
    isLoading ? (
      <LoadingBox />
    ) : error ? (
      <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
    ) : !product ? (
      <MessageBox variant="danger">Product not found</MessageBox>
    ) : (
      <div>
        <Helmet>
          <title>{product.name}</title>
        </Helmet>
        <Row>
          <Col md={6}>
            <img src={product.image} alt={product.name} className='large' />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>{product.name}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating rating={product.rating} numReviews={product.numReviews} />
              </ListGroup.Item>
              <ListGroup.Item>
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col><strong>{product.price}€</strong></Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg='success'>In Stock</Badge>
                        ) : (
                          <Badge bg='danger'>Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 &&
                    (<ListGroup.Item>
                      <div className="d-grid">
                        <Button 
                        variant='primary'
                        onClick={()=> addToCartHandler(convertProductToCartItem(product))}
                        >
                          Add to Cart</Button>
                      </div>
                    </ListGroup.Item>)
                  }
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  )
}

export default ProductPage