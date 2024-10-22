"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { SizesColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'


interface SizesClientProps{
  data: SizesColumn[]
}


const SizesClient: React.FC<SizesClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();

   

  return (

    <>
    <div className="flex justify-between items-center">
        <Heading title={`Sizes (${data.length})`}
        description='Manage your sizes for you products'
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
            <Plus className='mr-2 h-4 w-4' />
            Add Size
        </Button>
    </div>
    <Separator />

    <DataTable searchKey='name' columns={columns} data={data}/>
    <Heading title="API"
        description='API calls for sizes'
        />
        <Separator />
        <ApiList entityName='sizes' entityIdName='sizeId' />
    </>
  )
}

export default SizesClient