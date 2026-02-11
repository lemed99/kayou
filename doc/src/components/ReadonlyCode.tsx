import { type JSX, onCleanup, onMount } from 'solid-js';

import { javascript } from '@codemirror/lang-javascript';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { Decoration, EditorView } from '@codemirror/view';

import { formatCode } from '../helpers/format-code';

const readonlyTheme = EditorView.theme({
  '&': { fontSize: '12px' },
  '.cm-content': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    padding: '12px 0',
  },
  '.cm-gutters': { display: 'none' },
  '.cm-activeLine': { backgroundColor: 'transparent' },
  '.cm-line': { padding: '0 16px' },
});

const baseExtensions = [
  EditorState.readOnly.of(true),
  EditorView.editable.of(false),
  javascript({ jsx: true, typescript: true }),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  oneDark,
  readonlyTheme,
];

/**
 * Wraps bare top-level JSX in `void ...;` so CodeMirror's JS parser
 * can tokenize JSX tags correctly. Returns character ranges to hide
 * via Decoration.replace so the user sees the original code.
 */
function prepareForParser(code: string): { text: string; hideRanges: Array<[number, number]> } {
  const lines = code.split('\n');
  const hideRanges: Array<[number, number]> = [];

  let result = '';
  let offset = 0;
  let inJsxBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inJsxBlock) {
      if (/^<[A-Za-z]/.test(line)) {
        const prefix = 'void ';
        result += prefix;
        hideRanges.push([offset, offset + prefix.length]);
        offset += prefix.length;

        result += line;
        offset += line.length;

        if (/\/>$/.test(line) || /<\/[A-Za-z][A-Za-z0-9.]*>$/.test(line)) {
          const suffix = ';';
          result += suffix;
          hideRanges.push([offset, offset + suffix.length]);
          offset += suffix.length;
        } else {
          inJsxBlock = true;
        }
      } else {
        result += line;
        offset += line.length;
      }
    } else {
      result += line;
      offset += line.length;

      if (/^<\/[A-Za-z]/.test(line) || /^\/>/.test(line)) {
        const suffix = ';';
        result += suffix;
        hideRanges.push([offset, offset + suffix.length]);
        offset += suffix.length;
        inJsxBlock = false;
      }
    }

    if (i < lines.length - 1) {
      result += '\n';
      offset += 1;
    }
  }

  return { text: result, hideRanges };
}

interface ReadonlyCodeProps {
  code: string;
}

export default function ReadonlyCode(props: ReadonlyCodeProps): JSX.Element {
  let containerRef!: HTMLDivElement;

  onMount(() => {
    const state = EditorState.create({
      doc: props.code,
      extensions: baseExtensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef,
    });

    void formatCode(props.code).then((formatted) => {
      const { text, hideRanges } = prepareForParser(formatted);

      const extensions = [...baseExtensions];
      if (hideRanges.length > 0) {
        const decos = hideRanges.map(([from, to]) =>
          Decoration.replace({}).range(from, to),
        );
        extensions.push(EditorView.decorations.of(Decoration.set(decos)));
      }

      view.setState(EditorState.create({ doc: text, extensions }));
    });

    onCleanup(() => view.destroy());
  });

  return <div ref={containerRef} />;
}
