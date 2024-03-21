import React from 'react'
import { Cart, CartItem, ShippingAddress } from './types/Cart'
import { UserInfo } from './types/UserInfo'

type AppState = {
    mode: string
    cart: Cart
    userInfo?: UserInfo
}

const initialState: AppState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : null,

    mode: localStorage.getItem('item')
        ? localStorage.getItem('item')!
        : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',

    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems')!)
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress')!)
            : {
                fullName: '',
                address: '',
                city: '',
                postalCode: '',
                country: ''
            },
        paymentMethod: localStorage.getItem('paymentMethod')
            ? localStorage.getItem('paymentMethod')!
            : '',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        _id: ''
    }
}


type Action =
    | { type: 'SWITCH_MODE' }
    | { type: 'CART_ADD_ITEM'; payload: CartItem }
    | { type: 'CART_REMOVE_ITEM'; payload: CartItem }
    | { type: 'USER_SIGNIN'; payload: UserInfo }
    | { type: 'USER_SIGNOUT' }
    | { type: 'SAVE_SHIPPING_ADDRESS'; payload: ShippingAddress }
    | { type: 'SAVE_PAYMENT_METHOD'; payload: string }
    | { type: 'CART_CLEAR' }

const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SWITCH_MODE':
            localStorage.setItem('mode', state.mode === 'light' ? 'dark' : 'light')
            return { ...state, mode: state.mode === 'light' ? 'dark' : 'light' }
        case 'CART_ADD_ITEM': {
            const item = action.payload
            const existItem = state.cart.cartItems.find((x: CartItem) => x._id === item._id)
            const cartItems = existItem
                ? state.cart.cartItems.map((x: CartItem) => x._id === existItem._id ? item : x)
                : [...state.cart.cartItems, item]
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }
        }
        case 'CART_REMOVE_ITEM': {
            const item = action.payload
            const cartItems = state.cart.cartItems.filter((x: CartItem) => x._id !== item._id)
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }
        }
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload }
        case 'USER_SIGNOUT':
            return {
                mode: window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light',
                cart: {
                    cartItems: [],
                    shippingAddress: {
                        fullName: '',
                        address: '',
                        city: '',
                        postalCode: '',
                        country: ''
                    },
                    paymentMethod: 'PayPal',
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                    _id: ''
                }
            }

        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload
                }
            }

        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    paymentMethod: action.payload
                }
            }

        case 'CART_CLEAR':
            return {
                ...state, cart: {
                    ...state.cart,
                    cartItems: [],
                }
            }

        default:
            return state
    }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState

export const Store = React.createContext({
    state: initialState,
    dispatch: defaultDispatch
})

// eslint-disable-next-line @typescript-eslint/ban-types
export const StoreProvider = (props: React.PropsWithChildren<{}>) => {
    const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(reducer, initialState)

    return <Store.Provider value={{ state, dispatch }} {...props} />
}
