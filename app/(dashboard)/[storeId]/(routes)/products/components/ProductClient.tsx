"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { ProductColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'


interface ProductClientProps{
  data: ProductColumn[]
}


const ProductClient: React.FC<ProductClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();

   

  return (

    <>
    <div className="flex justify-between items-center">
        <Heading title={`Products (${data.length})`}
        description='Manage your products for you store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
            <Plus className='mr-2 h-4 w-4' />
            Add New
        </Button>
    </div>
    <Separator />

    <DataTable searchKey='name' columns={columns} data={data}/>
    <Heading title="API"
        description='API calls for products'
        />
        <Separator />
        <ApiList entityName='products' entityIdName='productId' />
    </>
  )
}

export default ProductClient