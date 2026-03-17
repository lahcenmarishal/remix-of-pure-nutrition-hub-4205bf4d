import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

const ImageUpload = ({ value, onChange, folder = "products" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err: any) {
      toast({ title: "Erreur d'upload", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
        >
          <Upload className="w-6 h-6 mb-1" />
          <span className="text-xs">{uploading ? "Upload..." : "Image"}</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default ImageUpload;
