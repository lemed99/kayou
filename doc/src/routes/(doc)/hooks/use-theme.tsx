import HookDocPage from '../../../components/HookDocPage';

export default function UseThemePage() {
  return (
    <HookDocPage
      title="useTheme"
      description="A hook for reading and updating the active color theme. Returns the current OS-level system theme, the user-selected app theme ('dark' | 'light' | 'system'), and a setter that persists the selection to localStorage and updates the documentElement class. Must be used within a ThemeProvider."
      parameters={[]}
      returnType="ThemeContextType"
      returns={[
        {
          name: 'systemTheme',
          type: "Accessor<'dark' | 'light'>",
          description:
            'Accessor for the OS-level color scheme as reported by the prefers-color-scheme media query.',
        },
        {
          name: 'appTheme',
          type: "Accessor<'dark' | 'light' | 'system'>",
          description:
            "Accessor for the user's selected theme. When 'system', the rendered theme follows systemTheme.",
        },
        {
          name: 'setAppTheme',
          type: "(theme: 'dark' | 'light' | 'system') => void",
          description:
            "Updates the active theme, persists it to localStorage under the 'theme' key, and applies the resulting class to <html>.",
        },
      ]}
      types={[
        {
          name: 'ThemeContextType',
          description: 'Shape of the value returned by useTheme().',
          props: [
            {
              name: 'systemTheme',
              type: "Accessor<'dark' | 'light'>",
              description: 'Reactive accessor for the OS color scheme.',
            },
            {
              name: 'appTheme',
              type: "Accessor<'dark' | 'light' | 'system'>",
              description: 'Reactive accessor for the user-selected theme.',
            },
            {
              name: 'setAppTheme',
              type: "(theme: 'dark' | 'light' | 'system') => void",
              description: 'Sets and persists the user-selected theme.',
            },
          ],
        },
        {
          name: 'ThemeType',
          description: 'Underlying theme value shape used internally.',
          props: [
            {
              name: 'systemTheme',
              type: "'dark' | 'light'",
              description: 'OS-reported color scheme.',
            },
            {
              name: 'appTheme',
              type: "'dark' | 'light' | 'system'",
              description: 'User-selected theme.',
            },
          ],
        },
      ]}
      usage={`
        import { useTheme, ThemeProvider } from '@kayou/hooks';

        function ThemeToggle() {
          const { appTheme, setAppTheme } = useTheme();

          return (
            <select
              value={appTheme()}
              onChange={(e) => setAppTheme(e.currentTarget.value as 'dark' | 'light' | 'system')}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          );
        }
      `}
      provider={{
        name: 'ThemeProvider',
        description:
          "Wraps your application to provide theme context. On mount, reads the 'theme' key from localStorage (falling back to 'system'), applies the resulting class ('light' or 'dark') to <html>, and listens for prefers-color-scheme changes so 'system' stays in sync.",
        example: `
          import { ThemeProvider } from '@kayou/hooks';

          function App() {
            return (
              <ThemeProvider>
                <MyApp />
              </ThemeProvider>
            );
          }
        `,
        props: [],
      }}
    />
  );
}
