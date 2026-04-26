import {
  JSX,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  on,
  onCleanup,
  onMount,
} from 'solid-js';

import { AnyExtension, Editor } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

import { ImageUploadNode } from './ImageUploadNode';
import { Toolbar } from './Toolbar';
import {
  DEFAULT_RICH_TEXT_EDITOR_ARIA_LABELS,
  DEFAULT_RICH_TEXT_EDITOR_LABELS,
  DEFAULT_TOOLBAR_CONFIG,
  RichTextEditorProps,
} from './types';

let placeholderStyleInjected = false;
const injectPlaceholderStyle = () => {
  if (placeholderStyleInjected || typeof document === 'undefined') return;
  placeholderStyleInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #9ca3af;
      pointer-events: none;
      height: 0;
    }
    .dark .ProseMirror p.is-editor-empty:first-child::before {
      color: #525252;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Converts a File to a base64 data URL.
 * This is the default image handler when no custom handler is provided.
 */
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Create extensions once outside the component to avoid HMR duplicate warnings
const createExtensions = (options: {
  placeholder: string;
  maxLength?: number;
  linkClass: string;
  onImageUpload?: (file: File) => Promise<string>;
}): AnyExtension[] => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: false,
    linkOnPaste: true,
    defaultProtocol: 'https',
    HTMLAttributes: {
      class: options.linkClass,
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Placeholder.configure({
    placeholder: options.placeholder,
    emptyEditorClass: 'is-editor-empty',
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Subscript,
  Superscript,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg',
    },
  }),
  ImageUploadNode.configure({
    onImageUpload: options.onImageUpload,
  }),
  ...(options.maxLength
    ? [CharacterCount.configure({ limit: options.maxLength })]
    : [CharacterCount]),
];

/**
 * RichTextEditor is a production-ready WYSIWYG editor built on Tiptap.
 * Provides common formatting options suitable for product descriptions,
 * reviews, comments, and general content editing.
 *
 * @example
 * <RichTextEditor
 *   content="<p>Initial content</p>"
 *   placeholder="Write your description..."
 *   onChange={(html) => console.log(html)}
 *   maxLength={5000}
 *   showCharacterCount
 * />
 */
export function RichTextEditor(props: RichTextEditorProps): JSX.Element {
  let editorElement: HTMLDivElement | undefined;
  const [editor, setEditor] = createSignal<Editor | null>(null);
  const [isFocused, setIsFocused] = createSignal(false);
  const [characterCount, setCharacterCount] = createSignal(0);
  // Signal to trigger toolbar re-renders when editor state changes
  const [editorState, setEditorState] = createSignal(0);
  // Signal to control link popover from editor content clicks
  const [linkPopoverOpen, setLinkPopoverOpen] = createSignal(false);
  const labelId = createUniqueId();
  let isSettingContent = false;

  const toolbarConfig = () => ({ ...DEFAULT_TOOLBAR_CONFIG, ...props.toolbar });
  const editorLabels = () => ({ ...DEFAULT_RICH_TEXT_EDITOR_LABELS, ...props.labels });
  const editorAriaLabels = () => ({
    ...DEFAULT_RICH_TEXT_EDITOR_ARIA_LABELS,
    ...props.ariaLabels,
  });

  onMount(() => {
    if (!editorElement) return;
    injectPlaceholderStyle();

    const editorInstance = new Editor({
      element: editorElement,
      extensions: createExtensions({
        placeholder: props.placeholder ?? editorLabels().placeholder,
        maxLength: props.maxLength,
        linkClass:
          'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
        onImageUpload: props.onImageUpload ?? imageToBase64,
      }),
      content: props.content ?? '',
      editable: !props.disabled && !props.readOnly,
      autofocus: props.autofocus ? 'end' : false,
      onUpdate: ({ editor: ed }) => {
        setCharacterCount(ed.storage.characterCount.characters());
        if (isSettingContent) return;
        const html = ed.getHTML();
        props.onChange?.(html);
        props.onChangeJSON?.(ed.getJSON());
      },
      onTransaction: () => {
        // Trigger toolbar state update on any transaction (format changes, selection, etc.)
        setEditorState((s) => s + 1);
      },
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      editorProps: {
        attributes: {
          class:
            'prose prose-sm dark:prose-invert max-w-none focus:outline-none flex-1 p-4',
          ...(props.label
            ? { 'aria-labelledby': labelId }
            : { 'aria-label': editorAriaLabels().ariaLabel }),
          role: 'textbox',
          'aria-multiline': 'true',
        },
        handleClick: (_view, _pos, event) => {
          // Prevent links from being clickable in edit mode and open link popover
          const target = event.target as HTMLElement;
          if (target.tagName === 'A' || target.closest('a')) {
            event.preventDefault();
            setLinkPopoverOpen(true);
            return true;
          }
          return false;
        },
      },
    });

    setEditor(editorInstance);
    setCharacterCount(editorInstance.storage.characterCount.characters());
  });

  onCleanup(() => {
    editor()?.destroy();
  });

  // Update content when prop changes
  createEffect(
    on(
      () => props.content,
      (content) => {
        const ed = editor();
        if (ed && content !== undefined && ed.getHTML() !== content) {
          isSettingContent = true;
          ed.commands.setContent(content);
          isSettingContent = false;
        }
      },
      { defer: true },
    ),
  );

  // Update editable state when disabled/readOnly changes
  createEffect(() => {
    const ed = editor();
    if (ed) {
      ed.setEditable(!props.disabled && !props.readOnly);
    }
  });

  const minHeight = () => {
    if (typeof props.minHeight === 'number') return `${props.minHeight}px`;
    return props.minHeight ?? '150px';
  };

  const maxHeight = () => {
    if (typeof props.maxHeight === 'number') return `${props.maxHeight}px`;
    return props.maxHeight;
  };

  const hasError = () => Boolean(props.error);
  const isDisabled = () => props.disabled ?? false;

  return (
    <div class={`flex min-w-0 flex-col ${props.class ?? ''}`}>
      {/* Label */}
      <Show when={props.label}>
        <label
          id={labelId}
          class="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {props.label}
          <Show when={props.required}>
            <span class="ml-0.5 text-red-500">*</span>
          </Show>
        </label>
      </Show>

      {/* Editor Container */}
      <div
        class={`min-w-0 overflow-hidden rounded-lg border transition-colors ${
          hasError()
            ? 'border-red-500 dark:border-red-400'
            : isFocused()
              ? 'border-blue-500 ring-1 ring-blue-500 dark:border-blue-400 dark:ring-blue-400'
              : 'border-neutral-300 dark:border-neutral-700'
        } ${isDisabled() ? 'cursor-not-allowed bg-neutral-100 opacity-60 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'}`}
      >
        {/* Toolbar */}
        <Show when={editor() && !props.readOnly}>
          <Toolbar
            editor={editor()!}
            config={toolbarConfig()}
            disabled={isDisabled()}
            editorState={editorState()}
            linkPopoverOpen={linkPopoverOpen()}
            onLinkPopoverChange={setLinkPopoverOpen}
            labels={props.toolbarLabels}
          />
        </Show>

        {/* Editor Content */}
        <div
          ref={editorElement}
          class={`editor-content flex flex-col ${props.contentClass ?? ''}`}
          style={{
            'min-height': minHeight(),
            'max-height': maxHeight(),
            overflow: maxHeight() ? 'auto' : undefined,
          }}
        />
      </div>

      {/* Footer: Helper text, error, character count */}
      <Show when={hasError() || props.helperText || props.showCharacterCount}>
        <div class="mt-1.5 flex items-start justify-between gap-2">
          <div class="flex-1">
            <Show when={hasError()}>
              <p class="text-sm text-red-500 dark:text-red-400">{props.error}</p>
            </Show>
            <Show when={!hasError() && props.helperText}>
              <p class="text-sm text-neutral-500 dark:text-neutral-400">
                {props.helperText}
              </p>
            </Show>
          </div>
          <Show when={props.showCharacterCount}>
            <p
              class={`text-sm ${
                props.maxLength && characterCount() >= props.maxLength
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {characterCount()}
              <Show when={props.maxLength}> / {props.maxLength}</Show>
            </p>
          </Show>
        </div>
      </Show>
    </div>
  );
}
