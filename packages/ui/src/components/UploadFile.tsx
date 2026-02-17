import {
  For,
  Index,
  JSX,
  Match,
  Show,
  Switch,
  createSignal,
  mergeProps,
  onCleanup,
} from 'solid-js';

import {
  ArchiveIcon,
  CheckIcon,
  File04Icon,
  FileCode01Icon,
  Image01Icon,
  MusicNote01Icon,
  RefreshCw01Icon,
  Upload01Icon,
  VideoRecorderIcon,
  XIcon,
} from '@kayou/icons';

import Button from './Button';

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
 * A file that already exists on the server (e.g. a previously uploaded document).
 */
export interface ExistingFile {
  /** Unique identifier from the server */
  id: string;
  /** File display name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type (used for icon selection) */
  type?: string;
  /** Preview URL for images/videos */
  url?: string;
}

/**
 * Visible text labels for the UploadFile component, enabling i18n support.
 */
export interface UploadFileLabels {
  dragAndDrop: string;
  or: string;
  browseFiles: string;
  retry: string;
  queued: string;
  timeRemaining: (seconds: number) => string;
  uploadFailed: string;
  uploading: string;
  uploadComplete: string;
  maxLengthError: (max: number) => string;
  fileTypeError: (fileName: string, fileType: string) => string;
  fileTooLargeError: (fileName: string, size: string) => string;
}

export const DEFAULT_UPLOAD_FILE_LABELS: UploadFileLabels = {
  dragAndDrop: 'Drag and drop your files here',
  or: 'or',
  browseFiles: 'Browse Files',
  retry: 'Retry',
  queued: 'Queued',
  timeRemaining: (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s remaining`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m remaining`;
    return `${Math.round(seconds / 3600)}h remaining`;
  },
  uploadFailed: 'Upload failed',
  uploading: 'Uploading',
  uploadComplete: 'Upload complete',
  maxLengthError: (max: number) => `Maximum ${max} files allowed`,
  fileTypeError: (fileName: string, fileType: string) =>
    `File type not allowed: ${fileName} (${fileType})`,
  fileTooLargeError: (fileName: string, size: string) =>
    `File too large: ${fileName} (${size})`,
};

/**
 * Aria labels for the UploadFile component, enabling i18n support.
 */
export interface UploadFileAriaLabels {
  dismissError: string;
  removeFile: (fileName: string) => string;
}

export const DEFAULT_UPLOAD_FILE_ARIA_LABELS: UploadFileAriaLabels = {
  dismissError: 'Dismiss error',
  removeFile: (fileName: string) => `Remove ${fileName}`,
};

/**
 * Props for the UploadFile component.
 */
export interface UploadFileProps {
  /** Pre-existing files to display (e.g. previously uploaded documents from the server). */
  value?: ExistingFile[];
  /** Callback fired when the user removes a pre-existing file. */
  onRemove?: (file: ExistingFile) => void;
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
  /** Whether to auto-upload files immediately after selection. @default false */
  autoUpload?: boolean;
  /** Whether to show image/video previews. @default true */
  showPreviews?: boolean;
  /** Custom class for the drop zone container */
  dropZoneClass?: string;
  /** i18n labels for all visible UI strings. Partial overrides are merged with defaults. */
  labels?: Partial<UploadFileLabels>;
  /** i18n aria labels for accessibility. Partial overrides are merged with defaults. */
  ariaLabels?: Partial<UploadFileAriaLabels>;
}

/**
 * Get file type category for icon selection
 */
type FileCategory = 'image' | 'video' | 'audio' | 'pdf' | 'archive' | 'code' | 'document';

const getFileCategory = (
  file: File | { name: string; type?: string },
): FileCategory => {
  const type = (file instanceof File ? file.type : file.type ?? '').toLowerCase();
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
export const UploadFile = (rawProps: UploadFileProps): JSX.Element => {
  const props = mergeProps(
    {
      labels: {} as Partial<UploadFileLabels>,
      ariaLabels: {} as Partial<UploadFileAriaLabels>,
    },
    rawProps,
  );
  const l = (): UploadFileLabels => ({ ...DEFAULT_UPLOAD_FILE_LABELS, ...props.labels });
  const al = (): UploadFileAriaLabels => ({
    ...DEFAULT_UPLOAD_FILE_ARIA_LABELS,
    ...props.ariaLabels,
  });

  const [dragActive, setDragActive] = createSignal(false);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [trackedFiles, setTrackedFiles] = createSignal<TrackedFile[]>([]);
  const [error, setError] = createSignal<string[] | null>(null);

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
    return l().timeRemaining(seconds);
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

  const uploadFile = async (entry: TrackedFile) => {
    if (!props.onUpload) {
      // If no upload handler, mark as success immediately
      updateTrackedFile(entry.id, { state: 'success', progress: 100 });
      return;
    }

    updateTrackedFile(entry.id, { state: 'uploading', progress: 0 });

    const startTime = Date.now();
    let lastProgress = 0;
    let lastTime = startTime;

    try {
      await props.onUpload(entry.file, (progress) => {
        const now = Date.now();
        const timeDelta = (now - lastTime) / 1000; // seconds
        const progressDelta = progress - lastProgress;

        // Calculate speed (bytes per second)
        const bytesUploaded = (progressDelta / 100) * entry.file.size;
        const speed = timeDelta > 0 ? bytesUploaded / timeDelta : 0;

        // Estimate time remaining
        const remainingProgress = 100 - progress;
        const remainingBytes = (remainingProgress / 100) * entry.file.size;
        const timeRemaining = speed > 0 ? remainingBytes / speed : 0;

        updateTrackedFile(entry.id, {
          progress,
          speed,
          timeRemaining,
        });

        lastProgress = progress;
        lastTime = now;
      });

      updateTrackedFile(entry.id, {
        state: 'success',
        progress: 100,
        speed: undefined,
        timeRemaining: undefined,
      });
    } catch (error) {
      updateTrackedFile(entry.id, {
        state: 'error',
        errorMessage: error instanceof Error ? error.message : l().uploadFailed,
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
    const existingCount = props.value?.length ?? 0;
    const totalFiles = currentFiles.length + existingCount + fileArray.length;

    if (props.maxLength && totalFiles > props.maxLength) {
      setError([props.maxLengthError ?? l().maxLengthError(props.maxLength)]);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      if (!isFileTypeAllowed(file)) {
        errors.push(
          props.fileTypeError
            ? props.fileTypeError(file)
            : l().fileTypeError(file.name, file.type),
        );
        return;
      }

      if (props.maxSize && file.size > props.maxSize) {
        errors.push(
          props.maxSizeError
            ? props.maxSizeError(file)
            : l().fileTooLargeError(file.name, formatFileSize(file.size)),
        );
        return;
      }

      validFiles.push(file);
    });

    // Show errors for rejected files
    setError(errors.length > 0 ? errors : null);

    if (validFiles.length === 0) return;

    // Create tracked files
    const hasUploader = !!props.onUpload;
    const newTrackedFiles: TrackedFile[] = validFiles.map((file) => ({
      file,
      id: generateId(),
      state: (hasUploader ? 'queued' : 'success') as UploadState,
      progress: hasUploader ? 0 : 100,
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
  const FileIcon = (iconProps: { file: File | { name: string; type?: string }; class?: string }) => {
    const category = () => getFileCategory(iconProps.file);

    return (
      <Switch fallback={<File04Icon class={iconProps.class ?? 'size-8'} />}>
        <Match when={category() === 'image'}>
          <Image01Icon class={`${iconProps.class ?? 'size-8'} text-purple-500`} />
        </Match>
        <Match when={category() === 'video'}>
          <VideoRecorderIcon class={`${iconProps.class ?? 'size-8'} text-pink-500`} />
        </Match>
        <Match when={category() === 'audio'}>
          <MusicNote01Icon class={`${iconProps.class ?? 'size-8'} text-orange-500`} />
        </Match>
        <Match when={category() === 'pdf'}>
          <File04Icon class={`${iconProps.class ?? 'size-8'} text-red-500`} />
        </Match>
        <Match when={category() === 'archive'}>
          <ArchiveIcon class={`${iconProps.class ?? 'size-8'} text-yellow-600`} />
        </Match>
        <Match when={category() === 'code'}>
          <FileCode01Icon class={`${iconProps.class ?? 'size-8'} text-green-500`} />
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
            <CheckIcon />
          </div>
        </Match>
        <Match when={tf().state === 'error'}>
          <button
            type="button"
            onClick={() => retryUpload(tf().id)}
            class="flex items-center gap-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            <RefreshCw01Icon class="size-3" />
            {l().retry}
          </button>
        </Match>
        <Match when={tf().state === 'queued'}>
          <span class="text-xs text-neutral-400 dark:text-neutral-500">{l().queued}</span>
        </Match>
      </Switch>
    );
  };

  return (
    <div class="w-full">
      {/* Drop Zone */}
      <div
        class={`relative w-full overflow-hidden rounded-xl border border-dashed transition-all duration-200 ${
          dragActive()
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900'
        } ${props.dropZoneClass ?? ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
      >
        <div class="px-8 py-8 text-center">
          {/* Upload Icon */}
          <div
            class={`mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 dark:bg-neutral-800 dark:text-neutral-500`}
          >
            <Upload01Icon class="size-5" />
          </div>

          {/* Text */}
          <div class="mb-2">
            <span class="text-neutral-600 dark:text-neutral-300">
              {props.dragDropText ?? l().dragAndDrop}
            </span>
          </div>

          <div class="mb-4 flex items-center justify-center gap-3">
            <div class="h-px w-12 bg-neutral-200 dark:bg-neutral-700" />
            <span class="text-sm text-neutral-400 dark:text-neutral-500">{l().or}</span>
            <div class="h-px w-12 bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Browse Button */}
          <div class="flex justify-center">
            <Button icon={File04Icon} onClick={onFileInputClick}>
              {props.chooseFileText ?? l().browseFiles}
            </Button>
          </div>

          <Show when={props.helperText}>
            <p class="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
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
            class="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-sm"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        </Show>
      </div>

      {/* Error Display */}
      <Show when={error() && error()!.length > 0}>
        <div class="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/20">
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col gap-1.5">
              <For each={error()}>
                {(errorMsg) => (
                  <div class="flex items-center gap-2">
                    <XIcon class="size-4 shrink-0 text-red-500 dark:text-red-400" />
                    <p class="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
                  </div>
                )}
              </For>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              class="shrink-0 rounded p-1 text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
              aria-label={al().dismissError}
            >
              <XIcon />
            </button>
          </div>
        </div>
      </Show>

      {/* File List */}
      <Show when={(props.value?.length ?? 0) > 0 || trackedFiles().length > 0}>
        <div class="mt-4 space-y-3">
          {/* Existing files from server */}
          <For each={props.value}>
            {(existing) => (
              <div class="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div class="flex items-center gap-3 p-3">
                  <div class="shrink-0">
                    <Show
                      when={existing.url && getFileCategory(existing) === 'image'}
                      fallback={
                        <div class="flex size-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700">
                          <FileIcon file={existing} class="size-5" />
                        </div>
                      }
                    >
                      <img
                        src={existing.url}
                        alt={existing.name}
                        class="size-10 rounded-lg object-cover"
                      />
                    </Show>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium text-neutral-900 dark:text-white">
                          {existing.name}
                        </p>
                        <div class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                          {formatFileSize(existing.size)}
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                          <CheckIcon />
                        </div>
                        <Show when={props.onRemove}>
                          <button
                            type="button"
                            onClick={() => props.onRemove?.(existing)}
                            aria-label={al().removeFile(existing.name)}
                            class="rounded-md p-1.5 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                          >
                            <XIcon />
                          </button>
                        </Show>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>

          {/* Newly added files */}
          <Index each={trackedFiles()}>
            {(trackedFile) => (
              <div class="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div class="flex items-center gap-3 p-3">
                  {/* Preview or Icon */}
                  <div class="shrink-0">
                    <Show
                      when={
                        trackedFile().previewUrl &&
                        getFileCategory(trackedFile().file) === 'image'
                      }
                      fallback={
                        <div class="flex size-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700">
                          <FileIcon file={trackedFile().file} class="size-5" />
                        </div>
                      }
                    >
                      <img
                        src={trackedFile().previewUrl}
                        alt={trackedFile().file.name}
                        class="size-10 rounded-lg object-cover"
                      />
                    </Show>
                  </div>

                  {/* File Info */}
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium text-neutral-900 dark:text-white">
                          {trackedFile().file.name}
                        </p>
                        <div class="mt-0.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <span>{formatFileSize(trackedFile().file.size)}</span>
                          <Show
                            when={
                              trackedFile().state === 'uploading' && trackedFile().speed
                            }
                          >
                            <span class="text-neutral-300 dark:text-neutral-600">•</span>
                            <span class="text-blue-600 dark:text-blue-400">
                              {formatSpeed(trackedFile().speed!)}
                            </span>
                          </Show>
                          <Show
                            when={
                              trackedFile().state === 'uploading' &&
                              trackedFile().timeRemaining
                            }
                          >
                            <span class="text-neutral-300 dark:text-neutral-600">•</span>
                            <span>
                              {formatTimeRemaining(trackedFile().timeRemaining!)}
                            </span>
                          </Show>
                        </div>
                        <Show
                          when={
                            trackedFile().state === 'error' && trackedFile().errorMessage
                          }
                        >
                          <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                            {trackedFile().errorMessage}
                          </p>
                        </Show>
                      </div>

                      {/* State & Actions */}
                      <div class="flex items-center gap-2">
                        <StateIndicator trackedFile={trackedFile()} />
                        <button
                          type="button"
                          onClick={() => removeFile(trackedFile().id)}
                          aria-label={al().removeFile(trackedFile().file.name)}
                          class="rounded-md p-1.5 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                        >
                          <XIcon />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <Show when={trackedFile().state === 'uploading'}>
                      <div class="mt-3">
                        <div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                          <div
                            class="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
                            style={{ width: `${trackedFile().progress}%` }}
                          />
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            )}
          </Index>
        </div>
      </Show>
    </div>
  );
};
