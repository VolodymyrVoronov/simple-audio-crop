import { useState } from "react";

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

const App = () => {
  const [audioFile, setAudioFile] = useState<File>();
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [cropStart, setCropStart] = useState<number>(0);
  const [cropEnd, setCropEnd] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("mp3");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>("");

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
      alert("Please upload an audio file.");
      return;
    }

    if (!loaded) {
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
    } catch (error) {
      console.error(error);

      alert("Failed to crop audio. Check the browser console for details.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen  w-full">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Audio Cropper</CardTitle>
          <CardDescription>
            Upload audio, select a region, crop it locally in your browser, and
            download the result.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <AudioUploader file={audioFile} onFileSelect={handleAudioUpload} />

          {!loaded && <div className="">Loading FFmpeg...</div>}

          {audioUrl && (
            <>
              <WaveformEditor
                audioUrl={audioUrl}
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
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default App;

