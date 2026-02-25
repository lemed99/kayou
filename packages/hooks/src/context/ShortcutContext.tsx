import { type JSX, type ParentComponent, createContext, createEffect, createMemo, on, onCleanup, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

export interface ShortcutAction {
  id: string;
  label: string;
  description?: string;
  category?: string;
  defaultShortcut: string;
  handler: () => void;
  ignoreInputs?: boolean;
}

export interface RegisteredAction {
  id: string;
  label: string;
  description?: string;
  category?: string;
  defaultShortcut: string;
  currentShortcut: string;
  handler: () => void;
  ignoreInputs: boolean;
}

export interface ShortcutContextValue {
  register: (action: ShortcutAction) => void;
  unregister: (actionId: string) => void;
  updateBinding: (actionId: string, newShortcut: string) => void;
  resetBinding: (actionId: string) => void;
  resetAll: () => void;
  getActions: () => RegisteredAction[];
  getConflicts: () => Map<string, string[]>;
}

export interface ShortcutProviderProps {
  namespace?: string;
  children: JSX.Element;
}

const MODIFIER_ORDER = ['Ctrl', 'Alt', 'Shift', 'Meta'] as const;
const MODIFIER_SET = new Set<string>(MODIFIER_ORDER);
const RAW_MODIFIER_KEYS = new Set(['Control', 'Alt', 'Shift', 'Meta']);

export function normalizeCombo(combo: string): string {
  if (!combo) return '';

  const parts = combo.split('+').map((p) => p.trim());
  const modifiers: string[] = [];
  let key = '';

  for (const part of parts) {
    const capitalized = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    const normalized = capitalized === 'Control' ? 'Ctrl' : capitalized;
    if (MODIFIER_SET.has(normalized)) {
      modifiers.push(normalized);
    } else {
      key = part.length === 1 ? part.toUpperCase() : part;
    }
  }

  modifiers.sort(
    (a, b) => MODIFIER_ORDER.indexOf(a as (typeof MODIFIER_ORDER)[number]) - MODIFIER_ORDER.indexOf(b as (typeof MODIFIER_ORDER)[number]),
  );

  return [...modifiers, key].filter(Boolean).join('+');
}

export function comboFromEvent(e: KeyboardEvent): string | null {
  if (RAW_MODIFIER_KEYS.has(e.key)) return null;

  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');

  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  parts.push(key);

  return parts.join('+');
}

function loadBindings(namespace: string): Record<string, string> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(`shortcuts:${namespace}`);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function saveBindings(namespace: string, bindings: Record<string, string>): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(`shortcuts:${namespace}`, JSON.stringify(bindings));
  } catch {
    // ignore
  }
}

function isInputFocused(): boolean {
  if (typeof document === 'undefined') return false;
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if ((active as HTMLElement).isContentEditable) return true;
  return false;
}

export const ShortcutContext = createContext<ShortcutContextValue>();

export const ShortcutProvider: ParentComponent<ShortcutProviderProps> = (props) => {
  const [registry, setRegistry] = createStore<Record<string, RegisteredAction>>({});
  const [customBindings, setCustomBindings] = createStore<Record<string, string>>(
    // eslint-disable-next-line solid/reactivity --- namespace won't change
    props.namespace ? loadBindings(props.namespace) : {},
  );

  const comboToActionId = createMemo(() => {
    const map = new Map<string, string>();
    for (const action of Object.values(registry)) {
      if (action.currentShortcut) {
        map.set(action.currentShortcut, action.id);
      }
    }
    return map;
  });

  const getConflicts = createMemo(() => {
    const comboActions = new Map<string, string[]>();
    for (const action of Object.values(registry)) {
      if (!action.currentShortcut) continue;
      const existing = comboActions.get(action.currentShortcut) ?? [];
      existing.push(action.id);
      comboActions.set(action.currentShortcut, existing);
    }
    const conflicts = new Map<string, string[]>();
    for (const [combo, ids] of comboActions) {
      if (ids.length > 1) conflicts.set(combo, ids);
    }
    return conflicts;
  });

  const getActions = createMemo(() => Object.values(registry));

  createEffect(
    on(
      () => ({ ...customBindings }),
      (bindings) => {
        if (props.namespace) {
          saveBindings(props.namespace, bindings);
        }
      },
      { defer: true },
    ),
  );

  createEffect(() => {
    if (typeof document === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const combo = comboFromEvent(e);
      if (!combo) return;

      const actionId = comboToActionId().get(combo);
      if (!actionId) return;

      const action = registry[actionId];
      if (!action) return;

      if (action.ignoreInputs && isInputFocused()) return;

      e.preventDefault();
      action.handler();
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));
  });

  const register = (action: ShortcutAction): void => {
    const existing = registry[action.id];
    if (existing) {
      console.warn(`[ShortcutProvider] Action "${action.id}" already registered. Replacing.`);
    }

    const customCombo = customBindings[action.id];
    const currentShortcut = customCombo ?? normalizeCombo(action.defaultShortcut);

    setRegistry(
      produce((draft) => {
        draft[action.id] = {
          id: action.id,
          label: action.label,
          description: action.description,
          category: action.category,
          defaultShortcut: normalizeCombo(action.defaultShortcut),
          currentShortcut,
          handler: action.handler,
          ignoreInputs: action.ignoreInputs ?? true,
        };
      }),
    );
  };

  const unregister = (actionId: string): void => {
    setRegistry(
      produce((draft) => {
        delete draft[actionId];
      }),
    );
  };

  const updateBinding = (actionId: string, newShortcut: string): void => {
    const normalized = normalizeCombo(newShortcut);
    setRegistry(
      produce((draft) => {
        if (draft[actionId]) {
          draft[actionId].currentShortcut = normalized;
        }
      }),
    );
    setCustomBindings(
      produce((draft) => {
        draft[actionId] = normalized;
      }),
    );
  };

  const resetBinding = (actionId: string): void => {
    const action = registry[actionId];
    if (!action) return;
    setRegistry(
      produce((draft) => {
        draft[actionId].currentShortcut = draft[actionId].defaultShortcut;
      }),
    );
    setCustomBindings(
      produce((draft) => {
        delete draft[actionId];
      }),
    );
  };

  const resetAll = (): void => {
    setRegistry(
      produce((draft) => {
        for (const id of Object.keys(draft)) {
          draft[id].currentShortcut = draft[id].defaultShortcut;
        }
      }),
    );
    setCustomBindings({});
  };

  const contextValue: ShortcutContextValue = {
    register,
    unregister,
    updateBinding,
    resetBinding,
    resetAll,
    getActions,
    getConflicts,
  };

  return (
    <ShortcutContext.Provider value={contextValue}>
      {props.children}
    </ShortcutContext.Provider>
  );
};

export const useShortcutContext = (): ShortcutContextValue | undefined => {
  return useContext(ShortcutContext);
};
