import {
  ArrowLeft,
  ArrowRight,
  PauseIcon,
  PlayIcon,
  Scissors,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, {
  type Region,
} from "wavesurfer.js/dist/plugins/regions.esm.js";

import { formatTime } from "@/helpers";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "./ui/button-group";

export interface IWaveformEditorProps {
  audioUrl: string;
  disabled?: boolean;

  onRegionChange: (start: number, end: number) => void;
}

const WaveformEditor = ({
  audioUrl,
  disabled,
  onRegionChange,
}: IWaveformEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const regionRef = useRef<Region>(null);

  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) {
      return;
    }

    const regions = RegionsPlugin.create();

    const ws = WaveSurfer.create({
      container: containerRef.current,
      url: audioUrl,

      waveColor: "#8b5cf6",
      progressColor: "#4f46e5",
      cursorColor: "#111827",

      height: 120,
      normalize: true,

      plugins: [regions],
    });

    waveSurferRef.current = ws;

    ws.on("ready", () => {
      const audioDuration = ws.getDuration();

      setDuration(audioDuration);
      setStartTime(0);
      setEndTime(audioDuration);

      const region = regions.addRegion({
        start: 0,
        end: audioDuration,

        drag: true,
        resize: true,

        color: "rgba(99,102,241,0.25)",
      });

      regionRef.current = region;

      onRegionChange(0, audioDuration);

      region.on("update", () => {
        setStartTime(region.start);
        setEndTime(region.end);

        onRegionChange(region.start, region.end);
      });

      region.on("update-end", () => {
        setStartTime(region.start);
        setEndTime(region.end);

        onRegionChange(region.start, region.end);
      });
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
  }, [audioUrl, onRegionChange]);

  const playPause = () => {
    waveSurferRef.current?.playPause();
  };

  const playSelection = () => {
    const ws = waveSurferRef.current;
    const region = regionRef.current;

    if (!ws || !region) return;

    ws.setTime(region.start);
    ws.play();

    const stopAt = region.end;

    const interval = setInterval(() => {
      if (ws.getCurrentTime() >= stopAt) {
        ws.pause();
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div ref={containerRef} />

      <ButtonGroup className="w-full">
        <Button
          onClick={playPause}
          className="flex-1"
          disabled={disabled}
          size="lg"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={playSelection}
          className="flex-1"
          disabled={disabled}
          size="lg"
        >
          <PlayIcon />
          Play Selection
        </Button>
      </ButtonGroup>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Total Duration
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatTime(duration)}
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-3 ring-2 ring-green-200 dark:bg-green-950 dark:ring-green-800">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-xs font-semibold text-green-700 dark:text-green-300">
                  Start
                </div>
                <div className="text-lg font-bold text-green-900 dark:text-green-100">
                  {formatTime(startTime)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 p-3 ring-2 ring-red-200 dark:bg-red-950 dark:ring-red-800">
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <div className="text-xs font-semibold text-red-700 dark:text-red-300">
                  End
                </div>
                <div className="text-lg font-bold text-red-900 dark:text-red-100">
                  {formatTime(endTime)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 ring-2 ring-blue-200 dark:bg-blue-950 dark:ring-blue-800">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  Selected
                </div>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {formatTime(endTime - startTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveformEditor;
