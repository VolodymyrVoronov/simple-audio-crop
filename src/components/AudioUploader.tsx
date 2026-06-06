import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";

export interface IAudioUploaderProps {
  onFileSelect: (file: File) => void;
}

const AudioUploader = ({ onFileSelect }: IAudioUploaderProps) => {
  return (
    <Dropzone
      accept={{ "audio/*": [] }}
      maxFiles={1}
      maxSize={1024 * 1024 * 20}
      minSize={1024}
      onDrop={(files) => onFileSelect(files[0])}
      onError={console.error}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};

export default AudioUploader;
