"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { ColorColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'


interface ColorsClientProps{
  data: ColorColumn[]
}


const ColorClient: React.FC<ColorsClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();

   

  return (

    <>
    <div className="flex justify-between items-center">
        <Heading title={`Colors (${data.length})`}
        description='Manage your colors for you products'
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
            <Plus className='mr-2 h-4 w-4' />
            Add Color
        </Button>
    </div>
    <Separator />

    <DataTable searchKey='name' columns={columns} data={data}/>
    <Heading title="API"
        description='API calls for colors'
        />
        <Separator />
        <ApiList entityName='colors' entityIdName='colorId' />
    </>
  )
}

export default ColorClient