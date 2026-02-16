import { For, JSX, Show, createEffect, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold01Icon,
  CheckIcon,
  ChevronDownIcon,
  CodeSnippet02Icon,
  CodeSquare01Icon,
  EraserIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  HighlighterIcon,
  Image01Icon,
  Italic01Icon,
  Link01Icon,
  LinkExternal01Icon,
  ListIcon,
  MinusIcon,
  OrderedListIcon,
  QuoteIcon,
  ReverseLeftIcon,
  ReverseRightIcon,
  Strikethrough01Icon,
  SubscriptIcon,
  SuperscriptIcon,
  TaskListIcon,
  Trash01Icon,
  Underline01Icon,
} from '@kayou/icons';
import { Editor } from '@tiptap/core';

import Popover from '../Popover';
import Select, { type Option } from '../Select';
import Tooltip from '../Tooltip';
import {
  DEFAULT_TOOLBAR_CONFIG,
  DEFAULT_TOOLBAR_LABELS,
  ToolbarConfig,
  ToolbarLabels,
} from './types';

interface ToolbarProps {
  editor: Editor;
  config?: ToolbarConfig;
  disabled?: boolean;
  /** Reactive state counter to trigger re-renders on editor state changes */
  editorState?: number;
  /** Control link popover from outside */
  linkPopoverOpen?: boolean;
  /** Callback when link popover state changes */
  onLinkPopoverChange?: (open: boolean) => void;
  /** i18n labels for the toolbar */
  labels?: Partial<ToolbarLabels>;
}

interface ToolbarButtonProps {
  onClick: () => void;
  /** Accessor function for reactive active state */
  isActive?: () => boolean;
  disabled?: boolean;
  label: string;
  children: JSX.Element;
}

function ToolbarButton(props: ToolbarButtonProps): JSX.Element {
  const active = () => props.isActive?.() ?? false;
  return (
    <Tooltip content={props.label} placement="bottom">
      <button
        type="button"
        onClick={() => props.onClick()}
        disabled={props.disabled}
        aria-label={props.label}
        aria-pressed={active()}
        class={`flex size-8 items-center justify-center rounded transition-colors ${
          active()
            ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white'
        } ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {props.children}
      </button>
    </Tooltip>
  );
}

function ToolbarGroup(props: { children: JSX.Element }): JSX.Element {
  return (
    <div class="flex shrink-0 items-center gap-0.5 px-1 first:pl-0 last:pr-0">
      {props.children}
    </div>
  );
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
  const l = (): ToolbarLabels => ({ ...DEFAULT_TOOLBAR_LABELS, ...props.labels });
  const [showLinkInput, setShowLinkInput] = createSignal(false);
  const [linkUrl, setLinkUrl] = createSignal('');
  // Store selection range when opening link popover to restore it before applying
  let savedSelection: { from: number; to: number } | null = null;

  // Sync link popover with external control
  createEffect(() => {
    if (props.linkPopoverOpen !== undefined) {
      if (props.linkPopoverOpen && !showLinkInput()) {
        // Save selection when opening from external trigger (clicking a link)
        const { from, to } = props.editor.state.selection;
        savedSelection = { from, to };
      }
      setShowLinkInput(props.linkPopoverOpen);
      if (props.linkPopoverOpen) {
        setLinkUrl(getCurrentLinkUrl());
      }
    }
  });

  // Notify parent when link popover changes
  const handleLinkPopoverChange = (open: boolean) => {
    if (open) {
      // Save selection when opening the popover
      const { from, to } = props.editor.state.selection;
      savedSelection = { from, to };
      setLinkUrl(getCurrentLinkUrl());
    } else {
      // Clear saved selection when closing without applying
      savedSelection = null;
    }
    setShowLinkInput(open);
    props.onLinkPopoverChange?.(open);
  };

  // Helper to check if a format is active (returns accessor for reactivity)
  const isActive = (name: string, attrs?: Record<string, unknown>) => {
    // eslint-disable-next-line solid/reactivity -- Returns accessor used in JSX (tracked scope)
    return () => {
      void props.editorState; // Track editorState for reactivity
      return attrs ? props.editor.isActive(name, attrs) : props.editor.isActive(name);
    };
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

  const applyLink = () => {
    const url = linkUrl();
    if (url) {
      // Restore selection if we saved one
      if (savedSelection) {
        props.editor.commands.setTextSelection(savedSelection);
      }
      // If already on a link, extend the mark range first; otherwise just apply to selection
      if (props.editor.isActive('link')) {
        props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      } else {
        props.editor.chain().focus().setLink({ href: url }).run();
      }
    }
    savedSelection = null;
    handleLinkPopoverChange(false);
  };

  const removeLink = () => {
    // Restore selection if we saved one
    if (savedSelection) {
      props.editor.commands.setTextSelection(savedSelection);
    }
    props.editor.chain().focus().unsetLink().run();
    setLinkUrl('');
    savedSelection = null;
    handleLinkPopoverChange(false);
  };

  const openLinkInNewWindow = () => {
    const url = linkUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCurrentLinkUrl = () => {
    void props.editorState;
    return (props.editor.getAttributes('link').href as string) ?? '';
  };

  const insertImageUploadBlock = () => {
    props.editor.chain().focus().insertContent({ type: 'imageUpload' }).run();
  };

  const setHighlightColor = (color: string | null) => {
    if (color === null) {
      props.editor.chain().focus().unsetHighlight().run();
    } else {
      props.editor.chain().focus().toggleHighlight({ color }).run();
    }
  };

  // Heading dropdown options
  const HEADING_ICONS: Record<string, (props: Record<string, unknown>) => JSX.Element> = {
    '1': Heading1Icon,
    '2': Heading2Icon,
    '3': Heading3Icon,
    '4': Heading4Icon,
  };

  const headingSelectOptions = (): Option[] => [
    { value: '0', label: l().normalText },
    {
      value: '1',
      label: l().heading1,
      labelWrapper: (label: string) => (
        <span class="flex items-center gap-2">
          <Heading1Icon />
          {label}
        </span>
      ),
    },
    {
      value: '2',
      label: l().heading2,
      labelWrapper: (label: string) => (
        <span class="flex items-center gap-2">
          <Heading2Icon />
          {label}
        </span>
      ),
    },
    {
      value: '3',
      label: l().heading3,
      labelWrapper: (label: string) => (
        <span class="flex items-center gap-2">
          <Heading3Icon />
          {label}
        </span>
      ),
    },
    {
      value: '4',
      label: l().heading4,
      labelWrapper: (label: string) => (
        <span class="flex items-center gap-2">
          <Heading4Icon />
          {label}
        </span>
      ),
    },
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
  const LIST_ICONS: Record<string, (props: Record<string, unknown>) => JSX.Element> = {
    bulletList: ListIcon,
    orderedList: OrderedListIcon,
    taskList: TaskListIcon,
  };

  const listSelectOptions = (): Option[] => [
    {
      value: 'bulletList',
      label: l().bulletList,
      labelWrapper: (label: string) => (
        <span class="flex items-center gap-2">
          <ListIcon />
          {label}
        </span>
      ),
    },
    {
      value: 'orderedList',
      label: l().orderedList,
      labelWrapper: (label: string) => (
        <span class="flex items-center gap-2">
          <OrderedListIcon />
          {label}
        </span>
      ),
    },
    {
      value: 'taskList',
      label: l().taskList,
      labelWrapper: (label: string) => (
        <span class="flex items-center gap-2">
          <TaskListIcon />
          {label}
        </span>
      ),
    },
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
    <div class="min-w-0 overflow-x-auto border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800">
      <div class="flex w-max items-center divide-x divide-neutral-200 p-1.5 dark:divide-neutral-800">
        {/* Undo/Redo */}
        <Show when={config().history}>
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().undo().run()}
              disabled={props.disabled || !canUndo()}
              label={l().undo}
            >
              <ReverseLeftIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().redo().run()}
              disabled={props.disabled || !canRedo()}
              label={l().redo}
            >
              <ReverseRightIcon />
            </ToolbarButton>
          </ToolbarGroup>
        </Show>

        {/* Block Formatting: Headings, Lists, Blockquote, Code Block */}
        <Show
          when={
            config().headings ||
            config().lists ||
            config().blockquote ||
            config().codeBlock ||
            config().horizontalRule
          }
        >
          <ToolbarGroup>
            {/* Headings Dropdown */}
            <Show when={config().headings}>
              <Select
                options={headingSelectOptions()}
                value={String(getCurrentHeadingLevel())}
                onSelect={(opt) => {
                  if (opt) setHeading(Number(opt.value));
                }}
                disabled={props.disabled}
                inputComponent={(triggerProps) => {
                  const level = () => getCurrentHeadingLevel();
                  const Icon = () => HEADING_ICONS[String(level())];
                  return (
                    <Tooltip content={l().textStyle} placement="bottom">
                      <button
                        type="button"
                        disabled={triggerProps.disabled}
                        onKeyDown={triggerProps.onKeyDown}
                        role="combobox"
                        aria-expanded={triggerProps.isOpen()}
                        aria-controls={triggerProps.listboxId}
                        aria-activedescendant={triggerProps.highlightedOptionId()}
                        aria-haspopup="listbox"
                        aria-label={l().textStyle}
                        class="flex h-8 items-center gap-1 rounded px-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                      >
                        <Show when={Icon()} fallback={l().normal}>
                          {(Ic) => <Dynamic component={Ic()} />}
                        </Show>
                        <ChevronDownIcon class="size-3" />
                      </button>
                    </Tooltip>
                  );
                }}
              />
            </Show>

            {/* Lists Dropdown */}
            <Show when={config().lists}>
              <Select
                options={listSelectOptions()}
                value={getCurrentListType() ?? ''}
                onSelect={(opt) => {
                  if (opt) setList(opt.value);
                }}
                disabled={props.disabled}
                inputComponent={(triggerProps) => {
                  const listType = () => getCurrentListType();
                  const Icon = () => LIST_ICONS[listType() ?? ''] ?? ListIcon;
                  return (
                    <Tooltip content={l().listStyle} placement="bottom">
                      <button
                        type="button"
                        disabled={triggerProps.disabled}
                        onKeyDown={triggerProps.onKeyDown}
                        role="combobox"
                        aria-expanded={triggerProps.isOpen()}
                        aria-controls={triggerProps.listboxId}
                        aria-activedescendant={triggerProps.highlightedOptionId()}
                        aria-haspopup="listbox"
                        aria-label={l().listStyle}
                        class="flex h-8 items-center gap-1 rounded px-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                      >
                        <Dynamic component={Icon()} />
                        <ChevronDownIcon class="size-3" />
                      </button>
                    </Tooltip>
                  );
                }}
              />
            </Show>

            {/* Blockquote */}
            <Show when={config().blockquote}>
              <ToolbarButton
                onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
                isActive={isActive('blockquote')}
                disabled={props.disabled}
                label={l().blockquote}
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
                label={l().codeBlock}
              >
                <CodeSquare01Icon />
              </ToolbarButton>
            </Show>

            {/* Horizontal Rule */}
            <Show when={config().horizontalRule}>
              <ToolbarButton
                onClick={() => props.editor.chain().focus().setHorizontalRule().run()}
                disabled={props.disabled}
                label={l().horizontalRule}
              >
                <MinusIcon />
              </ToolbarButton>
            </Show>
          </ToolbarGroup>
        </Show>

        {/* Text Formatting: Bold, Italic, Strike, Code, Underline, Highlight, Link */}
        <Show when={config().formatting || config().highlight || config().link}>
          <ToolbarGroup>
            <Show when={config().formatting}>
              <ToolbarButton
                onClick={() => props.editor.chain().focus().toggleBold().run()}
                isActive={isActive('bold')}
                disabled={props.disabled}
                label={l().bold}
              >
                <Bold01Icon />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => props.editor.chain().focus().toggleItalic().run()}
                isActive={isActive('italic')}
                disabled={props.disabled}
                label={l().italic}
              >
                <Italic01Icon />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => props.editor.chain().focus().toggleStrike().run()}
                isActive={isActive('strike')}
                disabled={props.disabled}
                label={l().strikethrough}
              >
                <Strikethrough01Icon />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => props.editor.chain().focus().toggleCode().run()}
                isActive={isActive('code')}
                disabled={props.disabled}
                label={l().code}
              >
                <CodeSnippet02Icon />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => props.editor.chain().focus().toggleUnderline().run()}
                isActive={isActive('underline')}
                disabled={props.disabled}
                label={l().underline}
              >
                <Underline01Icon />
              </ToolbarButton>
            </Show>

            {/* Highlight Color */}
            <Show when={config().highlight}>
              <Popover
                position="bottom-start"
                content={
                  <div class="p-2">
                    <div class="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {l().highlight}
                    </div>
                    <div class="grid grid-cols-4 gap-1">
                      <For each={HIGHLIGHT_COLORS}>
                        {(item) => (
                          <Tooltip content={item.name} placement="bottom">
                            <button
                              type="button"
                              onClick={() => setHighlightColor(item.color)}
                              class="size-7 rounded border border-neutral-200 transition-transform hover:scale-110 dark:border-neutral-700"
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
                      class="mt-2 w-full rounded px-2 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    >
                      {l().removeHighlight}
                    </button>
                  </div>
                }
              >
                <Tooltip content={l().highlight} placement="bottom">
                  <button
                    type="button"
                    disabled={props.disabled}
                    class={`flex h-8 items-center gap-1 rounded px-2 transition-colors ${
                      isActive('highlight')()
                        ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white'
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <HighlighterIcon />
                    <ChevronDownIcon class="size-3" />
                  </button>
                </Tooltip>
              </Popover>
            </Show>

            {/* Link */}
            <Show when={config().link}>
              <Popover
                isOpen={showLinkInput()}
                onOpenChange={handleLinkPopoverChange}
                content={
                  <div class="flex items-center gap-1 p-1">
                    <input
                      type="url"
                      value={linkUrl()}
                      onInput={(e) => setLinkUrl(e.currentTarget.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyLink();
                        }
                        if (e.key === 'Escape') {
                          handleLinkPopoverChange(false);
                        }
                      }}
                      placeholder={l().enterUrl}
                      class="h-8 w-56 rounded border border-neutral-300 bg-white px-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      autofocus
                    />
                    <Tooltip content={l().applyLink} placement="bottom">
                      <button
                        type="button"
                        onClick={applyLink}
                        disabled={!linkUrl()}
                        class="flex size-8 items-center justify-center rounded text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                        aria-label={l().applyLink}
                      >
                        <CheckIcon />
                      </button>
                    </Tooltip>
                    <div class="mx-0.5 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
                    <Tooltip content={l().openInNewWindow} placement="bottom">
                      <button
                        type="button"
                        onClick={openLinkInNewWindow}
                        disabled={!linkUrl()}
                        class="flex size-8 items-center justify-center rounded text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                        aria-label={l().openInNewWindow}
                      >
                        <LinkExternal01Icon />
                      </button>
                    </Tooltip>
                    <Tooltip content={l().removeLink} placement="bottom">
                      <button
                        type="button"
                        onClick={removeLink}
                        disabled={!isActive('link')()}
                        class="flex size-8 items-center justify-center rounded text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-red-400"
                        aria-label={l().removeLink}
                      >
                        <Trash01Icon />
                      </button>
                    </Tooltip>
                  </div>
                }
              >
                <Tooltip content={l().link} placement="bottom">
                  <button
                    type="button"
                    disabled={props.disabled}
                    aria-label={l().link}
                    class={`flex size-8 items-center justify-center rounded transition-colors ${
                      isActive('link')()
                        ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white'
                    } ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <Link01Icon />
                  </button>
                </Tooltip>
              </Popover>
            </Show>
          </ToolbarGroup>
        </Show>

        {/* Superscript / Subscript */}
        <Show when={config().superSubscript}>
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().toggleSuperscript().run()}
              isActive={isActive('superscript')}
              disabled={props.disabled}
              label={l().superscript}
            >
              <SuperscriptIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().toggleSubscript().run()}
              isActive={isActive('subscript')}
              disabled={props.disabled}
              label={l().subscript}
            >
              <SubscriptIcon />
            </ToolbarButton>
          </ToolbarGroup>
        </Show>

        {/* Alignment */}
        <Show when={config().alignment}>
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().setTextAlign('left').run()}
              isActive={() => {
                void props.editorState;
                return (
                  !props.editor.isActive({ textAlign: 'center' }) &&
                  !props.editor.isActive({ textAlign: 'right' }) &&
                  !props.editor.isActive({ textAlign: 'justify' })
                );
              }}
              disabled={props.disabled}
              label={l().alignLeft}
            >
              <AlignLeftIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().setTextAlign('center').run()}
              isActive={() =>
                isActive('paragraph', { textAlign: 'center' })() ||
                isActive('heading', { textAlign: 'center' })()
              }
              disabled={props.disabled}
              label={l().alignCenter}
            >
              <AlignCenterIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().setTextAlign('right').run()}
              isActive={() =>
                isActive('paragraph', { textAlign: 'right' })() ||
                isActive('heading', { textAlign: 'right' })()
              }
              disabled={props.disabled}
              label={l().alignRight}
            >
              <AlignRightIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => props.editor.chain().focus().setTextAlign('justify').run()}
              isActive={() =>
                isActive('paragraph', { textAlign: 'justify' })() ||
                isActive('heading', { textAlign: 'justify' })()
              }
              disabled={props.disabled}
              label={l().alignJustify}
            >
              <AlignJustifyIcon />
            </ToolbarButton>
          </ToolbarGroup>
        </Show>

        {/* Image Upload */}
        <Show when={config().imageUpload}>
          <ToolbarGroup>
            <ToolbarButton
              onClick={insertImageUploadBlock}
              disabled={props.disabled}
              label={l().imageUpload}
            >
              <Image01Icon />
            </ToolbarButton>
          </ToolbarGroup>
        </Show>

        {/* Clear Formatting */}
        <Show when={config().clearFormatting}>
          <ToolbarGroup>
            <ToolbarButton
              onClick={() =>
                props.editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              disabled={props.disabled}
              label={l().clearFormatting}
            >
              <EraserIcon />
            </ToolbarButton>
          </ToolbarGroup>
        </Show>
      </div>
    </div>
  );
}
