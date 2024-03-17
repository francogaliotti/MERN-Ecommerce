import { Product } from '../types/Product'
import { Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Rating } from './Rating'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { convertProductToCartItem } from '../utils'
import { toast } from 'react-toastify'

interface ProductItemProps {
    product: Product
}

const ProductItem = ({ product }: ProductItemProps) => {
    const { state, dispatch } = useContext(Store)
    const { cart: { cartItems } } = state
    const navigate = useNavigate()

    const addToCartHandler = (item: CartItem) => {
        const existItem = cartItems.find((x: CartItem) => x._id === item._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        if (product.countInStock < quantity) {
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
        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} className='card-img-top' />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>
                        {product.name}
                    </Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>
                    {product.price}€
                </Card.Text>
                {product.countInStock === 0 ?
                    <Button variant='light' disabled>
                        Out of stock
                    </Button> :
                    <Button variant='primary' onClick={() => addToCartHandler(convertProductToCartItem(product))}>
                        Add to cart
                    </Button>
                }
            </Card.Body>
        </Card>
    )
}

export default ProductItem