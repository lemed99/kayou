import { onCleanup, useContext } from 'solid-js';

import { ShortcutContext, type ShortcutAction } from '../context/ShortcutContext';

export interface UseShortcutOptions {
  shortcut: string;
  handler: () => void;
  label: string;
  description?: string;
  category?: string;
  ignoreInputs?: boolean;
}

export interface UseShortcutReturn {
  trigger: () => void;
}

export function useShortcut(actionId: string, options: UseShortcutOptions): UseShortcutReturn {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error('useShortcut must be used within a ShortcutProvider');
  }

  const action: ShortcutAction = {
    id: actionId,
    label: options.label,
    description: options.description,
    category: options.category,
    defaultShortcut: options.shortcut,
    handler: options.handler,
    ignoreInputs: options.ignoreInputs,
  };

  context.register(action);

  onCleanup(() => {
    context.unregister(actionId);
  });

  return {
    trigger: options.handler,
  };
}
