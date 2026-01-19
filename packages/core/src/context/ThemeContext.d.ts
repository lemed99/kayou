import { Accessor, ParentComponent } from 'solid-js';
export interface ThemeType {
    systemTheme: 'dark' | 'light';
    appTheme: 'dark' | 'light' | 'system';
}
export interface ThemeContextType {
    systemTheme: Accessor<'dark' | 'light'>;
    appTheme: Accessor<'dark' | 'light' | 'system'>;
    setAppTheme: (theme: 'dark' | 'light' | 'system') => void;
}
export declare const ThemeContext: import("solid-js").Context<ThemeContextType | undefined>;
export declare const ThemeProvider: ParentComponent;
