import DocPage from '../../../components/DocPage';

export default function RichTextEditorPage() {
  return (
    <DocPage
      title="RichTextEditor"
      description="Production-ready WYSIWYG editor built on Tiptap. Perfect for product descriptions, reviews, comments, and general content editing."
      dependencies={[
        {
          name: '@tiptap/core',
          url: 'https://tiptap.dev',
          usage: 'Core editor framework providing the foundation for rich text editing',
        },
        {
          name: '@tiptap/starter-kit',
          url: 'https://tiptap.dev/docs/editor/extensions/functionality/starterkit',
          usage: 'Bundle of essential extensions (bold, italic, lists, headings, etc.)',
        },
        {
          name: '@tiptap/extension-link',
          url: 'https://tiptap.dev/docs/editor/extensions/marks/link',
          usage: 'Enables clickable link insertion and editing',
        },
        {
          name: '@tiptap/extension-underline',
          url: 'https://tiptap.dev/docs/editor/extensions/marks/underline',
          usage: 'Adds underline text formatting',
        },
        {
          name: '@tiptap/extension-text-align',
          url: 'https://tiptap.dev/docs/editor/extensions/functionality/textalign',
          usage: 'Provides left, center, right, and justify alignment',
        },
        {
          name: '@tiptap/extension-placeholder',
          url: 'https://tiptap.dev/docs/editor/extensions/functionality/placeholder',
          usage: 'Shows placeholder text when editor is empty',
        },
        {
          name: '@tiptap/extension-character-count',
          url: 'https://tiptap.dev/docs/editor/extensions/functionality/charactercount',
          usage: 'Tracks character count with optional limit enforcement',
        },
      ]}
      keyConcepts={[
        {
          term: 'Tiptap Framework',
          explanation: 'Built on ProseMirror, providing a headless, extensible editor.',
        },
        {
          term: 'Toolbar Configuration',
          explanation: 'Customize which formatting options appear via toolbar prop.',
        },
        {
          term: 'HTML Output',
          explanation: 'Returns clean HTML via onChange, ready for storage or display.',
        },
        {
          term: 'Character Limit',
          explanation:
            'Optional maxLength enforces character limits with visual feedback.',
        },
      ]}
      props={[
        {
          name: 'content',
          type: 'string',
          default: '""',
          description: 'Initial HTML content for the editor',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Start writing..."',
          description: 'Placeholder text when editor is empty',
        },
        {
          name: 'onChange',
          type: '(html: string) => void',
          default: '-',
          description: 'Callback when content changes (returns HTML)',
        },
        {
          name: 'onChangeJSON',
          type: '(json: object) => void',
          default: '-',
          description: 'Callback when content changes (returns JSON)',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Whether the editor is disabled',
        },
        {
          name: 'readOnly',
          type: 'boolean',
          default: 'false',
          description: 'Whether the editor is read-only (no toolbar)',
        },
        {
          name: 'maxLength',
          type: 'number',
          default: '-',
          description: 'Maximum character count (0 for unlimited)',
        },
        {
          name: 'showCharacterCount',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show character count below editor',
        },
        {
          name: 'minHeight',
          type: 'number | string',
          default: '"150px"',
          description: 'Minimum height of the editor content area',
        },
        {
          name: 'maxHeight',
          type: 'number | string',
          default: '-',
          description: 'Maximum height (enables scrolling when exceeded)',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label displayed above the editor',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the editor',
        },
        {
          name: 'error',
          type: 'string',
          default: '-',
          description: 'Error message (displays in error state)',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Whether the field is required',
        },
        {
          name: 'toolbar',
          type: 'ToolbarConfig',
          default: 'See below',
          description: 'Configuration object to show/hide toolbar sections',
        },
        {
          name: 'autofocus',
          type: 'boolean',
          default: 'false',
          description: 'Autofocus the editor on mount',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for the container',
        },
        {
          name: 'contentClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for the content area',
        },
        {
          name: 'labels',
          type: 'Partial<RichTextEditorLabels>',
          default: 'DEFAULT_RICH_TEXT_EDITOR_LABELS',
          description: 'Visible text labels for the editor',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<RichTextEditorAriaLabels>',
          default: 'DEFAULT_RICH_TEXT_EDITOR_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
        {
          name: 'toolbarLabels',
          type: 'Partial<ToolbarLabels>',
          default: 'DEFAULT_TOOLBAR_LABELS',
          description: 'Tooltip labels for toolbar buttons',
        },
      ]}
      subComponents={[
        {
          name: 'ToolbarConfig',
          kind: 'type',
          description: 'Configuration object for customizing toolbar visibility',
          props: [
            {
              name: 'formatting',
              type: 'boolean',
              default: 'true',
              description: 'Show bold, italic, underline, strikethrough',
            },
            {
              name: 'headings',
              type: 'boolean',
              default: 'true',
              description: 'Show H1, H2, H3 buttons',
            },
            {
              name: 'lists',
              type: 'boolean',
              default: 'true',
              description: 'Show bullet and numbered list buttons',
            },
            {
              name: 'alignment',
              type: 'boolean',
              default: 'true',
              description: 'Show text alignment buttons',
            },
            {
              name: 'link',
              type: 'boolean',
              default: 'true',
              description: 'Show link insertion button',
            },
            {
              name: 'blockquote',
              type: 'boolean',
              default: 'true',
              description: 'Show blockquote button',
            },
            {
              name: 'codeBlock',
              type: 'boolean',
              default: 'false',
              description: 'Show code block button',
            },
            {
              name: 'horizontalRule',
              type: 'boolean',
              default: 'false',
              description: 'Show horizontal rule button',
            },
            {
              name: 'history',
              type: 'boolean',
              default: 'true',
              description: 'Show undo/redo buttons',
            },
            {
              name: 'clearFormatting',
              type: 'boolean',
              default: 'true',
              description: 'Show clear formatting button',
            },
          ],
        },
        {
          name: 'RichTextEditorLabels',
          kind: 'type',
          description: 'Visible text labels for the editor.',
          props: [
            {
              name: 'placeholder',
              type: 'string',
              default: '"Start writing..."',
              description: 'Placeholder text when editor is empty.',
            },
          ],
        },
        {
          name: 'RichTextEditorAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers.',
          props: [
            {
              name: 'ariaLabel',
              type: 'string',
              default: '"Rich text editor"',
              description: 'Aria label for the editor region.',
            },
          ],
        },
        {
          name: 'ToolbarLabels',
          kind: 'type',
          description: 'Tooltip labels for toolbar buttons.',
          props: [
            { name: 'bold', type: 'string', default: '"Bold (Ctrl+B)"', description: 'Tooltip for bold button.' },
            { name: 'italic', type: 'string', default: '"Italic (Ctrl+I)"', description: 'Tooltip for italic button.' },
            { name: 'underline', type: 'string', default: '"Underline (Ctrl+U)"', description: 'Tooltip for underline button.' },
            { name: 'strikethrough', type: 'string', default: '"Strikethrough"', description: 'Tooltip for strikethrough button.' },
            { name: 'code', type: 'string', default: '"Inline Code"', description: 'Tooltip for inline code button.' },
            { name: 'heading1', type: 'string', default: '"Heading 1"', description: 'Tooltip for heading 1 button.' },
            { name: 'heading2', type: 'string', default: '"Heading 2"', description: 'Tooltip for heading 2 button.' },
            { name: 'heading3', type: 'string', default: '"Heading 3"', description: 'Tooltip for heading 3 button.' },
            { name: 'heading4', type: 'string', default: '"Heading 4"', description: 'Tooltip for heading 4 button.' },
            { name: 'normalText', type: 'string', default: '"Normal text"', description: 'Tooltip for normal text option.' },
            { name: 'textStyle', type: 'string', default: '"Text style"', description: 'Tooltip for text style dropdown.' },
            { name: 'bulletList', type: 'string', default: '"Bullet list"', description: 'Tooltip for bullet list button.' },
            { name: 'orderedList', type: 'string', default: '"Numbered list"', description: 'Tooltip for numbered list button.' },
            { name: 'taskList', type: 'string', default: '"Task list"', description: 'Tooltip for task list button.' },
            { name: 'listStyle', type: 'string', default: '"List style"', description: 'Tooltip for list style dropdown.' },
            { name: 'alignLeft', type: 'string', default: '"Align Left"', description: 'Tooltip for align left button.' },
            { name: 'alignCenter', type: 'string', default: '"Align Center"', description: 'Tooltip for align center button.' },
            { name: 'alignRight', type: 'string', default: '"Align Right"', description: 'Tooltip for align right button.' },
            { name: 'alignJustify', type: 'string', default: '"Justify"', description: 'Tooltip for justify button.' },
            { name: 'link', type: 'string', default: '"Link"', description: 'Tooltip for link button.' },
            { name: 'enterUrl', type: 'string', default: '"Enter URL..."', description: 'Placeholder for URL input.' },
            { name: 'applyLink', type: 'string', default: '"Apply link"', description: 'Tooltip for apply link button.' },
            { name: 'openInNewWindow', type: 'string', default: '"Open in new window"', description: 'Tooltip for open in new window toggle.' },
            { name: 'removeLink', type: 'string', default: '"Remove link"', description: 'Tooltip for remove link button.' },
            { name: 'blockquote', type: 'string', default: '"Blockquote"', description: 'Tooltip for blockquote button.' },
            { name: 'codeBlock', type: 'string', default: '"Code Block"', description: 'Tooltip for code block button.' },
            { name: 'horizontalRule', type: 'string', default: '"Horizontal Rule"', description: 'Tooltip for horizontal rule button.' },
            { name: 'undo', type: 'string', default: '"Undo (Ctrl+Z)"', description: 'Tooltip for undo button.' },
            { name: 'redo', type: 'string', default: '"Redo (Ctrl+Y)"', description: 'Tooltip for redo button.' },
            { name: 'clearFormatting', type: 'string', default: '"Clear Formatting"', description: 'Tooltip for clear formatting button.' },
            { name: 'highlight', type: 'string', default: '"Highlight"', description: 'Tooltip for highlight button.' },
            { name: 'removeHighlight', type: 'string', default: '"Remove highlight"', description: 'Tooltip for remove highlight button.' },
            { name: 'superscript', type: 'string', default: '"Superscript"', description: 'Tooltip for superscript button.' },
            { name: 'subscript', type: 'string', default: '"Subscript"', description: 'Tooltip for subscript button.' },
            { name: 'imageUpload', type: 'string', default: '"Add Image"', description: 'Tooltip for image upload button.' },
            { name: 'normal', type: 'string', default: '"Normal"', description: 'Label for normal text style.' },
          ],
        },
      ]}
      playground={`
import { RichTextEditor } from '@kayou/ui';
import { createSignal } from 'solid-js';

export default function Example() {
  const [content, setContent] = createSignal('');

  const sampleContent = \`<h2>Welcome to RichTextEditor</h2>
<p>This is a <strong>production-ready</strong> WYSIWYG editor built with <a href="https://tiptap.dev">Tiptap</a>.</p>
<p>It supports:</p>
<ul>
  <li>Bold, italic, underline, and strikethrough</li>
  <li>Multiple heading levels</li>
  <li>Bullet and numbered lists</li>
  <li>Text alignment and links</li>
</ul>
<blockquote><p>Try it out by editing this content!</p></blockquote>\`;

  return (
    <RichTextEditor
      label="Documentation"
      content={sampleContent}
      placeholder="Write detailed documentation..."
      toolbar={{
        formatting: true,
        headings: true,
        lists: true,
        alignment: true,
        link: true,
        blockquote: true,
        codeBlock: true,
        horizontalRule: true,
        history: true,
        clearFormatting: true,
      }}
      showCharacterCount
      onChange={setContent}
    />
  );
}
`}
      usage={`
        import { RichTextEditor, type ToolbarConfig } from '@kayou/ui';

        <RichTextEditor placeholder="Write something..." onChange={setContent} />
        <RichTextEditor content={initialContent} maxLength={5000} showCharacterCount onChange={setContent} />
        <RichTextEditor label="Review" required toolbar={{ headings: false, alignment: false }} onChange={setContent} />
      `}
    />
  );
}
