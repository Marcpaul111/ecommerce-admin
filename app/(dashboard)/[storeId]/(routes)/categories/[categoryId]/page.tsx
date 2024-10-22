import prismadb from '@/lib/prismadb'
import React from 'react'
import BannerForm from './components/ClientForm'
import CategoryForm from './components/ClientForm'

const BannerForms = async ({
    params
}: {
    params: {categoryId: string, storeId: string}
}) => {

    const categories = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        }
    })

    const banners = await prismadb.banners.findMany({
        where: {
           storeId: params.storeId
        }
    })
  return (
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm banners={banners} initialData={categories}/>
        </div>
    </div>
  )
}

export default BannerForms