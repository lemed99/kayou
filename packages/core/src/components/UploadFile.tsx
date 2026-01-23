import { For, JSX, Match, Show, Switch, createSignal, onCleanup } from 'solid-js';

import {
  ArchiveIcon,
  CheckIcon,
  File04Icon,
  FileCode01Icon,
  HandIcon,
  Image01Icon,
  MusicNote01Icon,
  RefreshCw01Icon,
  Upload01Icon,
  VideoRecorderIcon,
  XIcon,
} from '@exowpee/solidly-icons';

import { useToast } from '../hooks';

/**
 * Upload state for each file
 */
export type UploadState = 'queued' | 'uploading' | 'success' | 'error';

/**
 * Tracked file with upload metadata
 */
export interface TrackedFile {
  /** The actual File object */
  file: File;
  /** Unique identifier for this upload */
  id: string;
  /** Current upload state */
  state: UploadState;
  /** Upload progress (0-100) */
  progress: number;
  /** Preview URL for images/videos */
  previewUrl?: string;
  /** Error message if upload failed */
  errorMessage?: string;
  /** Upload speed in bytes per second */
  speed?: number;
  /** Estimated time remaining in seconds */
  timeRemaining?: number;
}

/**
 * Props for the UploadFile component.
 */
export interface UploadFileProps {
  /** Callback fired when files are selected or dropped. */
  onChange: (file: File | FileList) => void;
  /**
   * Callback for uploading a file. Return a promise that resolves on success or rejects on error.
   * The progress callback should be called with values 0-100 during upload.
   */
  onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<void>;
  /** Whether multiple files can be selected. @default false */
  multiple?: boolean;
  /** Accepted file types (e.g., 'image/*,.pdf'). */
  accept?: string;
  /** Maximum file size in bytes. */
  maxSize?: number;
  /** Maximum number of files allowed. */
  maxLength?: number;
  /** Text for the drag and drop area. */
  dragDropText?: string;
  /** Text for the file chooser button. */
  chooseFileText?: string;
  /** Helper text displayed below the upload area. */
  helperText?: string;
  /** Error message when max length is exceeded. */
  maxLengthError?: string;
  /** Function to generate error message for files exceeding max size. */
  maxSizeError?: (file: File) => string;
  /** Function to generate error message for invalid file types. */
  fileTypeError?: (file: File) => string;
  /** Toast notification key for errors. @default 'error' */
  toastKey?: string;
  /** Whether to auto-upload files immediately after selection. @default false */
  autoUpload?: boolean;
  /** Whether to show image/video previews. @default true */
  showPreviews?: boolean;
  /** Custom class for the drop zone container */
  dropZoneClass?: string;
}

/**
 * Get file type category for icon selection
 */
const getFileCategory = (
  file: File,
): 'image' | 'video' | 'audio' | 'pdf' | 'archive' | 'code' | 'document' => {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (
    type.includes('zip') ||
    type.includes('rar') ||
    type.includes('7z') ||
    type.includes('tar') ||
    type.includes('gzip') ||
    name.endsWith('.zip') ||
    name.endsWith('.rar') ||
    name.endsWith('.7z') ||
    name.endsWith('.tar') ||
    name.endsWith('.gz')
  )
    return 'archive';
  if (
    type.includes('javascript') ||
    type.includes('typescript') ||
    type.includes('json') ||
    type.includes('xml') ||
    type.includes('html') ||
    type.includes('css') ||
    name.endsWith('.js') ||
    name.endsWith('.ts') ||
    name.endsWith('.jsx') ||
    name.endsWith('.tsx') ||
    name.endsWith('.json') ||
    name.endsWith('.xml') ||
    name.endsWith('.html') ||
    name.endsWith('.css') ||
    name.endsWith('.py') ||
    name.endsWith('.java') ||
    name.endsWith('.cpp') ||
    name.endsWith('.c') ||
    name.endsWith('.go') ||
    name.endsWith('.rs')
  )
    return 'code';

  return 'document';
};

/**
 * Generate unique ID for file tracking
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * UploadFile component for file uploads via drag-and-drop or file picker.
 * Features: upload progress, image previews, upload states, retry, and smart file icons.
 */
export const UploadFile = (props: UploadFileProps): JSX.Element => {
  const toast = useToast();

  const [dragActive, setDragActive] = createSignal(false);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [trackedFiles, setTrackedFiles] = createSignal<TrackedFile[]>([]);

  // Cleanup preview URLs on unmount
  onCleanup(() => {
    trackedFiles().forEach((tf) => {
      if (tf.previewUrl) {
        URL.revokeObjectURL(tf.previewUrl);
      }
    });
  });

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
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s';
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s remaining`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m remaining`;
    return `${Math.round(seconds / 3600)}h remaining`;
  };

  const createPreviewUrl = (file: File): string | undefined => {
    if (props.showPreviews === false) return undefined;
    const category = getFileCategory(file);
    if (category === 'image' || category === 'video') {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  const notifyChange = (files: TrackedFile[]) => {
    const fileArray = files.map((tf) => tf.file);
    if (props.multiple) {
      const fileList = createFileList(fileArray);
      props.onChange(fileList);
    } else if (fileArray.length > 0) {
      props.onChange(fileArray[0]);
    }
  };

  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const updateTrackedFile = (id: string, updates: Partial<TrackedFile>) => {
    setTrackedFiles((prev) =>
      prev.map((tf) => (tf.id === id ? { ...tf, ...updates } : tf)),
    );
  };

  const removeFile = (id: string) => {
    const file = trackedFiles().find((tf) => tf.id === id);
    if (file?.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    const newFiles = trackedFiles().filter((tf) => tf.id !== id);
    setTrackedFiles(newFiles);
    notifyChange(newFiles);
  };

  const uploadFile = async (trackedFile: TrackedFile) => {
    if (!props.onUpload) {
      // If no upload handler, mark as success immediately
      updateTrackedFile(trackedFile.id, { state: 'success', progress: 100 });
      return;
    }

    updateTrackedFile(trackedFile.id, { state: 'uploading', progress: 0 });

    const startTime = Date.now();
    let lastProgress = 0;
    let lastTime = startTime;

    try {
      await props.onUpload(trackedFile.file, (progress) => {
        const now = Date.now();
        const timeDelta = (now - lastTime) / 1000; // seconds
        const progressDelta = progress - lastProgress;

        // Calculate speed (bytes per second)
        const bytesUploaded = (progressDelta / 100) * trackedFile.file.size;
        const speed = timeDelta > 0 ? bytesUploaded / timeDelta : 0;

        // Estimate time remaining
        const remainingProgress = 100 - progress;
        const remainingBytes = (remainingProgress / 100) * trackedFile.file.size;
        const timeRemaining = speed > 0 ? remainingBytes / speed : 0;

        updateTrackedFile(trackedFile.id, {
          progress,
          speed,
          timeRemaining,
        });

        lastProgress = progress;
        lastTime = now;
      });

      updateTrackedFile(trackedFile.id, {
        state: 'success',
        progress: 100,
        speed: undefined,
        timeRemaining: undefined,
      });
    } catch (error) {
      updateTrackedFile(trackedFile.id, {
        state: 'error',
        errorMessage: error instanceof Error ? error.message : 'Upload failed',
        speed: undefined,
        timeRemaining: undefined,
      });
    }
  };

  const retryUpload = (id: string) => {
    const file = trackedFiles().find((tf) => tf.id === id);
    if (file) {
      updateTrackedFile(id, { state: 'queued', progress: 0, errorMessage: undefined });
      void uploadFile(file);
    }
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
      processFiles(e.dataTransfer.files);
    }
  };

  const processFiles = (files: FileList) => {
    const fileArray = [...files];

    const currentFiles = props.multiple ? trackedFiles() : [];
    const totalFiles = currentFiles.length + fileArray.length;

    if (props.maxLength && totalFiles > props.maxLength) {
      toast[props.toastKey ?? 'error']?.(
        props.maxLengthError ?? `Maximum ${props.maxLength} files allowed`,
      );
      return;
    }

    const validFiles: File[] = [];

    fileArray.forEach((file) => {
      if (!isFileTypeAllowed(file)) {
        toast[props.toastKey ?? 'error']?.(
          props.fileTypeError
            ? props.fileTypeError(file)
            : `File type not allowed: ${file.name} (${file.type})`,
        );
        return;
      }

      if (props.maxSize && file.size > Number(props.maxSize)) {
        toast[props.toastKey ?? 'error']?.(
          props.maxSizeError
            ? props.maxSizeError(file)
            : `File too large: ${file.name} (${formatFileSize(file.size)})`,
        );
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // Create tracked files
    const newTrackedFiles: TrackedFile[] = validFiles.map((file) => ({
      file,
      id: generateId(),
      state: 'queued' as UploadState,
      progress: 0,
      previewUrl: createPreviewUrl(file),
    }));

    const updatedFiles = props.multiple
      ? [...currentFiles, ...newTrackedFiles]
      : newTrackedFiles.slice(0, 1);

    setTrackedFiles(updatedFiles);
    notifyChange(updatedFiles);

    // Auto-upload if enabled
    if (props.autoUpload) {
      newTrackedFiles.forEach((tf) => void uploadFile(tf));
    }
  };

  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = function (e) {
    if (e?.target?.files && e?.currentTarget?.files?.[0]) {
      processFiles(e.target.files);
    }
    if (inputRef()) {
      inputRef()!.value = '';
    }
  };

  const onFileInputClick = (e: Event) => {
    e.preventDefault();
    inputRef()?.click();
  };

  // File icon component based on file type
  const FileIcon = (iconProps: { file: File; class?: string }) => {
    const category = () => getFileCategory(iconProps.file);

    return (
      <Switch
        fallback={<File04Icon strokeWidth={1.5} class={iconProps.class ?? 'size-8'} />}
      >
        <Match when={category() === 'image'}>
          <Image01Icon
            strokeWidth={1.5}
            class={`${iconProps.class ?? 'size-8'} text-purple-500`}
          />
        </Match>
        <Match when={category() === 'video'}>
          <VideoRecorderIcon
            strokeWidth={1.5}
            class={`${iconProps.class ?? 'size-8'} text-pink-500`}
          />
        </Match>
        <Match when={category() === 'audio'}>
          <MusicNote01Icon
            strokeWidth={1.5}
            class={`${iconProps.class ?? 'size-8'} text-orange-500`}
          />
        </Match>
        <Match when={category() === 'pdf'}>
          <File04Icon
            strokeWidth={1.5}
            class={`${iconProps.class ?? 'size-8'} text-red-500`}
          />
        </Match>
        <Match when={category() === 'archive'}>
          <ArchiveIcon
            strokeWidth={1.5}
            class={`${iconProps.class ?? 'size-8'} text-yellow-600`}
          />
        </Match>
        <Match when={category() === 'code'}>
          <FileCode01Icon
            strokeWidth={1.5}
            class={`${iconProps.class ?? 'size-8'} text-green-500`}
          />
        </Match>
      </Switch>
    );
  };

  // State indicator component
  const StateIndicator = (stateProps: { trackedFile: TrackedFile }) => {
    const tf = () => stateProps.trackedFile;

    return (
      <Switch>
        <Match when={tf().state === 'uploading'}>
          <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <RefreshCw01Icon class="size-4 animate-spin" />
            <span class="text-xs font-medium">{tf().progress}%</span>
          </div>
        </Match>
        <Match when={tf().state === 'success'}>
          <div class="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckIcon class="size-4" />
          </div>
        </Match>
        <Match when={tf().state === 'error'}>
          <button
            type="button"
            onClick={() => retryUpload(tf().id)}
            class="flex items-center gap-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            <RefreshCw01Icon class="size-3" />
            Retry
          </button>
        </Match>
        <Match when={tf().state === 'queued'}>
          <span class="text-xs text-gray-400 dark:text-gray-500">Queued</span>
        </Match>
      </Switch>
    );
  };

  return (
    <div class="w-full">
      {/* Drop Zone */}
      <div
        class={`relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${
          dragActive()
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800'
        } ${props.dropZoneClass ?? ''}`}
        onDragEnter={handleDrag}
      >
        <div class="px-8 py-8 text-center">
          {/* Upload Icon */}
          <div
            class={`mx-auto mb-4 flex size-14 items-center justify-center rounded-full transition-all duration-200 ${
              dragActive()
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            }`}
          >
            <Upload01Icon class="size-7" strokeWidth={1.5} />
          </div>

          {/* Text */}
          <div class="mb-2">
            <span class="text-gray-600 dark:text-gray-300">
              {props.dragDropText ?? 'Drag and drop your files here'}
            </span>
          </div>

          <div class="mb-4 flex items-center justify-center gap-3">
            <div class="h-px w-12 bg-gray-200 dark:bg-gray-700" />
            <span class="text-sm text-gray-400 dark:text-gray-500">or</span>
            <div class="h-px w-12 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Browse Button */}
          <button
            type="button"
            onClick={onFileInputClick}
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <HandIcon class="size-4" />
            {props.chooseFileText ?? 'Browse Files'}
          </button>

          <Show when={props.helperText}>
            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
              {props.helperText}
            </p>
          </Show>
        </div>

        <input
          ref={setInputRef}
          type="file"
          class="hidden"
          multiple={props.multiple}
          onChange={handleChange}
          accept={props.accept}
        />

        {/* Drag Overlay */}
        <Show when={dragActive()}>
          <div
            class="absolute inset-0 flex items-center justify-center bg-blue-500/10 backdrop-blur-[1px]"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
              Drop files here
            </div>
          </div>
        </Show>
      </div>

      {/* File List */}
      <Show when={trackedFiles().length > 0}>
        <div class="mt-4 space-y-3">
          <For each={trackedFiles()}>
            {(trackedFile) => (
              <div
                class={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
                  trackedFile.state === 'error'
                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    : trackedFile.state === 'success'
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <div class="flex items-center gap-4 p-4">
                  {/* Preview or Icon */}
                  <div class="shrink-0">
                    <Show
                      when={
                        trackedFile.previewUrl &&
                        getFileCategory(trackedFile.file) === 'image'
                      }
                      fallback={
                        <div class="flex size-14 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                          <FileIcon file={trackedFile.file} class="size-7" />
                        </div>
                      }
                    >
                      <img
                        src={trackedFile.previewUrl}
                        alt={trackedFile.file.name}
                        class="size-14 rounded-lg object-cover"
                      />
                    </Show>
                  </div>

                  {/* File Info */}
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {trackedFile.file.name}
                        </p>
                        <div class="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(trackedFile.file.size)}</span>
                          <Show
                            when={trackedFile.state === 'uploading' && trackedFile.speed}
                          >
                            <span class="text-gray-300 dark:text-gray-600">•</span>
                            <span class="text-blue-600 dark:text-blue-400">
                              {formatSpeed(trackedFile.speed!)}
                            </span>
                          </Show>
                          <Show
                            when={
                              trackedFile.state === 'uploading' &&
                              trackedFile.timeRemaining
                            }
                          >
                            <span class="text-gray-300 dark:text-gray-600">•</span>
                            <span>{formatTimeRemaining(trackedFile.timeRemaining!)}</span>
                          </Show>
                        </div>
                        <Show
                          when={trackedFile.state === 'error' && trackedFile.errorMessage}
                        >
                          <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                            {trackedFile.errorMessage}
                          </p>
                        </Show>
                      </div>

                      {/* State & Actions */}
                      <div class="flex items-center gap-2">
                        <StateIndicator trackedFile={trackedFile} />
                        <button
                          type="button"
                          onClick={() => removeFile(trackedFile.id)}
                          aria-label={`Remove ${trackedFile.file.name}`}
                          class="rounded-md p-1.5 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                          <XIcon class="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <Show when={trackedFile.state === 'uploading'}>
                      <div class="mt-3">
                        <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            class="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
                            style={{ width: `${trackedFile.progress}%` }}
                          />
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>

                {/* Success animation overlay */}
                <Show when={trackedFile.state === 'success'}>
                  <div class="pointer-events-none absolute inset-0">
                    <div
                      class="absolute inset-0 animate-pulse bg-gradient-to-r from-green-500/5 via-green-500/10 to-green-500/5"
                      style={{
                        'animation-duration': '1s',
                        'animation-iteration-count': '1',
                      }}
                    />
                  </div>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
