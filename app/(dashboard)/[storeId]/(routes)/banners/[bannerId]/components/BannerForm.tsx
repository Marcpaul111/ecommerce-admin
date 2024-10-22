"use client";

import React, { useState } from "react";

import { Banners } from "@prisma/client";
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
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

interface BannerFormProps {
  initialData: Banners | null;
}

type BannerFormValues = z.infer<typeof formSchema>;

const BannerForm: React.FC<BannerFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const origin = UseOrigin(); // to avoid hydration error

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Banner" : "Create Banner";
  const description = initialData ? "Edit a banner" : "Add new banner";
  const toastMessage = initialData ? "Banner updated!" : "Banner created!";
  const action = initialData ? "Save Changes" : "Create";

  const notyf = new Notyf({
    position: {
      x: "right",
      y: "bottom",
    },
  });

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  // updating data
  const onSubmit = async (data: BannerFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/banners/${params.bannerId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/banners`, data);
      }
      router.push(`/${params.storeId}/banners`);
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

      await axios.delete(`/api/${params.storeId}/banners/${params.bannerId}`);
      router.push(`/${params.storeId}/banners`);
      router.refresh();
      notyf.success("Banner successfully deleted!");
    } catch (error) {
      notyf.error("Remove the categories that using this banner first.");
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={
                      form.watch("imageUrl") ? [form.watch("imageUrl")] : []
                    }
                    disabled={loading}
                    onChange={(urls) =>
                      form.setValue("imageUrl", urls[0] || "")
                    }
                    onRemove={() => form.setValue("imageUrl", "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Banner name"
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

export default BannerForm;
