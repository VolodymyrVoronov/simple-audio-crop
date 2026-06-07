import { gooeyToast } from "goey-toast";
import { CassetteTapeIcon } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import { useFFmpeg } from "./hooks/useFFmpeg";
import type { OutputFormat } from "./types";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ThemeToggle from "./components/ThemeToggle";
import { Spinner } from "./components/ui/spinner";

const AudioUploader = lazy(() => import("./components/AudioUploader"));
const CropControls = lazy(() => import("./components/CropControls"));
const DownloadButton = lazy(() => import("./components/DownloadButton"));
const WaveformEditor = lazy(() => import("./components/WaveformEditor"));

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
      return;
    }

    if (!loaded) {
      gooeyToast.error("FFmpeg is still loading. Please wait a few seconds.");
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
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-auto p-2 lg:p-4 xl:p-10">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CassetteTapeIcon size={20} /> Audio Cropper
            </CardTitle>
            <ThemeToggle />
          </div>
          <CardDescription>
            Upload audio, select a region, crop it locally in your browser, and
            download the result.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Suspense
            fallback={
              <div className="flex w-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <AudioUploader
              file={audioFile}
              disabled={!loaded || isCropping}
              onFileSelect={handleAudioUpload}
            />
          </Suspense>

          {!loaded && (
            <div className="animate-pulse">
              <Badge className="rounded-sm border-transparent bg-linear-to-r from-indigo-500 to-pink-500 bg-size-[105%] bg-center text-white">
                Loading FFmpeg...
              </Badge>
            </div>
          )}

          {audioUrl && (
            <Suspense
              fallback={
                <div className="flex w-full items-center justify-center">
                  <Spinner />
                </div>
              }
            >
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
            </Suspense>
          )}
        </CardContent>

        {audioUrl && downloadUrl && (
          <CardFooter>
            <Suspense
              fallback={
                <div className="flex w-full items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <DownloadButton
                downloadUrl={downloadUrl}
                fileName={downloadFileName || `cropped.${outputFormat}`}
                fileSize={downloadFileSize}
                disabled={isCropping}
              />
            </Suspense>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default App;
