import { JSX, Show, createSignal, mergeProps } from 'solid-js';

import { HandIcon, Upload01Icon } from '../icons';

// drag drop file component
export const UploadFile = (_props: {
  onChange: (file: File | FileList) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxLength?: number;
}) => {
  // drag state
  //   const toast = useToast();
  const props = mergeProps(
    { multiple: false, accept: 'image/*, application/pdf' },
    _props,
  );
  const [dragActive, setDragActive] = createSignal(false);
  // ref
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);

  // handle drag events
  const handleDrag = function (e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e?.dataTransfer?.files && e.dataTransfer.files[0]) {
      lengthAndSizeCheck(e.dataTransfer.files, props.onChange);
    }
  };

  const lengthAndSizeCheck = (files: FileList, callback: (files: FileList) => void) => {
    const fileArray = [...files];
    let out = false;
    if (props.maxLength && fileArray.length > props.maxLength) {
      out = true;
      //   toast.error(
      //     intl.formatMessage(
      //       {
      //         defaultMessage: `Le nombre maximal de fichiers accepté est de {maxLength}`,
      //         id: 'TA1tzL',
      //       },
      //       { maxLength: props.maxLength },
      //     ),
      //   );
    }
    if (props.maxSize) {
      fileArray.forEach((file) => {
        if (file.size > Number(props.maxSize)) {
          out = true;
          //   toast.error(
          //     intl.formatMessage(
          //       {
          //         defaultMessage: `{file}: La taille maximale d'un fichier doit être de {size} KB`,
          //         id: 'OlJmL+',
          //       },
          //       {
          //         file: file.name,
          //         size: Number(props.maxSize) / 1024,
          //       },
          //     ),
          //   );
        }
      });
    }
    if (out) return;
    callback(files);
  };

  // triggers when file is selected with click
  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = function (e) {
    if (e?.target?.files && e?.currentTarget?.files?.[0]) {
      lengthAndSizeCheck(e.target.files, props.onChange);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = (e: Event) => {
    e.preventDefault();
    inputRef()?.click();
  };

  return (
    <div
      class="relative w-fit rounded border border-dashed border-gray-200 px-10 py-6 text-center"
      onDragEnter={handleDrag}
    >
      <div class="flex items-center justify-center">
        <div class="flex cursor-pointer items-center gap-1.5">
          <HandIcon />
          Drag and drop
        </div>
        <div class="mx-5 h-5 w-px bg-gray-200" />
        <div class="flex cursor-pointer items-center gap-1.5" onClick={onButtonClick}>
          <Upload01Icon />
          Choose File
        </div>
      </div>
      <div class="mt-5 flex items-center justify-center text-xs font-normal text-gray-500">
        <span>Supported: JPEG, PNG, PDF</span>
        <span class="ml-0.5">(max: 10MB)</span>
      </div>
      <input
        ref={setInputRef}
        type="file"
        class="hidden"
        multiple={props.multiple}
        onChange={handleChange}
        accept={props.accept}
      />
      <Show when={dragActive()}>
        <div
          class="absolute inset-0 h-full w-full bg-gray-400/10"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      </Show>
    </div>
  );
};
