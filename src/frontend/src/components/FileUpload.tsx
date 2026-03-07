import { cn } from "@/lib/utils";
import { ImageIcon, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  label: string;
  accept?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  uploadButtonId?: string;
  dropzoneId?: string;
  optional?: boolean;
}

export function FileUpload({
  label,
  accept = "image/*",
  value,
  onChange,
  uploadButtonId,
  dropzoneId,
  optional = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputId = `file-upload-${uploadButtonId ?? Math.random().toString(36).slice(2)}`;

  const handleFile = (file: File | null) => {
    onChange(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  const handleRemove = () => {
    handleFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold uppercase tracking-widest text-gold/80"
      >
        {label}
        {optional && (
          <span className="ml-2 text-muted-foreground normal-case tracking-normal font-normal">
            (optional)
          </span>
        )}
      </label>

      {value && preview ? (
        <div className="relative rdx-card rounded-md overflow-hidden">
          <img src={preview} alt={label} className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-dark-base/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground rounded-full p-1 hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 right-2">
            <span className="text-xs bg-dark-base/80 text-gold px-2 py-1 rounded">
              {value.name.length > 20
                ? `${value.name.slice(0, 17)}...`
                : value.name}
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          data-ocid={dropzoneId}
          aria-label={`Upload ${label}`}
          className={cn(
            "w-full border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all",
            isDragging
              ? "border-gold/80 bg-gold/5"
              : "border-border hover:border-gold/40 hover:bg-dark-elevated/50",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-dark-elevated flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gold/50" />
            </div>
            <div>
              <span
                data-ocid={uploadButtonId}
                className="text-gold hover:text-gold/80 text-sm font-semibold underline-offset-2 hover:underline cursor-pointer"
              >
                <Upload className="inline w-3 h-3 mr-1" />
                Click to upload
              </span>
              <span className="text-muted-foreground text-sm">
                {" "}
                or drag & drop
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
