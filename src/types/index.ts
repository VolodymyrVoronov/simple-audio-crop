export type OutputFormat = "mp3" | "wav" | "ogg" | "flac";

export interface CropRegion {
  start: number;
  end: number;
}

export interface CropResult {
  blob: Blob;
  downloadUrl: string;
  fileName: string;
}

export interface AudioFileState {
  file: File | null;
  audioUrl: string | null;
}

export interface AudioMetadata {
  duration: number;
  currentTime: number;
}

export interface WaveformRegion {
  start: number;
  end: number;
  drag: boolean;
  resize: boolean;
}
