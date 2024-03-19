import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { UserInfo } from "../types/UserInfo";

interface UserCredentials {
    name?: string
    email: string
    password: string
}

export const useSignInMutation = () => useMutation({
    mutationFn: async ({email, password}: UserCredentials) => {
        const res = await apiClient.post<UserInfo>('api/users/signin', {
            email, 
            password
        })
        return res.data
    }
})

export const useSignUpMutation = () => useMutation({
    mutationFn: async ({name, email, password}: UserCredentials) => {
        const res = await apiClient.post<UserInfo>('api/users/signup', {
            name,
            email, 
            password
        })
        return res.data
    }
})