import { createSignal } from 'solid-js';

import { UploadFile } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

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
          term: 'Toast Integration',
          explanation: 'Validation errors display via useToast with custom messages.',
        },
      ]}
      relatedHooks={[
        {
          name: 'useToast',
          path: '/hooks/use-toast',
          description: 'Used internally to display validation error notifications.',
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
          name: 'toastKey',
          type: 'string',
          default: '"error"',
          description: 'Toast notification key for errors (e.g., "error", "warning").',
        },
      ]}
      examples={[
        {
          title: 'Basic Upload',
          description: 'Simple file upload with drag and drop.',          component: () => {
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
          description: 'Upload area with helpful instructions.',          component: () => (
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
          description: 'Restrict uploads to image files.',          component: () => (
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
          description: 'Allow selecting multiple files with a maximum count.',          component: () => (
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
          description: 'Limit file size to 2MB.',          component: () => (
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
          description: 'Accept only PDF files with custom error message.',          component: () => (
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
          description: 'Full-featured upload with all validations.',          component: () => (
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
        import { UploadFile } from '@exowpee/solidly;

        // Basic usage
        <UploadFile
          dragDropText="Drag and drop"
          chooseFileText="Choose file"
          onChange={(file) => handleFile(file)}
        />

        // With file type and size restrictions
        <UploadFile
          dragDropText="Drop image here"
          chooseFileText="Browse"
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          helperText="Images only, max 5MB"
          onChange={(file) => uploadImage(file)}
        />

        // Multiple files with limit
        <UploadFile
          dragDropText="Drop files"
          chooseFileText="Select files"
          multiple
          maxLength={10}
          onChange={(files) => {
            // files is FileList when multiple=true
            Array.from(files).forEach(uploadFile);
          }}
        />

        // With custom error messages
        <UploadFile
          dragDropText="Drop documents"
          chooseFileText="Browse"
          accept=".pdf,.doc,.docx"
          maxSize={10 * 1024 * 1024}
          fileTypeError={(file) => \`\${file.name}: Only PDF and Word documents allowed\`}
          maxSizeError={(file) => \`\${file.name}: File must be under 10MB\`}
          onChange={handleDocuments}
        />
      `}
    />
  );
}
