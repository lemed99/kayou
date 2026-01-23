import { For, JSX, Show, createSignal } from 'solid-js';

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold01Icon,
  ChevronDownIcon,
  Code01Icon,
  EraserIcon,
  Image01Icon,
  Italic01Icon,
  Link01Icon,
  LinkBroken01Icon,
  ListIcon,
  ReverseLeftIcon,
  ReverseRightIcon,
  Strikethrough01Icon,
  SubscriptIcon,
  Underline01Icon,
} from '@exowpee/solidly-icons';
import { Editor } from '@tiptap/core';

import Popover from '../Popover';
import Tooltip from '../Tooltip';
import { UploadFile } from '../UploadFile';
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  HighlighterIcon,
  OrderedListIcon,
  QuoteIcon,
  SuperscriptIcon,
  TaskListIcon,
} from './ToolbarIcons';
import { DEFAULT_TOOLBAR_CONFIG, ToolbarConfig } from './types';

interface ToolbarProps {
  editor: Editor;
  config?: ToolbarConfig;
  disabled?: boolean;
  /** Reactive state counter to trigger re-renders on editor state changes */
  editorState?: number;
  /** Image upload handler */
  onImageUpload?: (file: File) => Promise<string>;
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
    <Tooltip content={props.label} placement="top">
      <button
        type="button"
        onClick={() => props.onClick()}
        disabled={props.disabled}
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
    </Tooltip>
  );
}

function ToolbarSeparator(): JSX.Element {
  return <div class="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />;
}

// Color options for highlight
const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#bbf7d0' },
  { name: 'Blue', color: '#bfdbfe' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Purple', color: '#e9d5ff' },
  { name: 'Orange', color: '#fed7aa' },
  { name: 'Red', color: '#fecaca' },
  { name: 'Gray', color: '#e5e7eb' },
];

export function Toolbar(props: ToolbarProps): JSX.Element {
  const config = () => ({ ...DEFAULT_TOOLBAR_CONFIG, ...props.config });
  const [showLinkInput, setShowLinkInput] = createSignal(false);
  const [linkUrl, setLinkUrl] = createSignal('');
  const [showImageUpload, setShowImageUpload] = createSignal(false);

  // Helper to check if a format is active (reactive via editorState)
  const isActive = (name: string, attrs?: Record<string, unknown>) => {
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
      props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
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

  const handleImageFileChange = async (fileOrList: File | FileList) => {
    if (!props.onImageUpload) return;

    const file = fileOrList instanceof FileList ? fileOrList[0] : fileOrList;
    if (!file) return;

    try {
      const url = await props.onImageUpload(file);
      props.editor.chain().focus().setImage({ src: url }).run();
      setShowImageUpload(false);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const setHighlightColor = (color: string | null) => {
    if (color === null) {
      props.editor.chain().focus().unsetHighlight().run();
    } else {
      props.editor.chain().focus().toggleHighlight({ color }).run();
    }
  };

  // Heading dropdown options
  const headingOptions = [
    { level: 0, label: 'Normal text', icon: null },
    { level: 1, label: 'Heading 1', icon: Heading1Icon },
    { level: 2, label: 'Heading 2', icon: Heading2Icon },
    { level: 3, label: 'Heading 3', icon: Heading3Icon },
    { level: 4, label: 'Heading 4', icon: Heading4Icon },
  ];

  const getCurrentHeadingLevel = () => {
    void props.editorState;
    for (let level = 1; level <= 4; level++) {
      if (props.editor.isActive('heading', { level })) return level;
    }
    return 0;
  };

  const setHeading = (level: number) => {
    if (level === 0) {
      props.editor.chain().focus().setParagraph().run();
    } else {
      props.editor
        .chain()
        .focus()
        .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
        .run();
    }
  };

  // List dropdown options
  const listOptions = [
    { type: 'bulletList', label: 'Bullet list', icon: ListIcon },
    { type: 'orderedList', label: 'Numbered list', icon: OrderedListIcon },
    { type: 'taskList', label: 'Task list', icon: TaskListIcon },
  ];

  const getCurrentListType = () => {
    void props.editorState;
    if (props.editor.isActive('bulletList')) return 'bulletList';
    if (props.editor.isActive('orderedList')) return 'orderedList';
    if (props.editor.isActive('taskList')) return 'taskList';
    return null;
  };

  const setList = (type: string) => {
    switch (type) {
      case 'bulletList':
        props.editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        props.editor.chain().focus().toggleOrderedList().run();
        break;
      case 'taskList':
        props.editor.chain().focus().toggleTaskList().run();
        break;
    }
  };

  return (
    <div class="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-800">
      {/* Undo/Redo */}
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
        <ToolbarSeparator />
      </Show>

      {/* Headings Dropdown */}
      <Show when={config().headings}>
        <Popover
          position="bottom-start"
          content={
            <div class="w-48 py-1">
              <For each={headingOptions}>
                {(option) => (
                  <button
                    type="button"
                    onClick={() => setHeading(option.level)}
                    class={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      getCurrentHeadingLevel() === option.level
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Show when={option.icon} fallback={<span class="size-4" />}>
                      {option.icon && <option.icon class="size-4" />}
                    </Show>
                    <span
                      class={
                        option.level === 0
                          ? ''
                          : option.level === 1
                            ? 'text-lg font-bold'
                            : option.level === 2
                              ? 'text-base font-semibold'
                              : 'font-medium'
                      }
                    >
                      {option.label}
                    </span>
                  </button>
                )}
              </For>
            </div>
          }
        >
          <Tooltip content="Text style" placement="top">
            <button
              type="button"
              disabled={props.disabled}
              class="flex h-8 items-center gap-1 rounded px-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <Show when={getCurrentHeadingLevel() > 0} fallback="Normal">
                {`H${getCurrentHeadingLevel()}`}
              </Show>
              <ChevronDownIcon class="size-3" />
            </button>
          </Tooltip>
        </Popover>
      </Show>

      {/* Lists Dropdown */}
      <Show when={config().lists}>
        <Popover
          position="bottom-start"
          content={
            <div class="w-44 py-1">
              <For each={listOptions}>
                {(option) => (
                  <button
                    type="button"
                    onClick={() => setList(option.type)}
                    class={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      getCurrentListType() === option.type
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <option.icon class="size-4" />
                    <span>{option.label}</span>
                  </button>
                )}
              </For>
            </div>
          }
        >
          <Tooltip content="Lists" placement="top">
            <button
              type="button"
              disabled={props.disabled}
              class={`flex h-8 items-center gap-1 rounded px-2 transition-colors ${
                getCurrentListType()
                  ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <ListIcon class="size-4" />
              <ChevronDownIcon class="size-3" />
            </button>
          </Tooltip>
        </Popover>
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

      <Show
        when={
          config().headings || config().lists || config().blockquote || config().codeBlock
        }
      >
        <ToolbarSeparator />
      </Show>

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
          onClick={() => props.editor.chain().focus().toggleStrike().run()}
          isActive={isActive('strike')}
          disabled={props.disabled}
          label="Strikethrough"
        >
          <Strikethrough01Icon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleCode().run()}
          isActive={isActive('code')}
          disabled={props.disabled}
          label="Inline Code"
        >
          <Code01Icon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleUnderline().run()}
          isActive={isActive('underline')}
          disabled={props.disabled}
          label="Underline (Ctrl+U)"
        >
          <Underline01Icon class="size-4" />
        </ToolbarButton>
      </Show>

      {/* Highlight Color */}
      <Show when={config().highlight}>
        <Popover
          position="bottom-start"
          content={
            <div class="p-2">
              <div class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                Highlight
              </div>
              <div class="grid grid-cols-4 gap-1">
                <For each={HIGHLIGHT_COLORS}>
                  {(item) => (
                    <Tooltip content={item.name} placement="top">
                      <button
                        type="button"
                        onClick={() => setHighlightColor(item.color)}
                        class="size-7 rounded border border-gray-200 transition-transform hover:scale-110 dark:border-gray-600"
                        style={{ 'background-color': item.color }}
                        aria-label={item.name}
                      />
                    </Tooltip>
                  )}
                </For>
              </div>
              <button
                type="button"
                onClick={() => setHighlightColor(null)}
                class="mt-2 w-full rounded px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Remove highlight
              </button>
            </div>
          }
        >
          <Tooltip content="Highlight" placement="top">
            <button
              type="button"
              disabled={props.disabled}
              class={`flex h-8 items-center gap-1 rounded px-2 transition-colors ${
                isActive('highlight')
                  ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <HighlighterIcon class="size-4" />
              <ChevronDownIcon class="size-3" />
            </button>
          </Tooltip>
        </Popover>
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
      </Show>

      <Show when={config().formatting || config().highlight || config().link}>
        <ToolbarSeparator />
      </Show>

      {/* Superscript / Subscript */}
      <Show when={config().superSubscript}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleSuperscript().run()}
          isActive={isActive('superscript')}
          disabled={props.disabled}
          label="Superscript"
        >
          <SuperscriptIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().toggleSubscript().run()}
          isActive={isActive('subscript')}
          disabled={props.disabled}
          label="Subscript"
        >
          <SubscriptIcon class="size-4" />
        </ToolbarButton>
        <ToolbarSeparator />
      </Show>

      {/* Alignment */}
      <Show when={config().alignment}>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('left').run()}
          isActive={
            isActive('paragraph', { textAlign: 'left' }) ||
            isActive('heading', { textAlign: 'left' })
          }
          disabled={props.disabled}
          label="Align Left"
        >
          <AlignLeftIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('center').run()}
          isActive={
            isActive('paragraph', { textAlign: 'center' }) ||
            isActive('heading', { textAlign: 'center' })
          }
          disabled={props.disabled}
          label="Align Center"
        >
          <AlignCenterIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('right').run()}
          isActive={
            isActive('paragraph', { textAlign: 'right' }) ||
            isActive('heading', { textAlign: 'right' })
          }
          disabled={props.disabled}
          label="Align Right"
        >
          <AlignRightIcon class="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => props.editor.chain().focus().setTextAlign('justify').run()}
          isActive={
            isActive('paragraph', { textAlign: 'justify' }) ||
            isActive('heading', { textAlign: 'justify' })
          }
          disabled={props.disabled}
          label="Justify"
        >
          <AlignJustifyIcon class="size-4" />
        </ToolbarButton>
        <ToolbarSeparator />
      </Show>

      {/* Image Upload */}
      <Show when={config().imageUpload}>
        <Popover
          position="bottom-start"
          isOpen={showImageUpload()}
          onOpenChange={setShowImageUpload}
          content={
            <div class="w-80 p-3">
              <UploadFile
                onChange={handleImageFileChange}
                accept="image/*"
                multiple={false}
                maxLength={1}
                dragDropText="Click to upload or drag and drop"
                helperText="Supported formats: PNG, JPG, GIF, SVG, WebP"
                autoUpload={false}
              />
            </div>
          }
        >
          <Tooltip content="Add Image" placement="top">
            <button
              type="button"
              disabled={props.disabled}
              class="flex size-8 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Add Image"
            >
              <Image01Icon class="size-4" />
            </button>
          </Tooltip>
        </Popover>
        <ToolbarSeparator />
      </Show>

      {/* Spacer */}
      <div class="flex-1" />

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
    </div>
  );
}
