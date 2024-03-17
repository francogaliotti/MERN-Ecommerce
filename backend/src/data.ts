import { Product } from "./types/Product";

export const sampleProducts: Product[] = [
    {
        name: "Slim Shirt",
        slug: "slim-shirt",
        image: "/images/p1.jpg",
        price: 60,
        brand: "Nike",
        rating: 4.5,
        numReviews: 10,
        countInStock: 6,
        category: "Shirts",
        description: "Slim fit shirt"
    },
    {
        name: "Fit Shirt",
        slug: "fit-shirt",
        image: "/images/p2.jpg",
        price: 50,
        brand: "Adidas",
        rating: 2.1,
        numReviews: 5,
        countInStock: 6,
        category: "Shirts",
        description: "Fit shirt"
    },
    {
        name: "Best Pants",
        slug: "best-pants",
        image: "/images/p3.jpg",
        price: 70,
        brand: "Nike",
        rating: 4.5,
        numReviews: 8,
        countInStock: 0,
        category: "Pants",
        description: "Best pants"
    }
]