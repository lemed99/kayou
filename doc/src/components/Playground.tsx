import {
  type JSX,
  Show,
  ErrorBoundary as SolidErrorBoundary,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import {
  bracketMatching,
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import {
  CheckIcon,
  Copy01Icon,
  Moon01Icon,
  RefreshCw01Icon,
  SunIcon,
} from '@kayou/icons';

import { dedent } from '../helpers/dedent';
import { formatCode } from '../helpers/format-code';
import { type CompileResult, compileAndExecute } from '../helpers/playground-compiler';

interface PlaygroundProps {
  code: string;
}

export default function Playground(props: PlaygroundProps): JSX.Element {
  let editorContainerRef!: HTMLDivElement;
  let editorView: EditorView | undefined;

  // eslint-disable-next-line solid/reactivity -- props.code is static per mount, not reactive
  const initialCode = dedent`${props.code}`;

  const [currentCode, setCurrentCode] = createSignal(initialCode);
  const [result, setResult] = createSignal<CompileResult>({
    component: null,
    error: null,
  });
  const [compiling, setCompiling] = createSignal(true);
  const [copied, setCopied] = createSignal(false);

  // Theme management
  const [previewOverride, setPreviewOverride] = createSignal<'light' | 'dark' | null>(
    null,
  );
  const [globalIsDark, setGlobalIsDark] = createSignal(false);

  onMount(() => {
    const updateGlobalTheme = () => {
      setGlobalIsDark(document.documentElement.classList.contains('dark'));
    };
    updateGlobalTheme();
    const observer = new MutationObserver(updateGlobalTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    onCleanup(() => observer.disconnect());
  });

  const isPreviewDark = () => {
    if (previewOverride() !== null) return previewOverride() === 'dark';
    return globalIsDark();
  };

  const togglePreview = () => {
    setPreviewOverride(isPreviewDark() ? 'light' : 'dark');
  };

  // Initialize CodeMirror
  onMount(() => {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setCurrentCode(update.state.doc.toString());
      }
    });

    const editorTheme = EditorView.theme({
      '&': { fontSize: '12px', height: '100%' },
      '.cm-scroller': { overflow: 'auto' },
      '.cm-content': {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      },
      '.cm-gutters': { fontSize: '12px' },
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        javascript({ jsx: true, typescript: true }),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        oneDark,
        editorTheme,
        keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap]),
        updateListener,
        EditorView.lineWrapping,
      ],
    });

    editorView = new EditorView({
      state,
      parent: editorContainerRef,
    });

    void formatCode(initialCode).then((formatted) => {
      if (formatted !== initialCode && editorView) {
        editorView.dispatch({
          changes: { from: 0, to: editorView.state.doc.length, insert: formatted },
        });
      }
    });

    onCleanup(() => editorView?.destroy());
  });

  // Compile on code changes (debounced), and immediately on first run
  let isFirstRun = true;
  createEffect(
    on(currentCode, (code) => {
      setCompiling(true);
      const delay = isFirstRun ? 0 : 300;
      isFirstRun = false;
      const timer = setTimeout(() => {
        void compileAndExecute(code).then((r) => {
          setResult(r);
          setCompiling(false);
        });
      }, delay);
      onCleanup(() => clearTimeout(timer));
    }),
  );

  const handleReset = () => {
    if (editorView) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: initialCode,
        },
      });
    }
    setCurrentCode(initialCode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = currentCode();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div class="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      {/* Toolbar */}
      <div class="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Playground
        </h3>
        <div class="flex items-center gap-2">
          <Show when={previewOverride() !== null}>
            <button
              type="button"
              onClick={() => setPreviewOverride(null)}
              class="cursor-pointer rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              Reset theme
            </button>
          </Show>
          <button
            type="button"
            onClick={togglePreview}
            class="flex cursor-pointer items-center rounded-md border border-neutral-200 p-1.5 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
            aria-label={
              isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'
            }
            title={isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'}
          >
            <Show when={isPreviewDark()} fallback={<Moon01Icon class="size-3.5" />}>
              <SunIcon class="size-3.5" />
            </Show>
          </button>
          <button
            type="button"
            onClick={handleReset}
            class="flex cursor-pointer items-center rounded-md border border-neutral-200 p-1.5 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
            aria-label="Reset code"
            title="Reset to initial code"
          >
            <RefreshCw01Icon class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => void handleCopy()}
            class="flex cursor-pointer items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
            aria-label={copied() ? 'Copied!' : 'Copy code'}
          >
            <Show when={copied()} fallback={<Copy01Icon class="size-3.5" />}>
              <CheckIcon class="size-3.5 text-green-600" />
            </Show>
            {copied() ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div class="grid grid-cols-1">
        {/* Code Editor */}
        <div class="relative max-h-[500px] min-h-[300px] border-b border-neutral-200 dark:border-neutral-800">
          <div ref={editorContainerRef} class="absolute inset-0 overflow-auto" />
        </div>

        {/* Live Preview */}
        <div class="h-fit">
          <div class={`h-full ${isPreviewDark() ? 'dark' : 'light'}`}>
            <div class="h-full bg-white p-6 dark:bg-neutral-950">
              <Show
                when={!compiling()}
                fallback={
                  <div class="flex h-full items-center justify-center text-sm text-neutral-400">
                    Compiling...
                  </div>
                }
              >
                <Show
                  when={!result().error}
                  fallback={
                    <div class="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                      <p class="text-xs font-medium text-red-800 dark:text-red-300">
                        Error
                      </p>
                      <pre class="mt-1 overflow-auto text-xs whitespace-pre-wrap text-red-600 dark:text-red-400">
                        {result().error}
                      </pre>
                    </div>
                  }
                >
                  <Show when={result().component}>
                    {(comp) => (
                      <PlaygroundErrorBoundary>
                        <Dynamic component={comp()} />
                      </PlaygroundErrorBoundary>
                    )}
                  </Show>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaygroundErrorBoundary(props: { children: JSX.Element }): JSX.Element {
  return (
    <SolidErrorBoundary
      fallback={(err) => (
        <div class="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
          <p class="text-xs font-medium text-red-800 dark:text-red-300">Runtime Error</p>
          <pre class="mt-1 overflow-auto text-xs whitespace-pre-wrap text-red-600 dark:text-red-400">
            {err instanceof Error ? err.message : String(err)}
          </pre>
        </div>
      )}
    >
      {props.children}
    </SolidErrorBoundary>
  );
}
