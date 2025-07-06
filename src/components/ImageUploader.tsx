import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import api from "../services/api";

interface Point {
  x: number;
  y: number;
}
interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  folder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImageUrl = "",
  folder = "images",
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas size to the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const uploadImage = async () => {
    if (!image || !croppedAreaPixels) {
      setError("Please select and crop an image first");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the cropped image as a blob
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("image", croppedImage, `${Date.now()}.jpg`);
      formData.append("folder", folder);

      // Upload through our API proxy instead of directly to Vercel Blob
      const response = await api.post("/uploads/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Pass the URL back to the parent component
      onImageUploaded(response.data.url);

      // Reset the state
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelUpload = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!image ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {/* <label className="block text-sm font-medium text-gray-700">
              Image
            </label> */}
            {currentImageUrl && (
              <span className="text-xs text-blue-600">
                Current image available
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {currentImageUrl && (
              <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                <img
                  src={currentImageUrl}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zoom
            </label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelUpload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={uploadImage}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Uploading...
                </>
              ) : (
                "Upload Image"
              )}
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
};
