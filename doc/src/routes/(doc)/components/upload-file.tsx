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
        {
          term: 'Pre-existing Files',
          explanation: 'Pass server-side files via value prop. Users can view and remove them alongside new uploads.',
        },
      ]}
      props={[
        {
          name: 'value',
          type: 'ExistingFile[]',
          default: '-',
          description:
            'Pre-existing files from the server. Displayed with a success indicator alongside newly uploaded files. Counted towards maxLength.',
        },
        {
          name: 'onRemove',
          type: '(file: ExistingFile) => void',
          default: '-',
          description:
            'Callback fired when the user removes a pre-existing file. The remove button is only shown when this prop is provided.',
        },
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
          name: 'ExistingFile',
          kind: 'type',
          description: 'Represents a file already on the server (e.g. a previously uploaded document).',
          props: [
            {
              name: 'id',
              type: 'string',
              default: '-',
              description: 'Unique identifier from the server.',
            },
            {
              name: 'name',
              type: 'string',
              default: '-',
              description: 'File display name.',
            },
            {
              name: 'size',
              type: 'number',
              default: '-',
              description: 'File size in bytes.',
            },
            {
              name: 'type',
              type: 'string',
              default: '-',
              description: 'MIME type (used for icon selection).',
            },
            {
              name: 'url',
              type: 'string',
              default: '-',
              description: 'Preview URL for images/videos.',
            },
          ],
        },
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
      playground={`
        import { UploadFile } from '@kayou/ui';

        export default function Example() {
          return (
            <UploadFile
              dragDropText="Drag and drop your file"
              chooseFileText="Browse files"
              onChange={(f) => console.log('Selected:', f)}
            />
          );
        }
      `}
      usage={`
        import { UploadFile, type ExistingFile } from '@kayou/ui';

        // Basic
        <UploadFile dragDropText="Drag and drop" chooseFileText="Browse" onChange={handleFile} />

        // With validation
        <UploadFile dragDropText="Drop image" chooseFileText="Browse" accept="image/*" maxSize={5 * 1024 * 1024} onChange={handleFile} />

        // Multiple files
        <UploadFile dragDropText="Drop files" chooseFileText="Browse" multiple maxLength={10} onChange={handleFiles} />

        // Pre-existing files (e.g. user profile documents)
        const [docs, setDocs] = createSignal<ExistingFile[]>([
          { id: '1', name: 'passport.pdf', size: 245000, type: 'application/pdf' },
          { id: '2', name: 'photo.jpg', size: 120000, type: 'image/jpeg', url: '/uploads/photo.jpg' },
        ]);

        <UploadFile
          value={docs()}
          onRemove={(file) => setDocs((d) => d.filter((f) => f.id !== file.id))}
          onChange={(files) => handleNewUploads(files)}
          multiple
          maxLength={5}
        />
      `}
    />
  );
}
