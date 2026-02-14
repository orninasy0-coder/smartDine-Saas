import { useState, useRef } from 'react';
import { Upload, X, Image, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number; // in MB
  currentUrl?: string;
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  type: 'image' | 'model';
  disabled?: boolean;
}

export function FileUpload({
  label,
  accept,
  maxSize,
  currentUrl,
  onUpload,
  onRemove,
  type,
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map((t) => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    const isValidType = acceptedTypes.some(
      (acceptedType) =>
        acceptedType === fileExtension ||
        acceptedType === mimeType ||
        (acceptedType.endsWith('/*') &&
          mimeType.startsWith(acceptedType.replace('/*', '')))
    );

    if (!isValidType) {
      return `Invalid file type. Accepted: ${accept}`;
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview for images
    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    setIsUploading(true);
    try {
      const url = await onUpload(file);
      setPreviewUrl(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {previewUrl ? (
        <Card className="relative overflow-hidden">
          {type === 'image' ? (
            <div className="relative aspect-video bg-muted">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4">
              <Box className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">3D Model Uploaded</p>
                <p className="text-xs text-muted-foreground">{previewUrl}</p>
              </div>
            </div>
          )}

          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </Card>
      ) : (
        <Card
          className={`cursor-pointer border-2 border-dashed transition-colors hover:border-primary ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={disabled ? undefined : handleClick}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {type === 'image' ? (
              <Image className="mb-2 h-12 w-12 text-muted-foreground" />
            ) : (
              <Box className="mb-2 h-12 w-12 text-muted-foreground" />
            )}
            <p className="mb-1 text-sm font-medium">
              {isUploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept} (max {maxSize}MB)
            </p>
          </div>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-4 w-4 animate-pulse" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
