"use client"

import React from 'react'
import { SignUp } from '@clerk/nextjs'

export const SignUpPage = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
        <SignUp />
    </div>
  )
}

export default SignUpPage