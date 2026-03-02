import { For, JSX, Show, createSignal } from 'solid-js';

import {
  CheckIcon,
  Edit05Icon,
  FlipBackwardIcon,
  Settings01Icon,
  Trash03Icon,
} from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Button from '../Button';
import Popover from '../Popover';
import TextInput from '../TextInput';
import { useDataTableInternal } from './DataTableInternalContext';
import { MAX_CONFIGS } from './useDataTableConfigs';

export function DataTableConfigs(): JSX.Element {
  const ctx = useDataTableInternal();

  const [saveMode, setSaveMode] = createSignal<'idle' | 'create'>('idle');
  const [editingConfigId, setEditingConfigId] = createSignal<string | null>(null);
  const [configName, setConfigName] = createSignal('');
  const [configNameEdit, setConfigNameEdit] = createSignal('');
  const [listOpen, setListOpen] = createSignal(false);
  const [deletingConfigId, setDeletingConfigId] = createSignal<string | null>(null);

  const activeConfig = () => {
    const id = ctx.activeConfigId();
    return id ? ctx.getConfig(id) : undefined;
  };

  const handleSaveNew = () => {
    setSaveMode('create');
    setConfigName('');
  };

  const handleEditConfig = (id: string) => {
    const config = ctx.getConfig(id);
    if (!config) return;
    setEditingConfigId(id);
    setConfigNameEdit(config.name);
  };

  const handleSubmit = () => {
    const name = configName().trim();
    if (!name) return;

    if (saveMode() === 'create') {
      ctx.onSaveConfig(name);
    }
    setConfigName('');
    setSaveMode('idle');
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

  const handleDirectConfigUpdate = () => {
    const currentConfig = activeConfig();
    if (!currentConfig) return;

    ctx.onUpdateConfig(currentConfig.id, currentConfig.name);
  };

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

  const handleActivate = (id: string | null) => {
    ctx.onActivateConfig(id);
    setListOpen(false);
  };

  const configListContent = () => (
    <div class="space-y-4 p-4" data-config-popover>
      <h3 class="font-medium">{ctx.labels().configPopoverContentTitle}</h3>
      <div class="w-[220px] space-y-1" data-config-list>
        <button
          type="button"
          onClick={() => handleActivate(null)}
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
                    <div class="flex w-full items-center justify-between gap-1">
                      <TextInput
                        placeholder={ctx.labels().configNamePlaceholder}
                        value={configNameEdit()}
                        onInput={(e) => setConfigNameEdit(e.currentTarget.value)}
                        sizing="sm"
                      />
                      <div class="flex px-1">
                        <button
                          onClick={() => handleCancelRename()}
                          class="shrink-0 cursor-pointer p-1 text-neutral-950 transition-all hover:text-red-500 dark:text-neutral-100"
                        >
                          <FlipBackwardIcon aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleRename()}
                          class="shrink-0 cursor-pointer p-1 text-neutral-950 transition-all hover:text-blue-600 dark:text-neutral-100"
                        >
                          <CheckIcon aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </Show>
                }
              >
                <div class="flex w-full items-center justify-between gap-1 rounded-md bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  <span class="flex-1 truncate px-3 py-2 text-sm">
                    {ctx.labels().deleteConfiguration}
                  </span>
                  <div class="flex px-1">
                    <button
                      onClick={cancelDeleteConfig}
                      class="shrink-0 cursor-pointer p-1 transition-all hover:text-red-900 dark:hover:text-red-100"
                      aria-label={ctx.labels().cancel}
                    >
                      <FlipBackwardIcon aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => confirmDeleteConfig(config.id)}
                      class="shrink-0 cursor-pointer p-1 transition-all hover:text-red-900 dark:hover:text-red-100"
                      aria-label={ctx.labels().deleteConfiguration}
                    >
                      <Trash03Icon aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>

      {/* Config saving section */}
      <Show when={ctx.isDirty()}>
        <div class="border-current/10 space-y-3 border-t pt-4">
          <Show when={saveMode() === 'create'}>
            <div class="flex flex-col gap-2">
              <TextInput
                label={ctx.labels().configNameLabel}
                placeholder={ctx.labels().configNamePlaceholder}
                value={configName()}
                onInput={(e) => setConfigName(e.currentTarget.value)}
              />
              <Button
                size="sm"
                color="anti-theme"
                onClick={handleSubmit}
                disabled={configName().trim().length === 0}
              >
                {ctx.labels().save}
              </Button>
            </div>
          </Show>

          <div class="flex flex-col gap-2">
            <Show when={ctx.activeConfigId() !== null}>
              <Button color="anti-theme" onClick={handleDirectConfigUpdate}>
                {ctx.labels().updateCurrentConfiguration}
              </Button>
            </Show>
            <Show when={saveMode() === 'idle' && !ctx.isAtLimit()}>
              <Button
                onClick={() => handleSaveNew()}
                color={ctx.activeConfigId() !== null ? 'theme' : 'anti-theme'}
              >
                {ctx.labels().saveAsNew}
              </Button>
            </Show>
          </div>

          {/* [TODO]: Implement context reset here and in DataTable context */}
          {/* <Button
              onClick={resetConfig}
              color='transparent'
            >
              Reset to Default
            </Button> */}
        </div>
      </Show>
    </div>
  );

  return (
    <Show when={ctx.configEnabled}>
      <div class="flex items-center justify-end gap-2">
        <Popover
          content={configListContent}
          position="bottom-end"
          isOpen={listOpen()}
          onOpenChange={(value) => {
            setSaveMode('idle');
            setConfigName('');
            setListOpen(value);
          }}
          aria-label={ctx.labels().configurations}
        >
          <Button
            size="sm"
            color="theme"
            class="rounded-b-none border-b-0 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            icon={Settings01Icon}
            data-config-list-trigger
          >
            {ctx.labels().configurations} ({ctx.configs().length}/{MAX_CONFIGS})
            <Show
              when={ctx.isDirty() && (!ctx.isAtLimit() || ctx.activeConfigId() !== null)}
            >
              <span class="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            </Show>
          </Button>
        </Popover>
      </div>
    </Show>
  );
}
