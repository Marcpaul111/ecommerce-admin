"use client";

import React, { useState } from "react";

import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Notyf } from "notyf";
import axios from "axios";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/AlertModal";
import ApiAlert from "@/components/ui/ApiAlert";
import { UseOrigin } from "@/hooks/use-origin";


interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const origin = UseOrigin(); // to avoid hydration error

  const params = useParams();
  const router = useRouter();

  const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'bottom',
      },
  })

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // updating data
  const onSubmit = async (data: SettingsFormValues) => {
    try {
        setLoading(true)
        await axios.patch(`/api/stores/${params.storeId}`, data)
        router.refresh();
        notyf.success('Store successfully updated.')
    } catch (error) {
        notyf.success('Something went wrong.')
    }finally {
        setLoading(false)
    }
  };

  // deleting data
const onDelete = async () => {
  try {
    setLoading(true)

    await axios.delete(`/api/stores/${params.storeId}`)
    router.refresh();
    router.push('/') //return to the active store
    notyf.success('Store successfully deleted!')
  } catch (error) {
    notyf.error('Remove the products and categories first.')
  }finally{
    setLoading(false)
    setOpen(false)
  }
}
  return (
    <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button disabled={loading}  variant="destructive" size={"sm"} onClick={() => setOpen(true)}>
          <Trash className="w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => <FormItem>
                <FormLabel>
                  
                </FormLabel>
                <FormControl>
                    <Input disabled={loading} placeholder="Store name" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>}
            />
          </div>
          <Button disabled={loading} className="ml-auto h-8" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
 
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`}  variant="public"/>
      
    </>
  );
};

export default SettingsForm;
