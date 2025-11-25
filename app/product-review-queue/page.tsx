"use client";
import React, { useEffect, useState } from 'react'
import Products from './Products'
import ProtectedRoute from '../_components/ProtectedRoute'
import {fetchProducts} from "../_lib/products"


function page() {
    

  return (
    <ProtectedRoute>
      <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
     </section>
    </ProtectedRoute>
  )
}

export default page
