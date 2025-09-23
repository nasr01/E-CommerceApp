'use client'

import { useEffect } from "react";

export default function AllOrders() {

    async function getOrders() {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/orders/user/' + localStorage.getItem('userId'))
        const data = await response.json();

        console.log(data);
    }

    useEffect(() => {
        getOrders();
    }, [])

    return <>
        <h2>AllOrders</h2>
    </>
}

