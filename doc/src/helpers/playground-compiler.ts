/* eslint-disable @typescript-eslint/no-implied-eval */
import type { Component } from 'solid-js';
import * as solidJs from 'solid-js';
import * as solidJsStore from 'solid-js/store';
import * as solidJsWeb from 'solid-js/web';

import * as kayouHooks from '@kayou/hooks';
import * as kayouIcons from '@kayou/icons';
import * as kayouUi from '@kayou/ui';

// Module registry — provides sync require() for compiled playground code
const moduleMap: Record<string, unknown> = {
  'solid-js': solidJs,
  'solid-js/web': solidJsWeb,
  'solid-js/store': solidJsStore,
  '@kayou/ui': kayouUi,
  '@kayou/icons': kayouIcons,
  '@kayou/hooks': kayouHooks,
};

function playgroundRequire(name: string): unknown {
  const mod = moduleMap[name];
  if (!mod) throw new Error(`Module "${name}" is not available in the playground`);
  return mod;
}

// Lazy-loaded Babel instance
let babelPromise: Promise<typeof import('@babel/standalone')> | null = null;

async function getBabel(): Promise<typeof import('@babel/standalone')> {
  if (!babelPromise) {
    babelPromise = (async () => {
      const babel = await import('@babel/standalone');
      const solidPreset = (await import('babel-preset-solid')).default;
      babel.registerPreset('solid', solidPreset);
      return babel;
    })();
  }
  return babelPromise;
}

export interface CompileResult {
  component: Component | null;
  error: string | null;
}

export async function compileAndExecute(code: string): Promise<CompileResult> {
  try {
    const babel = await getBabel();

    let compiledCode: string;
    try {
      const result = babel.transform(code, {
        presets: [
          ['solid', { generate: 'dom' }],
          ['typescript', { isTSX: true, allExtensions: true }],
        ],
        plugins: ['transform-modules-commonjs'],
        filename: 'playground.tsx',
      });
      if (!result.code) {
        return { component: null, error: 'Compilation produced no output' };
      }
      compiledCode = result.code;
    } catch (compileErr) {
      console.error('[Playground] Babel transform failed:', compileErr);
      throw compileErr;
    }

    const exports: Record<string, unknown> = {};
    try {
      const fn = new Function('require', 'exports', compiledCode) as (
        req: typeof playgroundRequire,
        exp: Record<string, unknown>,
      ) => void;
      fn(playgroundRequire, exports);
    } catch (execErr) {
      console.error('[Playground] Execution failed. Compiled code:', compiledCode);
      throw execErr;
    }

    const component = exports.default as Component | undefined;
    if (!component) {
      return {
        component: null,
        error: 'No default export found. Export a default function component.',
      };
    }

    return { component, error: null };
  } catch (e) {
    if (e instanceof Error) {
      console.error('[Playground compile error]', e.message, '\n', e.stack);
    }
    const message = e instanceof Error ? e.message : String(e);
    return { component: null, error: message };
  }
}
