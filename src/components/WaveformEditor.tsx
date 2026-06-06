import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, {
  type Region,
} from "wavesurfer.js/dist/plugins/regions.esm.js";

import { formatTime } from "@/helpers";

import { Button } from "@/components/ui/button";

export interface IWaveformEditorProps {
  audioUrl: string;

  onRegionChange: (start: number, end: number) => void;
}

const WaveformEditor = ({ audioUrl, onRegionChange }: IWaveformEditorProps) => {
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
    <div className="w-full flex flex-col ">
      <div ref={containerRef} />

      <div className="flex gap-3 mt-4">
        <Button onClick={playPause}>{isPlaying ? "Pause" : "Play"}</Button>

        <Button onClick={playSelection}>Play Selection</Button>
      </div>

      <div className="mt-4 grid gap-2">
        <div>
          <strong>Total Duration:</strong> {formatTime(duration)}
        </div>

        <div>
          <strong>Start:</strong> {formatTime(startTime)}
        </div>

        <div>
          <strong>End:</strong> {formatTime(endTime)}
        </div>

        <div>
          <strong>Selected:</strong> {formatTime(endTime - startTime)}
        </div>
      </div>
    </div>
  );
};

export default WaveformEditor;
