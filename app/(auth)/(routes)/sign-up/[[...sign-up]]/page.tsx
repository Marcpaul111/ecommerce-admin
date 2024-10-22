"use client";

import React from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage: React.FC = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <SignUp />
    </div>
  );
};

export default SignUpPage;
