import React from 'react'
import { Cart, CartItem } from './types/Cart'

type AppState = {
    mode: string
    cart: Cart
}

const initialState: AppState = {
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


type Action = { type: 'SWITCH_MODE' } | { type: 'CART_ADD_ITEM'; payload: CartItem }

const reducer = (state: AppState, action: Action): AppState => {
        switch (action.type) {
            case 'SWITCH_MODE':
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
