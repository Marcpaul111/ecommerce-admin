"use client";

import { convertBlobUrlToFile } from "@/lib/utils";
import { ChangeEvent, useEffect, useRef, useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { uploadImage } from "@/utils/storage/client";
import { Images, Trash, Loader2 } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (url: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isPending, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<{ preview: string; uploaded: string | null; isLoading: boolean }[]>([]);
  const inputImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageUrls(value.map(url => ({ preview: url, uploaded: url, isLoading: false })));
  }, [value]);

  const handleImageChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        preview: URL.createObjectURL(file),
        uploaded: null,
        isLoading: true,
      }));
      setImageUrls((prev) => [...prev, ...newImages]);
      await handleUploadImages(newImages);
    }
  }, []);

  const handleUploadImages = useCallback(async (images: { preview: string; uploaded: string | null; isLoading: boolean }[]) => {
    startTransition(async () => {
      const uploadedImages = await Promise.all(
        images.map(async ({ preview }) => {
          const imageFile = await convertBlobUrlToFile(preview);
          const { imageUrl, error } = await uploadImage({ file: imageFile, bucket: "ecommerce" });

          if (error) {
            console.error(error);
            return { preview, uploaded: null, isLoading: false };
          }
          return { preview, uploaded: imageUrl, isLoading: false };
        })
      );

      setImageUrls((prev) => {
        const updatedUrls = prev.map((image) =>
          uploadedImages.find((uploaded) => uploaded.preview === image.preview) || image
        );
        const uploadedUrls = updatedUrls.map(({ uploaded }) => uploaded).filter(Boolean) as string[];
        onChange(uploadedUrls);
        return updatedUrls;
      });
    });
  }, [onChange]);

  const handleRemove = useCallback((urlToRemove: string) => {
    setImageUrls((prevUrls) => {
      const updatedUrls = prevUrls.filter((url) => url.preview !== urlToRemove);
      const uploadedUrls = updatedUrls.map(({ uploaded }) => uploaded).filter(Boolean) as string[];
      onChange(uploadedUrls);
      return updatedUrls;
    });
    onRemove(urlToRemove);
  }, [onChange, onRemove]);

  return (
    <div className="py-5">
      <input
        type="file"
        ref={inputImageRef}
        multiple
        hidden
        onChange={handleImageChange}
        disabled={disabled || isPending}
      />
      <div className="flex gap-4 flex-wrap">
        {imageUrls.map(({ preview, uploaded, isLoading }, index) => (
          <div key={preview} className="relative rounded-md">
            <Button
              className="absolute top-2 right-2 z-10"
              variant="destructive"
              size="icon"
              onClick={() => handleRemove(preview)}
              disabled={isLoading}
            >
              <Trash className="h-4 w-4" />
            </Button>
            {isLoading ? (
              <div className="h-[200px] w-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <Image 
                src={uploaded || preview} 
                alt={`Uploaded image ${index + 1}`} 
                width={200} 
                height={200} 
                className="object-cover h-[200px] w-[200px] rounded-md"
              />
            )}
          </div>
        ))}
      </div>
      {imageUrls.length === 0 && (
        <Button
          variant="outline"
          onClick={() => inputImageRef.current?.click()}
          disabled={disabled || isPending}
        >
          <Images className="h-6 w-6 mr-2" />
          Upload Image
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;