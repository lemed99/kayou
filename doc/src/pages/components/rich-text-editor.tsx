import { createSignal } from 'solid-js';

import { RichTextEditor } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

const sampleContent = `<h2>Welcome to RichTextEditor</h2>
<p>This is a <strong>production-ready</strong> WYSIWYG editor built with <a href="https://tiptap.dev">Tiptap</a>.</p>
<p>It supports:</p>
<ul>
  <li>Bold, italic, underline, and strikethrough</li>
  <li>Multiple heading levels</li>
  <li>Bullet and numbered lists</li>
  <li>Text alignment</li>
  <li>Links</li>
  <li>Blockquotes</li>
</ul>
<blockquote><p>Try it out by editing this content!</p></blockquote>`;

export default function RichTextEditorPage() {
  const [, setBasicContent] = createSignal('');
  const [controlledContent, setControlledContent] = createSignal(sampleContent);
  const [, setReviewContent] = createSignal('');

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
      ]}
      subComponents={[
        {
          name: 'ToolbarConfig',
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
      ]}
      examples={[
        {
          title: 'Basic Editor',
          description: 'Simple editor with default toolbar options.',
          component: () => (
            <RichTextEditor
              placeholder="Write something amazing..."
              onChange={setBasicContent}
            />
          ),
        },
        {
          title: 'With Initial Content',
          description: 'Editor pre-populated with HTML content.',
          component: () => (
            <RichTextEditor
              content={controlledContent()}
              onChange={setControlledContent}
            />
          ),
        },
        {
          title: 'Product Review Editor',
          description: 'Simplified editor for customer reviews with character limit.',
          component: () => (
            <RichTextEditor
              label="Your Review"
              placeholder="Share your experience with this product..."
              maxLength={1000}
              showCharacterCount
              toolbar={{
                headings: false,
                alignment: false,
                blockquote: false,
                codeBlock: false,
              }}
              helperText="Be specific about what you liked or disliked"
              onChange={setReviewContent}
            />
          ),
        },
        {
          title: 'With Label and Validation',
          description: 'Editor with label, required indicator, and error state.',
          component: () => (
            <RichTextEditor
              label="Product Description"
              required
              error="Description is required"
              placeholder="Describe your product..."
              minHeight={200}
            />
          ),
        },
        {
          title: 'Minimal Toolbar',
          description: 'Only basic formatting for simple comments.',
          component: () => (
            <RichTextEditor
              placeholder="Add a comment..."
              toolbar={{
                formatting: true,
                headings: false,
                lists: false,
                alignment: false,
                link: true,
                blockquote: false,
                history: false,
                clearFormatting: false,
              }}
              minHeight={100}
              maxHeight={200}
            />
          ),
        },
        {
          title: 'Full Featured',
          description: 'All toolbar options enabled including code blocks.',
          component: () => (
            <RichTextEditor
              label="Documentation"
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
            />
          ),
        },
        {
          title: 'Disabled State',
          description: 'Editor in disabled state.',
          component: () => (
            <RichTextEditor content="<p>This content cannot be edited.</p>" disabled />
          ),
        },
        {
          title: 'Read-Only Mode',
          description: 'Display content without toolbar (read-only).',
          component: () => <RichTextEditor content={sampleContent} readOnly />,
        },
      ]}
      usage={`
        import { RichTextEditor, type ToolbarConfig } from '@exowpee/solidly';

        // Basic usage
        const [content, setContent] = createSignal('');

        <RichTextEditor
          placeholder="Write something..."
          onChange={(html) => setContent(html)}
        />

        // With initial content and character limit
        <RichTextEditor
          content="<p>Initial content</p>"
          onChange={(html) => setContent(html)}
          maxLength={5000}
          showCharacterCount
        />

        // Customized toolbar for reviews
        const reviewToolbar: ToolbarConfig = {
          formatting: true,
          headings: false,
          lists: true,
          alignment: false,
          link: true,
          blockquote: false,
          codeBlock: false,
          horizontalRule: false,
          history: true,
          clearFormatting: true,
        };

        <RichTextEditor
          label="Your Review"
          required
          placeholder="Share your experience..."
          toolbar={reviewToolbar}
          maxLength={1000}
          showCharacterCount
          onChange={(html) => setReview(html)}
        />

        // With validation
        const [error, setError] = createSignal('');

        <RichTextEditor
          label="Description"
          required
          error={error()}
          onChange={(html) => {
            setContent(html);
            if (!html || html === '<p></p>') {
              setError('Description is required');
            } else {
              setError('');
            }
          }}
        />

        // Read-only display
        <RichTextEditor
          content={savedContent}
          readOnly
        />
      `}
    />
  );
}
