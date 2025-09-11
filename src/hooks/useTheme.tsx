import {
  Accessor,
  ParentComponent,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';

interface ThemeType {
  systemTheme: 'dark' | 'light';
  appTheme: 'dark' | 'light' | 'system';
}

interface ThemeContextType {
  systemTheme: Accessor<'dark' | 'light'>;
  appTheme: Accessor<'dark' | 'light' | 'system'>;
  setAppTheme: (theme: 'dark' | 'light' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType>();

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
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (event.matches) {
          setSystemTheme('dark');
          if (theme() === 'system') updateDOM('dark');
        } else {
          setSystemTheme('light');
          if (theme() === 'system') updateDOM('light');
        }
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
