import { For, JSX, Show, createSignal } from 'solid-js';

import { useToast } from '../hooks';
import { File04Icon, HandIcon, Upload01Icon, XIcon } from '../icons';

export const UploadFile = (props: {
  onChange: (file: File | FileList) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxLength?: number;
  dragDropText: string;
  chooseFileText: string;
  helperText?: string;
  maxLengthError?: string;
  maxSizeError?: (file: File) => string;
  fileTypeError?: (file: File) => string;
  toastKey?: string;
}) => {
  const toast = useToast();

  const [dragActive, setDragActive] = createSignal(false);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = createSignal<File[]>([]);

  const getAllowedTypes = () => {
    if (!props.accept) return [];
    return props.accept.split(',').map((type) => type.trim());
  };

  const isFileTypeAllowed = (file: File) => {
    const allowedTypes = getAllowedTypes();
    if (allowedTypes.length === 0) return true;

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    return allowedTypes.some((allowedType) => {
      if (allowedType.includes('/*')) {
        const baseType = allowedType.split('/')[0];
        return fileType.startsWith(baseType + '/');
      }
      if (allowedType.includes('/')) {
        return fileType === allowedType;
      }
      if (allowedType.startsWith('.')) {
        return fileName.endsWith(allowedType.toLowerCase());
      }
      return false;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const notifyChange = (files: File[]) => {
    if (props.multiple) {
      const fileList = createFileList(files);
      props.onChange(fileList);
    } else {
      props.onChange(files[0]);
    }
  };

  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles().filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    notifyChange(newFiles);
  };

  const handleDrag = function (e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e?.dataTransfer?.files && e.dataTransfer.files[0]) {
      lengthAndSizeCheck(e.dataTransfer.files);
    }
  };

  const lengthAndSizeCheck = (files: FileList) => {
    const fileArray = [...files];
    let out = false;

    const currentFiles = props.multiple ? uploadedFiles() : [];
    const totalFiles = currentFiles.length + fileArray.length;

    if (props.maxLength && totalFiles > props.maxLength) {
      out = true;
      toast[props.toastKey ?? 'error']?.(
        props.maxLengthError ?? `Maximum ${props.maxLength} files allowed`,
      );
    }

    fileArray.forEach((file) => {
      if (!isFileTypeAllowed(file)) {
        out = true;
        toast[props.toastKey ?? 'error']?.(
          props.fileTypeError
            ? props.fileTypeError(file)
            : `File type not allowed: ${file.name} (${file.type})`,
        );
      }

      if (props.maxSize && file.size > Number(props.maxSize)) {
        out = true;
        toast[props.toastKey ?? 'error']?.(
          props.maxSizeError
            ? props.maxSizeError(file)
            : `File too large: ${file.name} ${formatFileSize(file.size)}`,
        );
      }
    });

    if (out) return;

    const newFiles = props.multiple ? [...currentFiles, ...fileArray] : [fileArray[0]];
    setUploadedFiles(newFiles);
    notifyChange(newFiles);
  };

  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = function (e) {
    if (e?.target?.files && e?.currentTarget?.files?.[0]) {
      lengthAndSizeCheck(e.target.files);
    }
    if (inputRef()) {
      inputRef()!.value = '';
    }
  };

  const onFileInputClick = (e: Event) => {
    e.preventDefault();
    inputRef()?.click();
  };

  return (
    <div class="w-full">
      <div
        class="relative w-full rounded border border-dashed border-gray-200 px-10 py-6 text-center"
        onDragEnter={handleDrag}
      >
        <div class="flex items-center justify-center">
          <div class="flex items-center gap-1.5">
            <HandIcon />
            {props.dragDropText ?? 'Drag and drop'}
          </div>
          <div class="mx-5 h-5 w-px bg-gray-200" />
          <div
            class="flex cursor-pointer items-center gap-1.5"
            onClick={onFileInputClick}
          >
            <Upload01Icon />
            {props.chooseFileText ?? 'Choose file'}
          </div>
        </div>
        <Show when={props.helperText}>
          <div class="mt-5 flex items-center justify-center text-xs font-normal text-gray-500">
            {props.helperText}
          </div>
        </Show>

        <input
          ref={setInputRef}
          type="file"
          class="hidden"
          multiple={props.multiple}
          onChange={handleChange}
          accept={props.accept}
        />
        <Show when={dragActive()}>
          <div
            class="absolute inset-0 h-full w-full bg-gray-400/10"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        </Show>
      </div>

      <Show when={uploadedFiles().length > 0}>
        <div class="mt-4 space-y-2">
          <For each={uploadedFiles()}>
            {(file, index) => (
              <div class="flex items-center justify-between gap-6 rounded border border-gray-200 bg-white px-4 py-2">
                <div class="flex min-w-0 flex-1 items-center gap-3">
                  <div class="flex-shrink-0 text-gray-500">
                    <File04Icon strokeWidth={1} class="size-8" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900">{file.name}</p>
                    <p class="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div
                  onClick={() => removeFile(index())}
                  class="flex-shrink-0 cursor-pointer p-1 text-gray-500 transition-colors hover:text-red-700"
                >
                  <XIcon />
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
