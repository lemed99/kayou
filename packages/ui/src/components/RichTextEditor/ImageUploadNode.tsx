import { Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { Node, mergeAttributes } from '@tiptap/core';

import { UploadFile } from '../UploadFile';

export interface ImageUploadOptions {
  onImageUpload?: (file: File) => Promise<string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      insertImageUpload: () => ReturnType;
    };
  }
}

export const ImageUploadNode = Node.create<ImageUploadOptions>({
  name: 'imageUpload',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      onImageUpload: undefined,
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-image-upload]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-image-upload': '' })];
  },

  addNodeView() {
    return ({ editor, getPos }) => {
      const dom = document.createElement('div');
      dom.className = 'my-4';
      const [error, setError] = createSignal('');

      const handleFileChange = async (fileOrList: File | FileList) => {
        const file = fileOrList instanceof FileList ? fileOrList[0] : fileOrList;
        if (!file || !this.options.onImageUpload) return;

        setError('');
        try {
          const url = await this.options.onImageUpload(file);
          const pos = getPos();
          if (typeof pos === 'number') {
            editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + 1 })
              .setImage({ src: url })
              .run();
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Image upload failed');
        }
      };

      // Render the SolidJS UploadFile component
      const dispose = render(
        () => (
          <div>
            <UploadFile
              onChange={(fileOrList) => {
                void handleFileChange(fileOrList);
              }}
              accept="image/*"
              multiple={false}
              maxLength={1}
              dragDropText="Tap to select an image"
              helperText="Supported formats: PNG, JPG, GIF, SVG, WebP"
              autoUpload={false}
            />
            <Show when={error()}>
              <p class="mt-2 text-sm text-red-600 dark:text-red-400">{error()}</p>
            </Show>
          </div>
        ),
        dom,
      );

      return {
        dom,
        destroy() {
          dispose();
        },
      };
    };
  },

  addCommands() {
    return {
      insertImageUpload:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});
