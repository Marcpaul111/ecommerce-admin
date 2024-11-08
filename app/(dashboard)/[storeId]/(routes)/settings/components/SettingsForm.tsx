"use client";

import React, { useState } from "react";
import { MobileImage, Store, StoreImage } from "@prisma/client";
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
import ApiAlert from "@/components/ui/ApiAlert";
import { UseOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/ImageUpload";

interface SettingsFormProps {
  initialData: Store & { images: StoreImage[]; mobileUrl: MobileImage[] };
}

const formSchema = z.object({
  name: z.string().min(1),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  mobileImageUrls: z.array(z.string()).optional(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const origin = UseOrigin();
  const params = useParams();
  const router = useRouter();

  const notyf = new Notyf({
    position: { x: "right", y: "bottom" },
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      facebookUrl: initialData.facebookUrl || "",
      twitterUrl: initialData.twitterUrl || "",
      instagramUrl: initialData.instagramUrl || "",
      logoUrl: initialData.logoUrl || "",
      imageUrls: initialData.images.map((img) => img.url),
      mobileImageUrls: initialData.mobileUrl ? initialData.mobileUrl.map((img) => img.mobileUrl) : []
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}`, data);
      router.refresh();
      notyf.success("Store updated successfully.");
    } catch (error) {
      notyf.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}`);
      router.refresh();
      router.push("/");
      notyf.success("Store successfully deleted!");
    } catch (error) {
      notyf.error("Remove the products and categories first.");
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
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                      className="w-1/2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url[0])}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || []}
                    disabled={loading}
                    onChange={(urls) => field.onChange(urls)}
                    onRemove={(url) =>
                      field.onChange(
                        (field.value || []).filter((current) => current !== url)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          {/* mobile banners */}
          <FormField
            control={form.control}
            name="mobileImageUrls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Billboard Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || []}
                    disabled={loading}
                    onChange={(urls) => field.onChange(urls)}
                    onRemove={(url) =>
                      field.onChange(
                        (field.value || []).filter((current) => current !== url)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="grid grid-cols-3 gap-8">
            {/* Facebook */}
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Link</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Your Facebook Link"
                      {...field}
                      className="w-1/2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* instagram */}
            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Link</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Your Instagram Link"
                      {...field}
                      className="w-1/2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* twitter */}
            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Link</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Your Twitter Link"
                      {...field}
                      className="w-1/2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto mt-12" type="submit">
            Save changes
          </Button>
        </form>
      </Form>

      <Separator className="my-4" />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
}
