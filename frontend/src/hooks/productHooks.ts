import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../apiClient"
import { Product } from "../types/Product"

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiClient.get<Product[]>(`api/products`)
      return res.data
    },
  })

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await apiClient.get<Product[]>(`api/products/${slug}`)
      return res.data
    },
  })

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<string[]>(`api/products/categories`)
      return res.data
    },
  })