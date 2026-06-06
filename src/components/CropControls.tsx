import { ScissorsLineDashedIcon } from "lucide-react";

import { formatTime } from "@/helpers";
import type { OutputFormat } from "@/types";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      <div className="grid gap-2 grid-cols-2 lg:grid-cols-4 items-center">
        <div className="flex gap-2 items-center">
          <Label htmlFor="format" className="font-semibold">
            Output Format
          </Label>

          <Select value={outputFormat} onValueChange={handleFormatChange}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="wav">WAV</SelectItem>
                <SelectItem value="ogg">OGG</SelectItem>
                <SelectItem value="flac">FLAC</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <strong>Start:</strong> {formatTime(startTime)}
        </div>

        <div>
          <strong>End:</strong> {formatTime(endTime)}
        </div>

        <div>
          <strong>Length:</strong> {formatTime(selectedLength)}
        </div>
      </div>

      <Button
        onClick={onCrop}
        disabled={isCropping || selectedLength <= 0}
        variant="outline"
        className="border-primary dark:border-primary border-dashed shadow-none"
      >
        <ScissorsLineDashedIcon />
        {isCropping ? "Cropping..." : "Crop Audio"}
      </Button>
    </div>
  );
};

export default CropControls;
