import { Button } from "@/components/ui/button";

export interface IDownloadButtonProps {
  downloadUrl: string | null;
  fileName: string;
  fileSize?: number;
}

const DownloadButton = ({
  downloadUrl,
  fileName,
  fileSize,
}: IDownloadButtonProps) => {
  if (!downloadUrl) {
    return null;
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="">
      <h3>Crop Complete</h3>

      <p>{fileName}</p>

      {fileSize && <p>Size: {formatSize(fileSize)}</p>}

      <Button asChild>
        <a href={downloadUrl} download={fileName}>
          Download Cropped Audio
        </a>
      </Button>
    </div>
  );
};

export default DownloadButton;
