import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useGetOrderDetailsQuery = (id: string) => useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
        const res = await apiClient.get<Order>(`api/orders/${id}`)
        return res.data
    }
})


export const useCreateOrderMutation = () => useMutation({
    mutationFn: async (order: IOrder) => {
        const res = await apiClient.post<{ message: string; order: Order }>('api/orders', order)
        return res.data
    }
})