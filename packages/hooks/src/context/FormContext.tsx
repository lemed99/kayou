import { type ParentComponent, createContext, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

export interface FormContextType {
  get: (id: string) => Record<string, unknown> | undefined;
  save: (id: string, values: Record<string, unknown>) => void;
  clear: (id: string) => void;
}

export interface FormProviderProps {
  storageKey: string;
}

export const FormContext = createContext<FormContextType>();

function loadFromStorage(key: string): Record<string, Record<string, unknown>> {
  try {
    if (typeof sessionStorage === 'undefined') return {};
    const raw = sessionStorage.getItem(`forms:${key}`);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Record<string, unknown>>;
  } catch {
    return {};
  }
}

function writeToStorage(
  key: string,
  data: Record<string, Record<string, unknown>>,
): void {
  try {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(`forms:${key}`, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export const FormProvider: ParentComponent<FormProviderProps> = (props) => {
  const [store, setStore] = createStore<Record<string, Record<string, unknown>>>(
    // eslint-disable-next-line solid/reactivity --- storageKey won't change
    loadFromStorage(props.storageKey),
  );

  const get = (id: string): Record<string, unknown> | undefined => {
    return store[id];
  };

  const save = (id: string, values: Record<string, unknown>): void => {
    setStore(
      produce((draft) => {
        draft[id] = values;
      }),
    );
    writeToStorage(props.storageKey, { ...store, [id]: values });
  };

  const clear = (id: string): void => {
    setStore(
      produce((draft) => {
        delete draft[id];
      }),
    );
    writeToStorage(props.storageKey, { ...store });
  };

  return (
    <FormContext.Provider value={{ get, save, clear }}>
      {props.children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextType | undefined => {
  return useContext(FormContext);
};
