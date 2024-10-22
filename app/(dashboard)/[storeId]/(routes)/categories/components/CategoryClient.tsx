"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { CategoryColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'


interface CategoryClientProps{
  data: CategoryColumn[]
}


const CategoryClient: React.FC<CategoryClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();

   

  return (

    <>
    <div className="flex justify-between items-center">
        <Heading title={`Categories (${data.length})`}
        description='Manage your categories for you store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
            <Plus className='mr-2 h-4 w-4' />
            Add New
        </Button>
    </div>
    <Separator />

    <DataTable searchKey='name' columns={columns} data={data}/>
    <Heading title="API"
        description='API calls for categories'
        />
        <Separator />
        <ApiList entityName='categories' entityIdName='categoryId' />
    </>
  )
}

export default CategoryClient