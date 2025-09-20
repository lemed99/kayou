import {
  Accessor,
  ParentComponent,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

export interface ThemeType {
  systemTheme: 'dark' | 'light';
  appTheme: 'dark' | 'light' | 'system';
}

export interface ThemeContextType {
  systemTheme: Accessor<'dark' | 'light'>;
  appTheme: Accessor<'dark' | 'light' | 'system'>;
  setAppTheme: (theme: 'dark' | 'light' | 'system') => void;
}

export const ThemeContext = createContext<ThemeContextType>();

export const ThemeProvider: ParentComponent = (props) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const [theme, setTheme] = createSignal<string>(
    localStorage.getItem('theme') || 'system',
  );
  const [systemTheme, setSystemTheme] = createSignal<ThemeType['systemTheme']>(
    prefersDark.matches ? 'dark' : 'light',
  );
  const el = document.documentElement;
  const systemThemes = ['light', 'dark'];

  function updateDOM(theme: string) {
    if (systemThemes.includes(theme)) {
      el.setAttribute('class', theme);
      el.style.colorScheme = theme;
    }
  }

  const setAppTheme = (theme: ThemeType['appTheme']) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
    updateDOM(theme === 'system' ? systemTheme() : theme);
  };

  createEffect(() => {
    const handleThemeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setSystemTheme('dark');
        if (theme() === 'system') updateDOM('dark');
      } else {
        setSystemTheme('light');
        if (theme() === 'system') updateDOM('light');
      }
    };

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleThemeChange);

    onCleanup(() => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleThemeChange);
    });
  });

  onMount(() => {
    updateDOM(theme() === 'system' ? systemTheme() : theme());
  });

  return (
    <ThemeContext.Provider
      value={{
        systemTheme: systemTheme,
        appTheme: theme as ThemeContextType['appTheme'],
        setAppTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
