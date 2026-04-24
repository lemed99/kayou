import {
  For,
  JSX,
  Show,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from 'solid-js';

import { XCloseIcon } from '@kayou/icons';

import { capitalizeFirstWord } from '../helpers';
import Badge, { type BadgeColor, type BadgeSize } from './Badge';
import HelperText from './HelperText';
import Label from './Label';
import TextInput, { type TextInputProps } from './TextInput';

type ExtendedTextInputProps = Omit<
  TextInputProps,
  'ariaLabels' | 'defaultValue' | 'helperText' | 'type' | 'value'
>;

export interface TagInputLabels {
  noTags: string;
}

export interface TagInputAriaLabels {
  removeTag: string;
  tagList: string;
  tagStatus: string;
}

export const DEFAULT_TAG_INPUT_ARIA_LABELS: TagInputAriaLabels = {
  removeTag: 'Remove tag',
  tagList: 'Selected tags',
  tagStatus: 'Tag input status',
};

export interface TagInputProps extends ExtendedTextInputProps {
  /** Helper text displayed below the tag list. */
  helperText?: string;
  /** Selected tags. When provided, the component becomes controlled. */
  value?: string[];
  /** Initial tags for uncontrolled usage. */
  defaultValue?: string[];
  /** Callback fired when tags change. */
  onValueChange?: (value: string[]) => void;
  /** Allow duplicate tags. Defaults to false. */
  allowDuplicates?: boolean;
  /** Maximum number of tags that can be added. */
  maxTags?: number;
  /** Badge color used to display each tag. Defaults to gray. */
  badgeColor?: BadgeColor;
  /** Badge size used to display each tag. Defaults to xs. */
  badgeSize?: BadgeSize;
  /** Labels for i18n support. */
  ariaLabels?: Partial<TagInputAriaLabels>;
  /** i18n labels for visible texts */
  labels?: Partial<TagInputLabels>;
  /** Whether to capitalize the first word of the label. */
  capitalizeFirstWord?: boolean;
}

const theme = {
  tagList: 'mb-2 flex flex-wrap gap-1',
  tagItem: 'flex items-center',
  tagContent: 'flex items-center gap-1.5',
  removeButton:
    'transition-colors cursor-pointer focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-blue-600 dark:focus:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
  emptyState: 'mt-2 text-xs text-neutral-500 dark:text-neutral-400',
  status: 'sr-only',
};

const TAG_SEPARATORS = [',', ';'];
const separatorPattern = /[;,]/;

const normalizeTag = (value: string) => value.trim();

const TagInput = (props: TagInputProps): JSX.Element => {
  const [local, inputProps] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'allowDuplicates',
    'maxTags',
    'badgeColor',
    'badgeSize',
    'ariaLabels',
    'helperText',
    'id',
    'disabled',
    'readOnly',
    'labels',
    'capitalizeFirstWord',
    'label',
  ]);

  const [internalTags, setInternalTags] = createSignal(local.defaultValue ?? []);
  const [internalInputValue, setInternalInputValue] = createSignal('');
  const [announcement, setAnnouncement] = createSignal('');

  const uniqueId = createUniqueId();
  const inputId = createMemo(() => local.id ?? `taginput-${uniqueId}`);
  const helperId = createMemo(() =>
    local.helperText ? `${inputId()}-helper` : undefined,
  );
  const listId = createMemo(() => `${inputId()}-tags`);
  const statusId = createMemo(() => `${inputId()}-status`);

  const tags = createMemo(() => local.value ?? internalTags());

  const a = createMemo(() => ({
    ...DEFAULT_TAG_INPUT_ARIA_LABELS,
    ...local.ariaLabels,
  }));

  const describedBy = createMemo(
    () => [helperId(), statusId()].filter(Boolean).join(' ') || undefined,
  );
  const allowMutations = createMemo(() => !local.disabled && !local.readOnly);
  const badgeColor = createMemo(() => local.badgeColor ?? 'default');
  const badgeSize = createMemo(() => local.badgeSize ?? 'xs');

  const setTags = (next: string[]) => {
    if (local.value === undefined) {
      setInternalTags(next);
    }
    local.onValueChange?.(next);
    setAnnouncement(`${next.length} tag${next.length === 1 ? '' : 's'} selected`);
  };

  const setCurrentValue = (next: string) => {
    setInternalInputValue(next);
  };

  const appendTags = (nextTags: string[]) => {
    if (!allowMutations()) return;

    const updated = [...tags()];
    const added: string[] = [];

    for (const rawTag of nextTags) {
      const tag = normalizeTag(rawTag);
      if (!tag) continue;
      if (!local.allowDuplicates && updated.includes(tag)) continue;
      if (local.maxTags !== undefined && updated.length >= local.maxTags) break;
      updated.push(tag);
      added.push(tag);
    }

    if (added.length === 0) return;

    setTags(updated);
    setAnnouncement(`Added ${added.join(', ')}`);
    return true;
  };

  const removeTag = (indexToRemove: number) => {
    if (!allowMutations()) return;

    const tagToRemove = tags()[indexToRemove];
    if (!tagToRemove) return;

    const next = tags().filter((_, index) => index !== indexToRemove);
    if (next.length === tags().length) return;

    setTags(next);
    setAnnouncement(`Removed ${tagToRemove}`);
  };

  const commitInputValue = () => {
    const next = normalizeTag(internalInputValue());
    if (!next) {
      setCurrentValue('');
      return;
    }

    if (appendTags([next])) {
      setCurrentValue('');
    }
  };

  const ingestValue = (value: string) => {
    if (!separatorPattern.test(value)) {
      setCurrentValue(value);
      return;
    }

    const parts = value.split(separatorPattern);
    const endsWithSeparator = TAG_SEPARATORS.includes(value.slice(-1));
    const completedTags = endsWithSeparator ? parts : parts.slice(0, -1);
    const remainder = endsWithSeparator ? '' : (parts[parts.length - 1] ?? '');

    appendTags(completedTags);
    setCurrentValue(remainder.replace(/^\s+/, ''));
  };

  const handleInput = (
    event: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    ingestValue(event.currentTarget.value);
  };

  const handleKeyDown = (
    event: KeyboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    if (event.defaultPrevented || !allowMutations()) return;

    if (TAG_SEPARATORS.includes(event.key)) {
      event.preventDefault();
      commitInputValue();
      return;
    }

    if (event.key === 'Enter' && internalInputValue().trim()) {
      event.preventDefault();
      commitInputValue();
      return;
    }

    if (event.key === 'Backspace' && !internalInputValue() && tags().length > 0) {
      event.preventDefault();
      removeTag(tags().length - 1);
    }
  };

  const handleBlur = (
    _event: FocusEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    commitInputValue();
  };

  const handlePaste = (
    event: ClipboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    if (!allowMutations()) {
      return;
    }

    const pastedText = event.clipboardData?.getData('text');
    if (pastedText && separatorPattern.test(pastedText)) {
      event.preventDefault();
      if (appendTags(pastedText.split(separatorPattern))) {
        setCurrentValue('');
      }
    }
  };

  return (
    <div class="w-full">
      <Show when={local.label}>
        <div class="mb-1 block">
          <Label
            for={inputId()}
            value={local.label}
            color={props.color ?? 'gray'}
            capitalizeFirstWord={local.capitalizeFirstWord}
          />
          <Show when={props.required}>
            <span aria-hidden="true" class="ml-0.5 font-medium text-red-500">
              *
            </span>
          </Show>
        </div>
      </Show>
      <Show when={tags().length > 0}>
        <ul id={listId()} class={theme.tagList} aria-label={a().tagList}>
          <For each={tags()}>
            {(tag, index) => (
              <li class={theme.tagItem}>
                <Badge color={badgeColor()} size={badgeSize()}>
                  <div class={theme.tagContent}>
                    <span>{capitalizeFirstWord(tag)}</span>
                    <button
                      type="button"
                      class={theme.removeButton}
                      onClick={() => removeTag(index())}
                      disabled={!allowMutations()}
                      aria-label={`${a().removeTag} ${tag}`}
                    >
                      <XCloseIcon class="size-2" aria-hidden="true" />
                    </button>
                  </div>
                </Badge>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <TextInput
        {...inputProps}
        id={inputId()}
        value={internalInputValue()}
        helperText={undefined}
        disabled={local.disabled}
        readOnly={local.readOnly}
        aria-describedby={describedBy()}
        aria-controls={listId()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
        autocomplete="off"
        capitalizeFirstWord={local.capitalizeFirstWord}
      />

      <div
        id={statusId()}
        class={theme.status}
        role="status"
        aria-label={a().tagStatus}
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement() ||
          `${tags().length} tag${tags().length === 1 ? '' : 's'} selected`}
      </div>

      <Show when={local.helperText}>
        <HelperText
          id={helperId()}
          content={local.helperText!}
          color={props.color ?? 'gray'}
        />
      </Show>
    </div>
  );
};

export default TagInput;
