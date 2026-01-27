import { createSignal } from 'solid-js';

import { UploadFile } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function UploadFilePage() {
  return (
    <DocPage
      title="UploadFile"
      description="Drag-and-drop file upload with type validation, size limits, and file list management."
      keyConcepts={[
        {
          term: 'Drag and Drop',
          explanation: 'Drag files onto upload area with visual feedback.',
        },
        {
          term: 'File Validation',
          explanation: 'Three layers: type (accept), size (maxSize), count (maxLength).',
        },
        {
          term: 'Multiple File Mode',
          explanation: 'multiple=true allows selecting and managing multiple files.',
        },
        {
          term: 'Upload Progress',
          explanation: 'Track upload progress with speed and time remaining estimates.',
        },
      ]}
      props={[
        {
          name: 'onChange',
          type: '(file: File | FileList) => void',
          default: '-',
          description:
            'Callback fired when files are selected or dropped. Receives File for single mode, FileList for multiple mode.',
          required: true,
        },
        {
          name: 'dragDropText',
          type: 'string',
          default: '-',
          description: 'Text displayed in the drag and drop area.',
          required: true,
        },
        {
          name: 'chooseFileText',
          type: 'string',
          default: '-',
          description: 'Text for the file chooser button/link.',
          required: true,
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'false',
          description: 'Whether multiple files can be selected.',
        },
        {
          name: 'accept',
          type: 'string',
          default: '-',
          description:
            'Accepted file types. Supports MIME types (image/*), specific types (image/png), or extensions (.pdf).',
        },
        {
          name: 'maxSize',
          type: 'number',
          default: '-',
          description: 'Maximum file size in bytes.',
        },
        {
          name: 'maxLength',
          type: 'number',
          default: '-',
          description: 'Maximum number of files allowed (for multiple mode).',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the upload area.',
        },
        {
          name: 'maxLengthError',
          type: 'string',
          default: '"Maximum N files allowed"',
          description: 'Custom error message when max file count is exceeded.',
        },
        {
          name: 'maxSizeError',
          type: '(file: File) => string',
          default: '-',
          description:
            'Function to generate custom error message for files exceeding max size.',
        },
        {
          name: 'fileTypeError',
          type: '(file: File) => string',
          default: '-',
          description:
            'Function to generate custom error message for invalid file types.',
        },
        {
          name: 'labels',
          type: 'Partial<UploadFileLabels>',
          default: 'DEFAULT_UPLOAD_FILE_LABELS',
          description: 'Visible text labels for the upload component',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<UploadFileAriaLabels>',
          default: 'DEFAULT_UPLOAD_FILE_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'UploadFileLabels',
          kind: 'type',
          description: 'Visible text labels for the upload component.',
          props: [
            {
              name: 'dragAndDrop',
              type: 'string',
              default: '"Drag and drop your files here"',
              description: 'Text for the drag and drop area.',
            },
            {
              name: 'or',
              type: 'string',
              default: '"or"',
              description: 'Separator text between drag area and browse button.',
            },
            {
              name: 'browseFiles',
              type: 'string',
              default: '"Browse Files"',
              description: 'Text for the browse files button.',
            },
            {
              name: 'retry',
              type: 'string',
              default: '"Retry"',
              description: 'Text for the retry button.',
            },
            {
              name: 'queued',
              type: 'string',
              default: '"Queued"',
              description: 'Text for the queued status.',
            },
            {
              name: 'dropFilesHere',
              type: 'string',
              default: '"Drop files here"',
              description: 'Text shown when dragging files over the area.',
            },
            {
              name: 'timeRemaining',
              type: '(seconds: number) => string',
              default: '-',
              description: 'Function to format the time remaining text.',
            },
            {
              name: 'uploadFailed',
              type: 'string',
              default: '"Upload failed"',
              description: 'Text for the upload failed status.',
            },
            {
              name: 'uploading',
              type: 'string',
              default: '"Uploading"',
              description: 'Text for the uploading status.',
            },
            {
              name: 'uploadComplete',
              type: 'string',
              default: '"Upload complete"',
              description: 'Text for the upload complete status.',
            },
            {
              name: 'maxLengthError',
              type: '(max: number) => string',
              default: '-',
              description: 'Function to format the max file count error message.',
            },
            {
              name: 'fileTypeError',
              type: '(fileName: string, fileType: string) => string',
              default: '-',
              description: 'Function to format the file type error message.',
            },
            {
              name: 'fileTooLargeError',
              type: '(fileName: string, size: string) => string',
              default: '-',
              description: 'Function to format the file too large error message.',
            },
          ],
        },
        {
          name: 'UploadFileAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers.',
          props: [
            {
              name: 'dismissError',
              type: 'string',
              default: '"Dismiss error"',
              description: 'Aria label for the dismiss error button.',
            },
            {
              name: 'removeFile',
              type: '(fileName: string) => string',
              default: '-',
              description: 'Function to generate aria label for the remove file button.',
            },
          ],
        },
      ]}
      examples={[
        {
          title: 'Basic Upload',
          description: 'Simple file upload with drag and drop.',
          component: () => {
            const [file, setFile] = createSignal<File | null>(null);
            return (
              <div class="space-y-2">
                <UploadFile
                  dragDropText="Drag and drop your file"
                  chooseFileText="Browse files"
                  onChange={(f) => setFile(f as File)}
                />
                {file() && <p class="text-sm text-gray-600">Selected: {file()!.name}</p>}
              </div>
            );
          },
        },
        {
          title: 'With Helper Text',
          description: 'Upload area with helpful instructions.',
          component: () => (
            <UploadFile
              dragDropText="Drag and drop"
              chooseFileText="Choose file"
              helperText="PNG, JPG or PDF (max 5MB)"
              onChange={() => {}}
            />
          ),
        },
        {
          title: 'Image Upload Only',
          description: 'Restrict uploads to image files.',
          component: () => (
            <UploadFile
              dragDropText="Drop your image here"
              chooseFileText="Select image"
              accept="image/*"
              helperText="Only image files are allowed"
              onChange={() => {}}
            />
          ),
        },
        {
          title: 'Multiple Files',
          description: 'Allow selecting multiple files with a maximum count.',
          component: () => (
            <UploadFile
              dragDropText="Drop files here"
              chooseFileText="Select files"
              multiple
              maxLength={5}
              helperText="You can upload up to 5 files"
              onChange={() => {}}
            />
          ),
        },
        {
          title: 'With Size Limit',
          description: 'Limit file size to 2MB.',
          component: () => (
            <UploadFile
              dragDropText="Drag and drop"
              chooseFileText="Browse"
              maxSize={2 * 1024 * 1024}
              helperText="Maximum file size: 2MB"
              maxSizeError={(file) => `${file.name} is too large. Max 2MB allowed.`}
              onChange={() => {}}
            />
          ),
        },
        {
          title: 'PDF Documents Only',
          description: 'Accept only PDF files with custom error message.',
          component: () => (
            <UploadFile
              dragDropText="Drop PDF here"
              chooseFileText="Select PDF"
              accept=".pdf,application/pdf"
              helperText="Only PDF documents are accepted"
              fileTypeError={(file) => `${file.name} is not a PDF file`}
              onChange={() => {}}
            />
          ),
        },
        {
          title: 'Complete Example',
          description: 'Full-featured upload with all validations.',
          component: () => (
            <UploadFile
              dragDropText="Drag and drop files"
              chooseFileText="Browse files"
              multiple
              maxLength={3}
              maxSize={5 * 1024 * 1024}
              accept="image/*,.pdf"
              helperText="Images or PDFs, max 5MB each, up to 3 files"
              maxLengthError="You can only upload 3 files"
              maxSizeError={(f) => `${f.name} exceeds 5MB limit`}
              fileTypeError={(f) => `${f.name} must be an image or PDF`}
              onChange={() => {}}
            />
          ),
        },
      ]}
      usage={`
        import { UploadFile } from '@kayou/ui';

        <UploadFile dragDropText="Drag and drop" chooseFileText="Browse" onChange={handleFile} />
        <UploadFile dragDropText="Drop image" chooseFileText="Browse" accept="image/*" maxSize={5 * 1024 * 1024} onChange={handleFile} />
        <UploadFile dragDropText="Drop files" chooseFileText="Browse" multiple maxLength={10} onChange={handleFiles} />
      `}
    />
  );
}
