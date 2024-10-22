"use client";

import React, { useState } from "react";

import { Colors } from "@prisma/client";
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

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be valid hex code'
  }),
});

interface ColorsFormProps {
  initialData: Colors | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorsFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const origin = UseOrigin(); // to avoid hydration error

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData ? "Edit color" : "Add color";
  const toastMessage = initialData ? "Color updated!" : "Color created!";
  const action = initialData ? "Save Changes" : "Create";

  const notyf = new Notyf({
    position: {
      x: "right",
      y: "bottom",
    },
  });

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: '',
    },
  });

  // updating data
  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.push(`/${params.storeId}/colors`)
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

      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.push(`/${params.storeId}/colors`); 
      router.refresh();
      notyf.success("Color successfully deleted!");
    } catch (error) {
      notyf.error("Remove the products that using this color first.");
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                    <Input
                      disabled={loading}
                      placeholder="Color value"
                      {...field}
                    />
                    <div 
                    className="border p-4 rounded-lg"
                    style={{backgroundColor: field.value}}
                    />
                    </div>
                   
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

export default ColorForm;
