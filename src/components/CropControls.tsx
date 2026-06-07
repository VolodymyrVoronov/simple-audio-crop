import { ScissorsLineDashedIcon } from "lucide-react";

import type { OutputFormat } from "@/types";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface ICropControlsProps {
  startTime: number;
  endTime: number;
  isCropping: boolean;
  outputFormat: OutputFormat;

  onFormatChange: (format: OutputFormat) => void;
  onCrop: () => void;
}

const CropControls = ({
  startTime,
  endTime,
  isCropping,
  outputFormat,

  onFormatChange,
  onCrop,
}: ICropControlsProps) => {
  const selectedLength = Math.max(0, endTime - startTime);

  const handleFormatChange = (value: string) => {
    onFormatChange(value as OutputFormat);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3>Crop Settings</h3>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <Label htmlFor="format" className="w-auto font-semibold">
            Output Format:
          </Label>

          <ToggleGroup
            id="format"
            type="single"
            value={outputFormat}
            onValueChange={handleFormatChange}
            aria-label="Output format"
            spacing={0}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <ToggleGroupItem
              value="mp3"
              disabled={isCropping}
              className="flex-1"
            >
              MP3
            </ToggleGroupItem>

            <ToggleGroupItem
              value="wav"
              disabled={isCropping}
              className="flex-1"
            >
              WAV
            </ToggleGroupItem>

            <ToggleGroupItem
              value="ogg"
              disabled={isCropping}
              className="flex-1"
            >
              OGG
            </ToggleGroupItem>

            <ToggleGroupItem
              value="flac"
              disabled={isCropping}
              className="flex-1"
            >
              FLAC
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <Button
        onClick={onCrop}
        disabled={isCropping || selectedLength <= 0}
        variant="outline"
        className="border-primary dark:border-primary border-dashed shadow-none"
        size="lg"
      >
        <ScissorsLineDashedIcon />
        {isCropping ? "Cropping..." : "Crop Audio"}
      </Button>
    </div>
  );
};

export default CropControls;
