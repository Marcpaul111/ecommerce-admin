"use client";

import React, { useState } from "react";

import { Sizes } from "@prisma/client";
import { Trash } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Notyf } from "notyf";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/AlertModal";

import { UseOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/ImageUpload";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

interface SizesFormProps {
  initialData: Sizes | null;
}

type SizesFormValues = z.infer<typeof formSchema>;

const SizesForm: React.FC<SizesFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const origin = UseOrigin(); // to avoid hydration error

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit size" : "Add size";
  const toastMessage = initialData ? "Size updated!" : "Size created!";
  const action = initialData ? "Save Changes" : "Create";

  const notyf = new Notyf({
    position: {
      x: "right",
      y: "bottom",
    },
  });

  const form = useForm<SizesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: '',
    },
  });

  // updating data
  const onSubmit = async (data: SizesFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.push(`/${params.storeId}/sizes`)
      router.refresh();
      notyf.success(toastMessage);
    } catch (error) {
      notyf.success("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // deleting data
  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.push(`/${params.storeId}/sizes`); 
      router.refresh();
      notyf.success("Size successfully deleted!");
    } catch (error) {
      notyf.error("Remove the products that using this size first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size={"sm"}
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4" />
          </Button>
        )}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto h-8" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizesForm;
