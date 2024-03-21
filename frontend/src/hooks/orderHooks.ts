import { useMutation } from "@tanstack/react-query";
import { CartItem, ShippingAddress } from "../types/Cart";
import { apiClient } from "../apiClient";
import { Order } from "../types/Order";

interface IOrder {
    orderItems: CartItem[]
    shippingAddress: ShippingAddress
    paymentMethod: string
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
}

export const useCreateOrderMutation = () => useMutation({
    mutationFn: async (order: IOrder) => {
        const res = await apiClient.post<{message: string; order: Order}>('api/orders', order)
        return res.data
    }
})