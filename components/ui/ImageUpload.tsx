import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
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
  value,
}) => {
  const [isPending, startTransition] = useTransition();
  const [localImages, setLocalImages] = useState<
    Array<{
      id: string;
      preview: string;
      uploaded: string | null;
      isLoading: boolean;
    }>
  >([]);
  const inputImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalImages(
      value.map((url, index) => ({
        id: `${url}-${index}`,
        preview: url,
        uploaded: url,
        isLoading: false,
      }))
    );
  }, [value]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      preview: URL.createObjectURL(file),
      uploaded: null,
      isLoading: true,
    }));

    setLocalImages((prev) => [...prev, ...newImages]);

    startTransition(async () => {
      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          try {
            const { imageUrl } = await uploadImage({
              file,
              bucket: "ecommerce",
            });
            return {
              id: newImages[index].id,
              uploaded: imageUrl,
            };
          } catch (error) {
            console.error("Upload error:", error);
            return {
              id: newImages[index].id,
              uploaded: null,
            };
          }
        })
      );

      setLocalImages((prev) => {
        const updated = prev.map((img) => {
          const uploadResult = uploadedImages.find((u) => u.id === img.id);
          if (uploadResult) {
            return {
              ...img,
              uploaded: uploadResult.uploaded,
              isLoading: false,
            };
          }
          return img;
        });

        const validUrls = updated
          .filter((img) => img.uploaded)
          .map((img) => img.uploaded!);

        onChange(validUrls);

        return updated;
      });
    });

    if (inputImageRef.current) {
      inputImageRef.current.value = "";
    }
  };

  const handleRemove = (imageId: string) => {
    const imageToRemove = localImages.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    setLocalImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      const validUrls = filtered
        .filter((img) => img.uploaded)
        .map((img) => img.uploaded!);

      onChange(validUrls);

      if (imageToRemove.uploaded) {
        onRemove(imageToRemove.uploaded);
      }

      return filtered;
    });
  };

  return (
    <div className="py-5">
      <input
        type="file"
        ref={inputImageRef}
        hidden
        onChange={handleImageChange}
        disabled={disabled || isPending}
        accept="image/*"
        multiple
      />
      <div className="flex gap-4 flex-wrap">
        {localImages.map(({ id, preview, uploaded, isLoading }) => (
          <div key={id} className="relative rounded-md">
            <Button
              className="absolute top-2 right-2 z-10"
              variant="destructive"
              size="icon"
              onClick={() => handleRemove(id)}
              disabled={isLoading}
              type="button"
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
                alt="Uploaded image"
                width={200}
                height={200}
                className="object-cover h-[200px] w-[200px] rounded-md"
              />
            )}
          </div>
        ))}
      </div>
      {(localImages.length === 0 || value.length > 1) && (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputImageRef.current?.click()}
          disabled={disabled || isPending}
          className="mt-4"
        >
          <Images className="h-6 w-6 mr-2" />
          Upload Image
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;