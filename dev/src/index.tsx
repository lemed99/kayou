import { Component, createUniqueId } from 'solid-js';
import { render } from 'solid-js/web';

import { ToastMethodProps, ToastProvider } from '../../src/context/ToastContext';
import { useToast } from '../../src/hooks/useToast';
import App from './app';
import './index.css';

const SuccessToast: Component<ToastMethodProps> = (props) => {
  const toast = useToast();
  return (
    <div class="flex h-24 w-lg items-center justify-between rounded bg-green-500 px-4 text-white">
      <span>
        {props.message} {createUniqueId()}
      </span>
      <button onClick={() => toast.dismiss(props.toastId)}>×</button>
    </div>
  );
};

render(
  () => (
    <ToastProvider
      position="bottom-center"
      duration={30000}
      pauseOnHover={true}
      gutter={16}
      methods={{
        success: SuccessToast,
      }}
    >
      <App />
    </ToastProvider>
  ),
  document.querySelector('#root')!,
);
