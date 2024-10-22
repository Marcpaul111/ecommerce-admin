import prismadb from '@/lib/prismadb'
import React from 'react'
import ColorForm from './components/ColorForm'

const ColorForms = async ({
    params
}: {
    params: {colorId: string}
}) => {

    const color = await prismadb.colors.findUnique({
        where: {
            id: params.colorId
        }
    })
  return (
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ColorForm initialData={color}/>
        </div>
    </div>
  )
}

export default ColorForms