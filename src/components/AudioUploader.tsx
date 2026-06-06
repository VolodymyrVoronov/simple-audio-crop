import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";

export interface IAudioUploaderProps {
  file?: File;
  disabled?: boolean;

  onFileSelect: (file: File) => void;
}

const AudioUploader = ({
  file,
  disabled,
  onFileSelect,
}: IAudioUploaderProps) => {
  return (
    <Dropzone
      src={file ? [file] : []}
      accept={{ "audio/*": [] }}
      maxFiles={1}
      maxSize={1024 * 1024 * 20}
      minSize={1024}
      onDrop={(files) => onFileSelect(files[0])}
      onError={console.error}
      disabled={disabled}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};

export default AudioUploader;
