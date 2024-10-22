"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { BannerColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'


interface BannerClientProps{
  data: BannerColumn[]
}


const BannerClient: React.FC<BannerClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();

   

  return (

    <>
    <div className="flex justify-between items-center">
        <Heading title={`Banners (${data.length})`}
        description='Manage your banners for you store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/banners/new`)}>
            <Plus className='mr-2 h-4 w-4' />
            Add New
        </Button>
    </div>
    <Separator />

    <DataTable searchKey='label' columns={columns} data={data}/>
    <Heading title="API"
        description='API calls for banners'
        />
        <Separator />
        <ApiList entityName='banners' entityIdName='bannerId' />
    </>
  )
}

export default BannerClient