import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { gooeyToast } from "goey-toast";
import { useCallback, useEffect, useRef, useState } from "react";

import type { OutputFormat } from "@/types";

const ffmpeg = new FFmpeg();

export const useFFmpeg = () => {
  const [loaded, setLoaded] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current || loaded) return;

    loadingRef.current = true;

    (async () => {
      try {
        await ffmpeg.load();
        setLoaded(true);
        gooeyToast.success("FFmpeg loaded successfully");
      } catch (error) {
        gooeyToast.error("Failed to load FFmpeg");
        console.error("Failed to load FFmpeg:", error);
        loadingRef.current = false;
      }
    })();
  }, [loaded]);

  const getMimeType = (format: OutputFormat): string => {
    switch (format) {
      case "mp3":
        return "audio/mpeg";

      case "wav":
        return "audio/wav";

      case "ogg":
        return "audio/ogg";

      case "flac":
        return "audio/flac";

      default:
        return "audio/mpeg";
    }
  };

  const getOutputArgs = (format: OutputFormat): string[] => {
    switch (format) {
      case "mp3":
        return ["-codec:a", "libmp3lame", "-q:a", "2"];

      case "wav":
        return [];

      case "ogg":
        return ["-codec:a", "libvorbis"];

      case "flac":
        return ["-codec:a", "flac"];

      default:
        return [];
    }
  };

  const cropAudio = useCallback(
    async (
      file: File,
      startTime: number,
      endTime: number,
      format: OutputFormat,
    ) => {
      if (!loaded) {
        gooeyToast.error("FFmpeg is not loaded yet");
        throw new Error("FFmpeg is not loaded yet");
      }

      setIsCropping(true);

      try {
        const inputName = `input.${file.name.split(".").pop()}`;
        const outputName = `${file.name.split(".")[0]}-[cropped].${format}`;

        await ffmpeg.writeFile(inputName, await fetchFile(file));

        await ffmpeg.exec([
          "-i",
          inputName,

          "-ss",
          String(startTime),

          "-to",
          String(endTime),

          ...getOutputArgs(format),

          outputName,
        ]);

        const data = await ffmpeg.readFile(outputName);

        const bytes =
          typeof data === "string"
            ? new TextEncoder().encode(data)
            : new Uint8Array(data);

        const blob = new Blob([bytes], {
          type: getMimeType(format),
        });

        const downloadUrl = URL.createObjectURL(blob);

        return {
          blob,
          downloadUrl,
          fileName: outputName,
        };
      } finally {
        setIsCropping(false);
      }
    },
    [loaded],
  );

  return {
    loaded,
    isCropping,
    cropAudio,
  };
};
