import { For, JSX, Show, createSignal } from 'solid-js';

import {
  CheckCircleIcon,
  Copy01Icon,
  DeleteIcon,
  Edit01Icon,
  RefreshCcw01Icon,
  Save01Icon,
  Settings01Icon,
} from '@kayou/icons';

import Button from '../Button';
import Drawer from '../Drawer';
import Popover from '../Popover';
import TextInput from '../TextInput';
import { useDataTableInternal } from './DataTableInternalContext';

export function DataTableConfigs(): JSX.Element {
  const ctx = useDataTableInternal();

  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [drawerMode, setDrawerMode] = createSignal<
    'choose' | 'create' | 'edit'
  >('create');
  const [editingConfigId, setEditingConfigId] = createSignal<string | null>(
    null,
  );
  const [configName, setConfigName] = createSignal('');
  const [listOpen, setListOpen] = createSignal(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = createSignal(false);
  const [cameFromChoose, setCameFromChoose] = createSignal(false);

  const activeConfig = () => {
    const id = ctx.activeConfigId();
    return id ? ctx.getConfig(id) : undefined;
  };

  const openSaveDrawer = () => {
    if (ctx.activeConfigId() !== null) {
      setDrawerMode('choose');
    } else {
      setDrawerMode('create');
      setCameFromChoose(false);
    }
    setEditingConfigId(null);
    setConfigName('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (id: string) => {
    const config = ctx.getConfig(id);
    if (!config) return;
    setDrawerMode('edit');
    setEditingConfigId(id);
    setConfigName(config.name);
    setCameFromChoose(false);
    setListOpen(false);
    setDrawerOpen(true);
  };

  const handleChooseCreate = () => {
    setDrawerMode('create');
    setCameFromChoose(true);
    setConfigName('');
  };

  const handleChooseUpdate = () => {
    const config = activeConfig();
    const id = ctx.activeConfigId();
    if (id && config) {
      ctx.onUpdateConfig(id, config.name);
    }
    setDrawerOpen(false);
  };

  const handleSubmit = () => {
    const name = configName().trim();
    if (!name) return;

    if (drawerMode() === 'create') {
      ctx.onSaveConfig(name);
    } else {
      const id = editingConfigId();
      if (id) ctx.onUpdateConfig(id, name);
    }
    setDrawerOpen(false);
  };

  const handleDelete = () => {
    const id = editingConfigId();
    if (id) {
      ctx.onDeleteConfig(id);
      setDeleteConfirmOpen(false);
      setDrawerOpen(false);
    }
  };

  const handleActivate = (id: string | null) => {
    ctx.onActivateConfig(id);
    setListOpen(false);
  };

  const configListContent = () => (
    <div class="min-w-[220px] p-2" data-config-list>
      <button
        type="button"
        onClick={() => handleActivate(null)}
        class={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
          ctx.activeConfigId() === null
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
        }`}
      >
        <Show when={ctx.activeConfigId() === null}>
          <CheckCircleIcon class="size-4 shrink-0" aria-hidden="true" />
        </Show>
        <span class="flex-1">{ctx.labels().defaultConfiguration}</span>
      </button>

      <For each={ctx.configs()}>
        {(config) => (
          <div class="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleActivate(config.id)}
              class={`flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                ctx.activeConfigId() === config.id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              <Show when={ctx.activeConfigId() === config.id}>
                <CheckCircleIcon class="size-4 shrink-0" aria-hidden="true" />
              </Show>
              <span class="flex-1 truncate">{config.name}</span>
            </button>
            <button
              type="button"
              onClick={() => openEditDrawer(config.id)}
              class="shrink-0 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              aria-label={`Edit ${config.name}`}
            >
              <Edit01Icon class="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </For>
    </div>
  );

  const deleteConfirmContent = () => (
    <div class="p-3" data-config-delete-confirm>
      <p class="mb-3 text-sm text-gray-700 dark:text-neutral-300">
        {ctx.labels().confirmDelete}
      </p>
      <div class="flex items-center justify-end gap-2">
        <Button
          size="xs"
          color="light"
          onClick={() => setDeleteConfirmOpen(false)}
        >
          {ctx.labels().cancel}
        </Button>
        <Button size="xs" color="failure" onClick={handleDelete}>
          {ctx.labels().deleteConfiguration}
        </Button>
      </div>
    </div>
  );

  const drawerTitle = () =>
    drawerMode() === 'edit'
      ? ctx.labels().editConfigTitle
      : ctx.labels().saveConfigTitle;

  return (
    <Show when={ctx.configEnabled}>
      <div class="flex items-center gap-2">
        <Show
          when={
            ctx.isDirty() &&
            (!ctx.isAtLimit() || ctx.activeConfigId() !== null)
          }
        >
          <Button
            size="sm"
            color="blue"
            icon={Save01Icon}
            onClick={openSaveDrawer}
            class="whitespace-nowrap"
            data-config-save-trigger
          >
            {ctx.labels().saveConfiguration}
          </Button>
        </Show>

        <Show
          when={
            ctx.isDirty() &&
            ctx.isAtLimit() &&
            ctx.activeConfigId() === null
          }
        >
          <span class="whitespace-nowrap text-xs text-gray-500 dark:text-neutral-400">
            {ctx.labels().maxConfigsReached}
          </span>
        </Show>

        <Show when={ctx.hasConfigs()}>
          <Popover
            content={configListContent}
            position="bottom-end"
            isOpen={listOpen()}
            onOpenChange={setListOpen}
            aria-label={ctx.labels().configurations}
          >
            <Button
              size="sm"
              color="gray"
              icon={Settings01Icon}
              data-config-list-trigger
            >
              {activeConfig()?.name ?? ctx.labels().configurations}
            </Button>
          </Popover>
        </Show>
      </div>

      <Drawer
        show={drawerOpen()}
        onClose={() => setDrawerOpen(false)}
        title={drawerTitle()}
        position="right"
        width="w-full md:w-[400px]"
      >
        {/* Choose mode: two option cards */}
        <Show when={drawerMode() === 'choose'}>
          <div class="flex flex-col gap-3 p-6" data-config-choose>
            <Show when={!ctx.isAtLimit()}>
              <button
                type="button"
                onClick={handleChooseCreate}
                class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                data-config-choose-create
              >
                <Copy01Icon
                  class="mt-0.5 size-5 shrink-0 text-gray-500 dark:text-neutral-400"
                  aria-hidden="true"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {ctx.labels().createNewConfiguration}
                  </p>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                    {ctx.labels().createNewConfigurationDescription}
                  </p>
                </div>
              </button>
            </Show>

            <button
              type="button"
              onClick={handleChooseUpdate}
              class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              data-config-choose-update
            >
              <RefreshCcw01Icon
                class="mt-0.5 size-5 shrink-0 text-gray-500 dark:text-neutral-400"
                aria-hidden="true"
              />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {ctx.labels().updateCurrentConfiguration}
                </p>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                  {ctx.labels().updateCurrentConfigurationDescription}
                </p>
              </div>
            </button>
          </div>
        </Show>

        {/* Create / Edit mode: name form + footer */}
        <Show when={drawerMode() === 'create' || drawerMode() === 'edit'}>
          <div class="flex h-full flex-col">
            <div class="flex-1 p-6">
              <TextInput
                label={ctx.labels().configNameLabel}
                placeholder={ctx.labels().configNamePlaceholder}
                value={configName()}
                onInput={(e) => setConfigName(e.currentTarget.value)}
              />
            </div>

            <div class="flex items-center gap-2 border-t border-gray-200 px-6 py-4 dark:border-neutral-700">
              <Show when={drawerMode() === 'edit'}>
                <Popover
                  content={deleteConfirmContent}
                  position="top-start"
                  isOpen={deleteConfirmOpen()}
                  onOpenChange={setDeleteConfirmOpen}
                  aria-label={ctx.labels().confirmDelete}
                  floatingClass="z-[100]"
                >
                  <Button
                    size="sm"
                    color="failure"
                    icon={DeleteIcon}
                    aria-label={ctx.labels().deleteConfiguration}
                  >
                    {ctx.labels().deleteConfiguration}
                  </Button>
                </Popover>
              </Show>

              <div class="flex-1" />

              <Show
                when={cameFromChoose() && drawerMode() === 'create'}
                fallback={
                  <Button
                    size="sm"
                    color="light"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {ctx.labels().cancel}
                  </Button>
                }
              >
                <Button
                  size="sm"
                  color="light"
                  onClick={() => setDrawerMode('choose')}
                >
                  {ctx.labels().back}
                </Button>
              </Show>

              <Button
                size="sm"
                color="blue"
                onClick={handleSubmit}
                disabled={configName().trim().length === 0}
              >
                {ctx.labels().save}
              </Button>
            </div>
          </div>
        </Show>
      </Drawer>
    </Show>
  );
}
