import { For, JSX, Show, createSignal } from 'solid-js';

import {
  CheckIcon,
  Edit05Icon,
  Settings01Icon,
  Trash03Icon,
} from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Button from '../Button';
import Popover from '../Popover';
import TextInput from '../TextInput';
import { useDataTableInternal } from './DataTableInternalContext';
import { MAX_CONFIGS } from './useDataTableConfigs';

type SaveMode = 'idle' | 'save' | 'choose' | 'create';

export function DataTableConfigs(): JSX.Element {
  const ctx = useDataTableInternal();

  const [saveMode, setSaveMode] = createSignal<SaveMode>('idle');
  const [cameFromChoose, setCameFromChoose] = createSignal(false);
  const [editingConfigId, setEditingConfigId] = createSignal<string | null>(null);
  const [configName, setConfigName] = createSignal('');
  const [configNameEdit, setConfigNameEdit] = createSignal('');
  const [listOpen, setListOpen] = createSignal(false);
  const [deletingConfigId, setDeletingConfigId] = createSignal<string | null>(null);

  const activeConfig = () => {
    const id = ctx.activeConfigId();
    return id ? ctx.getConfig(id) : undefined;
  };

  const showSaveTrigger = () =>
    ctx.isDirty() && (!ctx.isAtLimit() || ctx.activeConfigId() !== null);

  const resetPopover = () => {
    setSaveMode('idle');
    setCameFromChoose(false);
    setConfigName('');
    setEditingConfigId(null);
    setConfigNameEdit('');
    setDeletingConfigId(null);
    setListOpen(false);
  };

  // ── Save trigger (separate button visible when dirty) ───────

  const handleSaveTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (ctx.activeConfigId() !== null) {
      setSaveMode('choose');
    } else {
      setSaveMode('save');
      setConfigName('');
    }
    setCameFromChoose(false);
    setListOpen(true);
  };

  // ── Config list trigger ─────────────────────────────────────

  const handleListTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (listOpen()) {
      resetPopover();
    } else {
      setSaveMode('idle');
      setEditingConfigId(null);
      setDeletingConfigId(null);
      setListOpen(true);
    }
  };

  // ── Save / create handlers ──────────────────────────────────

  const handleSubmit = () => {
    const name = configName().trim();
    if (!name) return;
    ctx.onSaveConfig(name);
    setConfigName('');
    resetPopover();
  };

  const handleDirectConfigUpdate = () => {
    const currentConfig = activeConfig();
    if (!currentConfig) return;
    ctx.onUpdateConfig(currentConfig.id, currentConfig.name);
    resetPopover();
  };

  // ── Inline edit handlers (stay within the list panel) ───────

  const handleEditConfig = (id: string) => {
    const config = ctx.getConfig(id);
    if (!config) return;
    setEditingConfigId(id);
    setConfigNameEdit(config.name);
  };

  const handleRename = () => {
    const name = configNameEdit().trim();
    if (!name) return;
    const id = editingConfigId();
    if (id) ctx.onUpdateConfig(id, name);
    setConfigNameEdit('');
    setEditingConfigId(null);
  };

  const handleCancelRename = () => {
    setConfigNameEdit('');
    setEditingConfigId(null);
  };

  // ── Delete handlers ─────────────────────────────────────────

  const handleDeleteConfig = (id: string) => {
    setEditingConfigId(null);
    setDeletingConfigId(id);
  };

  const confirmDeleteConfig = (id: string) => {
    ctx.onDeleteConfig(id);
    setDeletingConfigId(null);
  };

  const cancelDeleteConfig = () => {
    setDeletingConfigId(null);
  };

  // ── Activate handler ────────────────────────────────────────

  const handleActivate = (id: string | null) => {
    ctx.onActivateConfig(id);
    setListOpen(false);
  };

  // ── Popover content panels ──────────────────────────────────

  const configListContent = () => (
    <div class="space-y-4 p-4" data-config-popover>
      <Show
        when={editingConfigId() === null}
        fallback={<h3 class="font-medium">{ctx.labels().editConfigTitle}</h3>}
      >
        <h3 class="font-medium">{ctx.labels().configPopoverContentTitle}</h3>
      </Show>
      <div class="w-[220px] space-y-1" data-config-list>
        <button
          type="button"
          onClick={() => handleActivate(null)}
          aria-current={ctx.activeConfigId() === null ? 'true' : undefined}
          class={twMerge(
            'flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm',
            ctx.activeConfigId() === null
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
          )}
        >
          <Show when={ctx.activeConfigId() === null}>
            <CheckIcon class="size-4 shrink-0" aria-hidden="true" />
          </Show>
          <span class="flex-1">{ctx.labels().defaultConfiguration}</span>
        </button>

        <For each={ctx.configs()}>
          {(config) => (
            <div>
              <Show
                when={deletingConfigId() === config.id}
                fallback={
                  <Show
                    when={editingConfigId() === config.id}
                    fallback={
                      <div
                        class={twMerge(
                          'flex w-full items-center justify-between gap-1 rounded-md transition-all',
                          ctx.activeConfigId() === config.id
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleActivate(config.id)}
                          aria-current={ctx.activeConfigId() === config.id ? 'true' : undefined}
                          class="flex flex-1 cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm"
                        >
                          <Show when={ctx.activeConfigId() === config.id}>
                            <CheckIcon class="size-4 shrink-0" aria-hidden="true" />
                          </Show>
                          <span class="truncate">{config.name}</span>
                        </button>
                        <div class="flex px-1">
                          <button
                            onClick={() => handleEditConfig(config.id)}
                            class="shrink-0 cursor-pointer p-1 text-neutral-950 transition-all hover:text-blue-600 dark:text-neutral-100"
                            aria-label={`Edit ${config.name}`}
                          >
                            <Edit05Icon aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            class="shrink-0 cursor-pointer p-1 text-neutral-950 transition-all hover:text-red-500 dark:text-neutral-100"
                            aria-label={ctx.labels().deleteConfiguration}
                          >
                            <Trash03Icon aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    }
                  >
                    {/* Inline edit form */}
                    <div class="flex flex-col gap-2 rounded-md bg-neutral-50 p-2 dark:bg-neutral-800">
                      <TextInput
                        placeholder={ctx.labels().configNamePlaceholder}
                        value={configNameEdit()}
                        onInput={(e) => setConfigNameEdit(e.currentTarget.value)}
                        sizing="sm"
                      />
                      <div class="flex items-center gap-2">
                        <Button
                          size="xs"
                          color="theme"
                          onClick={() => handleCancelRename()}
                        >
                          {ctx.labels().cancel}
                        </Button>
                        <Button
                          size="xs"
                          color="anti-theme"
                          onClick={() => handleRename()}
                          disabled={configNameEdit().trim().length === 0}
                        >
                          {ctx.labels().save}
                        </Button>
                        <button
                          type="button"
                          aria-label={ctx.labels().deleteConfiguration}
                          onClick={() => setDeletingConfigId(config.id)}
                          class="ml-auto shrink-0 cursor-pointer p-1 text-red-500 transition-all hover:text-red-700 dark:hover:text-red-400"
                        >
                          <Trash03Icon aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </Show>
                }
              >
                <div
                  data-config-delete-confirm
                  class="flex flex-col gap-2 rounded-md bg-red-50 p-2 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                >
                  <span class="text-sm font-medium">
                    {ctx.labels().confirmDeletion}
                  </span>
                  <div class="flex gap-2">
                    <Button
                      size="xs"
                      color="theme"
                      onClick={cancelDeleteConfig}
                    >
                      {ctx.labels().cancel}
                    </Button>
                    <Button
                      size="xs"
                      color="danger"
                      onClick={() => confirmDeleteConfig(config.id)}
                    >
                      {ctx.labels().deleteConfiguration}
                    </Button>
                  </div>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );

  const saveFormContent = () => (
    <div class="w-[220px] space-y-4 p-4">
      <h3 class="font-medium">{ctx.labels().saveConfigTitle}</h3>
      <TextInput
        label={ctx.labels().configNameLabel}
        placeholder={ctx.labels().configNamePlaceholder}
        value={configName()}
        onInput={(e) => setConfigName(e.currentTarget.value)}
      />
      <div class="flex gap-2">
        <Show
          when={cameFromChoose()}
          fallback={
            <Button size="sm" color="theme" onClick={resetPopover}>
              {ctx.labels().cancel}
            </Button>
          }
        >
          <Button size="sm" color="theme" onClick={() => setSaveMode('choose')}>
            {ctx.labels().back}
          </Button>
        </Show>
        <Button
          size="sm"
          color="anti-theme"
          onClick={handleSubmit}
          disabled={configName().trim().length === 0}
        >
          {ctx.labels().save}
        </Button>
      </div>
    </div>
  );

  const chooseContent = () => (
    <div class="w-[220px] space-y-4 p-4" data-config-choose>
      <h3 class="font-medium">{ctx.labels().saveConfigTitle}</h3>
      <div class="flex flex-col gap-2">
        <Show when={ctx.activeConfigId() !== null}>
          <Button
            color="anti-theme"
            onClick={handleDirectConfigUpdate}
            data-config-choose-update
          >
            {ctx.labels().updateCurrentConfiguration}
          </Button>
        </Show>
        <Show when={!ctx.isAtLimit()}>
          <Button
            color={ctx.activeConfigId() !== null ? 'theme' : 'anti-theme'}
            onClick={() => {
              setCameFromChoose(true);
              setSaveMode('create');
              setConfigName('');
            }}
            data-config-choose-create
          >
            {ctx.labels().createNewConfiguration}
          </Button>
        </Show>
      </div>
    </div>
  );

  const popoverContent = () => {
    const m = saveMode();
    if (m === 'save' || m === 'create') return saveFormContent();
    if (m === 'choose') return chooseContent();
    return configListContent();
  };

  // ── Render ──────────────────────────────────────────────────

  return (
    <Show when={ctx.configEnabled && (ctx.hasConfigs() || ctx.isDirty())}>
      <div class="flex items-center justify-end gap-2">
        <Show when={showSaveTrigger()}>
          <Button
            size="sm"
            color="anti-theme"
            data-config-save-trigger
            onClick={handleSaveTriggerClick}
          >
            {ctx.labels().saveConfiguration}
          </Button>
        </Show>

        <Show
          when={
            ctx.isDirty() && ctx.isAtLimit() && ctx.activeConfigId() === null
          }
        >
          <span class="text-sm text-neutral-500 dark:text-neutral-400">
            {ctx.labels().maxConfigsReached}
          </span>
        </Show>

        <Popover
          content={() => (
            // Stop delegated click from crossing Portal _$host boundary
            // to the Popover trigger, which would toggle the popover closed.
            <div onClick={(e) => e.stopPropagation()}>
              {popoverContent()}
            </div>
          )}
          position="bottom-end"
          backgroundScrollBehavior="follow"
          isOpen={listOpen()}
          onOpenChange={(value) => {
            if (!value) resetPopover();
          }}
          aria-label={ctx.labels().configurations}
        >
          <Show when={ctx.hasConfigs()}>
            <Button
              size="sm"
              color="theme"
              class="rounded-b-none border-b-0 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              icon={Settings01Icon}
              data-config-list-trigger
              aria-haspopup="dialog"
              aria-expanded={listOpen()}
              onClick={handleListTriggerClick}
            >
              {activeConfig()?.name ?? ctx.labels().configurations} ({ctx.configs().length}/{MAX_CONFIGS})
              <Show
                when={ctx.isDirty() && (!ctx.isAtLimit() || ctx.activeConfigId() !== null)}
              >
                <span class="h-2 w-2 animate-pulse rounded-full bg-amber-500" aria-hidden="true" />
                <span class="sr-only">(unsaved changes)</span>
              </Show>
            </Button>
          </Show>
        </Popover>
      </div>
    </Show>
  );
}
