import { Accessor, JSX } from 'solid-js';

import { Editor } from '@tiptap/core';

export interface RichTextEditorProps {
  /** Initial HTML content for the editor */
  content?: string;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Callback when content changes (returns HTML) */
  onChange?: (html: string) => void;
  /** Callback when content changes (returns JSON) */
  onChangeJSON?: (json: Record<string, unknown>) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Maximum character count (0 for unlimited) */
  maxLength?: number;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Minimum height of the editor */
  minHeight?: number | string;
  /** Maximum height of the editor (enables scrolling) */
  maxHeight?: number | string;
  /** Additional CSS class for the editor container */
  class?: string;
  /** Additional CSS class for the editor content area */
  contentClass?: string;
  /** Label for the editor */
  label?: string;
  /** Helper text displayed below the editor */
  helperText?: string;
  /** Error message (displays in error state) */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Custom toolbar configuration */
  toolbar?: ToolbarConfig;
  /** Autofocus the editor on mount */
  autofocus?: boolean;
  /** Image upload handler. Returns the URL of the uploaded image. */
  onImageUpload?: (file: File) => Promise<string>;
  /** i18n labels for visible editor text */
  labels?: Partial<RichTextEditorLabels>;
  /** i18n aria labels for editor accessibility */
  ariaLabels?: Partial<RichTextEditorAriaLabels>;
  /** i18n labels for the toolbar */
  toolbarLabels?: Partial<ToolbarLabels>;
}

export interface ToolbarConfig {
  /** Show text formatting buttons (bold, italic, underline, strike, code) */
  formatting?: boolean;
  /** Show heading buttons */
  headings?: boolean;
  /** Show list buttons (bullet, ordered, task) */
  lists?: boolean;
  /** Show alignment buttons */
  alignment?: boolean;
  /** Show link button */
  link?: boolean;
  /** Show blockquote button */
  blockquote?: boolean;
  /** Show code block button */
  codeBlock?: boolean;
  /** Show horizontal rule button */
  horizontalRule?: boolean;
  /** Show undo/redo buttons */
  history?: boolean;
  /** Show clear formatting button */
  clearFormatting?: boolean;
  /** Show color highlight button */
  highlight?: boolean;
  /** Show superscript/subscript buttons */
  superSubscript?: boolean;
  /** Show image upload button */
  imageUpload?: boolean;
}

export interface ToolbarButtonProps {
  /** The Tiptap editor instance */
  editor: Editor;
  /** Whether the button is active */
  isActive?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Button label for accessibility */
  label: string;
  /** Button icon */
  icon: JSX.Element;
  /** Whether the button is disabled */
  disabled?: boolean;
}

export interface EditorContextType {
  editor: Accessor<Editor | null>;
  isReady: Accessor<boolean>;
}

export interface ToolbarLabels {
  bold: string;
  italic: string;
  underline: string;
  strikethrough: string;
  code: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  normalText: string;
  textStyle: string;
  bulletList: string;
  orderedList: string;
  taskList: string;
  listStyle: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  link: string;
  enterUrl: string;
  applyLink: string;
  openInNewWindow: string;
  removeLink: string;
  blockquote: string;
  codeBlock: string;
  horizontalRule: string;
  undo: string;
  redo: string;
  clearFormatting: string;
  highlight: string;
  removeHighlight: string;
  superscript: string;
  subscript: string;
  imageUpload: string;
  normal: string;
}

export const DEFAULT_TOOLBAR_LABELS: ToolbarLabels = {
  bold: 'Bold (Ctrl+B)',
  italic: 'Italic (Ctrl+I)',
  underline: 'Underline (Ctrl+U)',
  strikethrough: 'Strikethrough',
  code: 'Inline Code',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  heading4: 'Heading 4',
  normalText: 'Normal text',
  textStyle: 'Text style',
  bulletList: 'Bullet list',
  orderedList: 'Numbered list',
  taskList: 'Task list',
  listStyle: 'List style',
  alignLeft: 'Align Left',
  alignCenter: 'Align Center',
  alignRight: 'Align Right',
  alignJustify: 'Justify',
  link: 'Link',
  enterUrl: 'Enter URL...',
  applyLink: 'Apply link',
  openInNewWindow: 'Open in new window',
  removeLink: 'Remove link',
  blockquote: 'Blockquote',
  codeBlock: 'Code Block',
  horizontalRule: 'Horizontal Rule',
  undo: 'Undo (Ctrl+Z)',
  redo: 'Redo (Ctrl+Y)',
  clearFormatting: 'Clear Formatting',
  highlight: 'Highlight',
  removeHighlight: 'Remove highlight',
  superscript: 'Superscript',
  subscript: 'Subscript',
  imageUpload: 'Add Image',
  normal: 'Normal',
};

export interface RichTextEditorLabels {
  placeholder: string;
}

export const DEFAULT_RICH_TEXT_EDITOR_LABELS: RichTextEditorLabels = {
  placeholder: 'Start writing...',
};

export interface RichTextEditorAriaLabels {
  ariaLabel: string;
}

export const DEFAULT_RICH_TEXT_EDITOR_ARIA_LABELS: RichTextEditorAriaLabels = {
  ariaLabel: 'Rich text editor',
};

export const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig = {
  formatting: true,
  headings: true,
  lists: true,
  alignment: true,
  link: true,
  blockquote: true,
  codeBlock: true,
  horizontalRule: false,
  history: true,
  clearFormatting: true,
  highlight: true,
  superSubscript: true,
  imageUpload: true,
};
