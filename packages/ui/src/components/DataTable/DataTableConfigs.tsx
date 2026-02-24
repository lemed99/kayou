import { For, JSX, Show, createSignal } from 'solid-js';

import {
  AlertCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  Edit01Icon,
  Settings01Icon,
  Trash01Icon,
  XIcon,
} from '@kayou/icons';

import Alert from '../Alert';
import Button from '../Button';
import Popover from '../Popover';
import TextInput from '../TextInput';
import { useDataTableInternal } from './DataTableInternalContext';
import { MAX_CONFIGS } from './useDataTableConfigs';

export function DataTableConfigs(): JSX.Element {
  const ctx = useDataTableInternal();

  const [saveMode, setSaveMode] = createSignal<'idle' | 'create' | 'edit'>('idle');
  const [editingConfigId, setEditingConfigId] = createSignal<string | null>(null);
  const [configName, setConfigName] = createSignal('');
  const [configNameEdit, setConfigNameEdit] = createSignal('');
  const [listOpen, setListOpen] = createSignal(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = createSignal(false);

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

  const handleDelete = (id: string) => {
    if (id) {
      ctx.onDeleteConfig(id);
      setDeleteConfirmOpen(false);
    }
  };

  const handleActivate = (id: string | null) => {
    ctx.onActivateConfig(id);
    setListOpen(false);
  };

  const configListContent = () => (
    <div class="space-y-4 p-4" data-config-popover>
      <h3 class="font-medium">{ctx.labels().configPopoverContentTitle}</h3>
      <Show when={ctx.isAtLimit()}>
        <Alert
          color="warning"
          icon={AlertCircleIcon}
          additionalContent={ctx.labels().configLimitReachedAdditionnal}
        >
          {ctx.labels().configLimitReached}
        </Alert>
      </Show>
      <div class="min-w-[220px] space-y-2" data-config-list>
        <button
          type="button"
          onClick={() => handleActivate(null)}
          class={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
            ctx.activeConfigId() === null
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <Show when={ctx.activeConfigId() === null}>
            <CheckCircleIcon class="size-4 shrink-0" aria-hidden="true" />
          </Show>
          <span class="flex-1">{ctx.labels().defaultConfiguration}</span>
        </button>

        <For each={ctx.configs()}>
          {(config) => (
            <div
              class={`flex items-center gap-1 rounded-md ${
                ctx.activeConfigId() === config.id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              <Show
                when={editingConfigId() === config.id}
                fallback={
                  <>
                    <button
                      type="button"
                      onClick={() => handleActivate(config.id)}
                      class={`flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm`}
                    >
                      <Show when={ctx.activeConfigId() === config.id}>
                        <CheckCircleIcon class="size-4 shrink-0" aria-hidden="true" />
                      </Show>
                      <span class="flex-1 truncate">{config.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditConfig(config.id)}
                      class="shrink-0 cursor-pointer p-2 text-white hover:text-yellow-600"
                      aria-label={`Edit ${config.name}`}
                    >
                      <Edit01Icon class="size-4" aria-hidden="true" />
                    </button>
                    <Popover
                      content={deleteConfirmContent({ configId: config.id })}
                      position="top-start"
                      isOpen={deleteConfirmOpen()}
                      onOpenChange={setDeleteConfirmOpen}
                      aria-label={ctx.labels().confirmDelete}
                      floatingClass="z-[100]"
                    >
                      <Button
                        size="sm"
                        color="transparent"
                        class="border-0 hover:text-red-500"
                        icon={Trash01Icon}
                        aria-label={ctx.labels().deleteConfiguration}
                      />
                    </Popover>
                  </>
                }
              >
                <TextInput
                  placeholder={ctx.labels().configNamePlaceholder}
                  value={configNameEdit()}
                  onInput={(e) => setConfigNameEdit(e.currentTarget.value)}
                  autofocus
                />
                <button onClick={() => handleRename()} class="p-1 text-emerald-500">
                  <CheckIcon class="size-4" />
                </button>
                <button onClick={() => handleCancelRename()} class="p-1 text-red-500">
                  <XIcon class="size-4" />
                </button>
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
                onClick={handleSubmit}
                disabled={configName().trim().length === 0}
              >
                {ctx.labels().save}
              </Button>
            </div>
          </Show>

          <div class="flex flex-col gap-2">
            <Show
              when={ctx.isDirty() && !ctx.isAtLimit() && ctx.activeConfigId() !== null}
            >
              <Button class="w-auto" onClick={handleDirectConfigUpdate}>
                {ctx.labels().updateCurrentConfiguration}
              </Button>
            </Show>
            <Show when={saveMode() === 'idle' && ctx.isDirty() && !ctx.isAtLimit()}>
              <Button
                onClick={() => handleSaveNew()}
                disabled={ctx.isAtLimit()}
                class="w-auto"
                color={
                  ctx.isDirty() && !ctx.isAtLimit() && ctx.activeConfigId() !== null
                    ? 'transparent'
                    : 'info'
                }
                title={ctx.isAtLimit() ? ctx.ariaLabels().saveAsNewConfigTitle : ''}
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

  const deleteConfirmContent = (props: { configId: string }) => (
    <div class="p-3" data-config-delete-confirm>
      <p class="mb-3 text-sm text-neutral-700 dark:text-neutral-300">
        {ctx.labels().confirmDelete}
      </p>
      <div class="flex items-center justify-end gap-2">
        <Button size="xs" color="transparent" onClick={() => setDeleteConfirmOpen(false)}>
          {ctx.labels().cancel}
        </Button>
        <Button size="xs" color="danger" onClick={() => handleDelete(props.configId)}>
          {ctx.labels().deleteConfiguration}
        </Button>
      </div>
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
            color="transparent"
            class="rounded-b-none border-b-0 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            icon={Settings01Icon}
            data-config-list-trigger
          >
            {ctx.labels().configurations} ({ctx.configs().length}/{MAX_CONFIGS})
            <Show
              when={ctx.isDirty() && (!ctx.isAtLimit() || ctx.activeConfigId() !== null)}
            >
              <span class="h-2 w-2 rounded-full bg-amber-500" />
            </Show>
            <Show when={ctx.isDirty() && ctx.isAtLimit() && ctx.activeConfigId === null}>
              <span
                class="h-2 w-2 animate-pulse rounded-full bg-amber-500"
                title={ctx.labels().maxConfigsReached}
              />
            </Show>
          </Button>
        </Popover>
      </div>
    </Show>
  );
}
