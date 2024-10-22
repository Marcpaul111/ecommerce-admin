import prismadb from '@/lib/prismadb'
import React from 'react'
import SizeForm from './components/SizeForm'

const SizeForms = async ({
    params
}: {
    params: {sizeId: string}
}) => {

    const sizes = await prismadb.sizes.findUnique({
        where: {
            id: params.sizeId
        }
    })
  return (
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeForm initialData={sizes}/>
        </div>
    </div>
  )
}

export default SizeForms