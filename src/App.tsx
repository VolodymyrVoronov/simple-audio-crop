import { useState } from "react";
import { gooeyToast } from "goey-toast";

import { useFFmpeg } from "./hooks/useFFmpeg";
import type { OutputFormat } from "./types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AudioUploader from "./components/AudioUploader";
import CropControls from "./components/CropControls";
import DownloadButton from "./components/DownloadButton";
import WaveformEditor from "./components/WaveformEditor";
import { Badge } from "@/components/ui/badge";

const App = () => {
  const [audioFile, setAudioFile] = useState<File>();
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [cropStart, setCropStart] = useState<number>(0);
  const [cropEnd, setCropEnd] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("mp3");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>("");
  const [downloadFileSize, setDownloadFileSize] = useState<number>(0);

  const { loaded, isCropping, cropAudio } = useFFmpeg();

  const handleAudioUpload = (file: File) => {
    if (!file) return;

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const newAudioUrl = URL.createObjectURL(file);

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    setAudioFile(file);
    setAudioUrl(newAudioUrl);
  };

  const handleRegionChange = (start: number, end: number) => {
    setCropStart(start);
    setCropEnd(end);
  };

  const handleCrop = async () => {
    if (!audioFile) {
      gooeyToast.error("Please upload an audio file.");
      alert("Please upload an audio file.");
      return;
    }

    if (!loaded) {
      gooeyToast.error("FFmpeg is still loading. Please wait a few seconds.");
      alert("FFmpeg is still loading. Please wait a few seconds.");
      return;
    }

    try {
      const result = await cropAudio(
        audioFile,
        cropStart,
        cropEnd,
        outputFormat,
      );

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      setDownloadUrl(result.downloadUrl);
      setDownloadFileName(result.fileName);
      setDownloadFileSize(result.blob.size);
    } catch (error) {
      gooeyToast.error("Failed to crop audio.");
      console.error(error);
      alert("Failed to crop audio. Check the browser console for details.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen  w-full overflow-auto">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Audio Cropper</CardTitle>
          <CardDescription>
            Upload audio, select a region, crop it locally in your browser, and
            download the result.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <AudioUploader
            file={audioFile}
            disabled={!loaded || isCropping}
            onFileSelect={handleAudioUpload}
          />

          {!loaded && (
            <div className="animate-pulse">
              <Badge className="rounded-sm border-transparent bg-linear-to-r from-indigo-500 to-pink-500 bg-size-[105%] bg-center text-white">
                Loading FFmpeg...
              </Badge>
            </div>
          )}

          {audioUrl && (
            <>
              <WaveformEditor
                audioUrl={audioUrl}
                disabled={isCropping}
                onRegionChange={handleRegionChange}
              />

              <CropControls
                startTime={cropStart}
                endTime={cropEnd}
                isCropping={isCropping}
                outputFormat={outputFormat}
                onFormatChange={setOutputFormat}
                onCrop={handleCrop}
              />
            </>
          )}
        </CardContent>

        {audioUrl && downloadUrl && (
          <CardFooter>
            <DownloadButton
              downloadUrl={downloadUrl}
              fileName={downloadFileName || `cropped.${outputFormat}`}
              fileSize={downloadFileSize}
              disabled={isCropping}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default App;

