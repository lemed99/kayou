import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold01Icon,
  Code01Icon,
  DividerIcon,
  EraserIcon,
  Italic01Icon,
  Link01Icon,
  LinkBroken01Icon,
  ListIcon,
  ReverseLeftIcon,
  ReverseRightIcon,
  Strikethrough01Icon,
  Underline01Icon,
} from '@exowpee/solidly/icons';
import { Editor } from '@tiptap/core';
import { createSignal, JSX, Show } from 'solid-js';

import { DEFAULT_TOOLBAR_CONFIG, ToolbarConfig } from './types';
import { Heading1Icon, Heading2Icon, Heading3Icon, OrderedListIcon, QuoteIcon } from './ToolbarIcons';

interface ToolbarProps {
  editor: Editor;
  config?: ToolbarConfig;
  disabled?: boolean;
  /** Reactive state counter to trigger re-renders on editor state changes */
  editorState?: number;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
  children: JSX.Element;
}

function ToolbarButton(props: ToolbarButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => props.onClick()}
      disabled={props.disabled}
      title={props.label}
      aria-label={props.label}
      aria-pressed={props.isActive}
      class={`flex size-8 items-center justify-center rounded transition-colors ${
        props.isActive
          ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
      } ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {props.children}
    </button>
  );
}

function ToolbarDivider(): JSX.Element {
  return <div class="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />;
}

export function Toolbar(props: ToolbarProps): JSX.Element {
  const config = () => ({ ...DEFAULT_TOOLBAR_CONFIG, ...props.config });
  const [showLinkInput, setShowLinkInput] = createSignal(false);
  const [linkUrl, setLinkUrl] = createSignal('');

  // Helper to check if a format is active (reactive via editorState)
  const isActive = (name: string, attrs?: Record<string, unknown>) => {
    // Access editorState to create reactive dependency
    void props.editorState;
    return attrs ? props.editor.isActive(name, attrs) : props.editor.isActive(name);
  };

  // Helper to check if undo/redo is available (reactive via editorState)
  const canUndo = () => {
    void props.editorState;
    return props.editor.can().undo();
  };

  const canRedo = () => {
    void props.editorState;
    return props.editor.can().redo();
  };

  const setLink = () => {
    const url = linkUrl();
    if (url) {
      props.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const removeLink = () => {
    props.editor.chain().focus().unsetLink().run();
  };

  const openLinkInput = () => {
    const previousUrl = props.editor.getAttributes('link').href as string | undefined;
    setLinkUrl(previousUrl ?? '');
    setShowLinkInput(true);
  };

  return (
    <div class="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-800">
      {/* Text Formatting */}
      <Show when={config().formatting}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleBold().run()}
          isActive={isActive('bold')}
          disabled={props.disabled}
          label="Bold (Ctrl+B)"
        >
          <Bold01Icon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleItalic().run()}
          isActive={isActive('italic')}
          disabled={props.disabled}
          label="Italic (Ctrl+I)"
        >
          <Italic01Icon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleUnderline().run()}
          isActive={isActive('underline')}
          disabled={props.disabled}
          label="Underline (Ctrl+U)"
        >
          <Underline01Icon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleStrike().run()}
          isActive={isActive('strike')}
          disabled={props.disabled}
          label="Strikethrough"
        >
          <Strikethrough01Icon class="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
      </Show>

      {/* Headings */}
      <Show when={config().headings}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={isActive('heading', { level: 1 })}
          disabled={props.disabled}
          label="Heading 1"
        >
          <Heading1Icon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={isActive('heading', { level: 2 })}
          disabled={props.disabled}
          label="Heading 2"
        >
          <Heading2Icon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={isActive('heading', { level: 3 })}
          disabled={props.disabled}
          label="Heading 3"
        >
          <Heading3Icon />
        </ToolbarButton>
        <ToolbarDivider />
      </Show>

      {/* Lists */}
      <Show when={config().lists}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleBulletList().run()}
          isActive={isActive('bulletList')}
          disabled={props.disabled}
          label="Bullet List"
        >
          <ListIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleOrderedList().run()}
          isActive={isActive('orderedList')}
          disabled={props.disabled}
          label="Numbered List"
        >
          <OrderedListIcon />
        </ToolbarButton>
        <ToolbarDivider />
      </Show>

      {/* Alignment */}
      <Show when={config().alignment}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('left').run()}
          isActive={isActive('paragraph', { textAlign: 'left' }) || isActive('heading', { textAlign: 'left' })}
          disabled={props.disabled}
          label="Align Left"
        >
          <AlignLeftIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('center').run()}
          isActive={isActive('paragraph', { textAlign: 'center' }) || isActive('heading', { textAlign: 'center' })}
          disabled={props.disabled}
          label="Align Center"
        >
          <AlignCenterIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('right').run()}
          isActive={isActive('paragraph', { textAlign: 'right' }) || isActive('heading', { textAlign: 'right' })}
          disabled={props.disabled}
          label="Align Right"
        >
          <AlignRightIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('justify').run()}
          isActive={isActive('paragraph', { textAlign: 'justify' }) || isActive('heading', { textAlign: 'justify' })}
          disabled={props.disabled}
          label="Justify"
        >
          <AlignJustifyIcon class="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
      </Show>

      {/* Link */}
      <Show when={config().link}>
        <Show
          when={!showLinkInput()}
          fallback={
            <div class="flex items-center gap-1">
              <input
                type="url"
                value={linkUrl()}
                onInput={(e) => setLinkUrl(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setLink();
                  }
                  if (e.key === 'Escape') {
                    setShowLinkInput(false);
                  }
                }}
                placeholder="Enter URL..."
                class="h-7 w-48 rounded border border-gray-300 bg-white px-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                autofocus
              />
              <button
                type="button"
                onClick={setLink}
                class="h-7 rounded bg-blue-500 px-2 text-xs text-white hover:bg-blue-600"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowLinkInput(false)}
                class="h-7 rounded px-2 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          }
        >
          <ToolbarButton
            onClick={openLinkInput}
            isActive={isActive('link')}
            disabled={props.disabled}
            label="Add Link"
          >
            <Link01Icon class="size-4" />
          </ToolbarButton>
          <Show when={isActive('link')}>
            <ToolbarButton
              onClick={removeLink}
              disabled={props.disabled}
              label="Remove Link"
            >
              <LinkBroken01Icon class="size-4" />
            </ToolbarButton>
          </Show>
        </Show>
        <ToolbarDivider />
      </Show>

      {/* Blockquote */}
      <Show when={config().blockquote}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
          isActive={isActive('blockquote')}
          disabled={props.disabled}
          label="Blockquote"
        >
          <QuoteIcon />
        </ToolbarButton>
      </Show>

      {/* Code Block */}
      <Show when={config().codeBlock}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleCodeBlock().run()}
          isActive={isActive('codeBlock')}
          disabled={props.disabled}
          label="Code Block"
        >
          <Code01Icon class="size-4" />
        </ToolbarButton>
      </Show>

      {/* Horizontal Rule */}
      <Show when={config().horizontalRule}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setHorizontalRule().run()}
          disabled={props.disabled}
          label="Horizontal Rule"
        >
          <DividerIcon class="size-4" />
        </ToolbarButton>
      </Show>

      <Show when={config().blockquote || config().codeBlock || config().horizontalRule}>
        <ToolbarDivider />
      </Show>

      {/* Clear Formatting */}
      <Show when={config().clearFormatting}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().clearNodes().unsetAllMarks().run()}
          disabled={props.disabled}
          label="Clear Formatting"
        >
          <EraserIcon class="size-4" />
        </ToolbarButton>
      </Show>

      {/* Spacer */}
      <div class="flex-1" />

      {/* History */}
      <Show when={config().history}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().undo().run()}
          disabled={props.disabled || !canUndo()}
          label="Undo (Ctrl+Z)"
        >
          <ReverseLeftIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().redo().run()}
          disabled={props.disabled || !canRedo()}
          label="Redo (Ctrl+Y)"
        >
          <ReverseRightIcon class="size-4" />
        </ToolbarButton>
      </Show>
    </div>
  );
}
