export type CartItem = {
    image: string | undefined
    name: string
    price: number
    countInStock: number
    slug: string
    quantity: number
    _id: string
}

export type ShippingAddress = {
    fullName: string
    address: string
    city: string
    postalCode: string
    country: string
}

export type Cart = {
    cartItems: CartItem[]
    shippingAddress: ShippingAddress
    paymentMethod: string
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
    _id: string
}