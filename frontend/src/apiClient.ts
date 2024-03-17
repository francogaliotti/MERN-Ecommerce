import axios from "axios"

export const apiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '',
    headers: {
        'Content-Type': 'application/json',
    },
})