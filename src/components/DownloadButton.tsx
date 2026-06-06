import { DownloadIcon } from "lucide-react";

import { formatSize } from "@/helpers";

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

  return (
    <div className="flex flex-col gap-1 w-full">
      <h3>Crop Complete</h3>

      <p className="font-semibold">{fileName}</p>

      {fileSize && (
        <p className="text-muted-foreground">Size: {formatSize(fileSize)}</p>
      )}

      <Button
        asChild
        className="bg-sky-600/10 text-sky-600 hover:bg-sky-600/20 focus-visible:border-sky-600/40 focus-visible:ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:hover:bg-sky-400/20 dark:focus-visible:border-sky-400/40 dark:focus-visible:ring-sky-400/40"
      >
        <a href={downloadUrl} download={fileName}>
          <DownloadIcon />
          Download Cropped Audio
        </a>
      </Button>
    </div>
  );
};

export default DownloadButton;
