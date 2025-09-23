import { SplinePointerIcon } from 'lucide-react'
import React from 'react'

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-wrap justify-center items-center ">
            <div className='  px-7 py-7 border-t-4 border-black  rounded-t-full animate-spin' >
                <div className='  px-10 py-10 border-b-4 border-black-500  rounded-b-full animate-spin'>

                </div>
            </div>
        </div>
    )
}
