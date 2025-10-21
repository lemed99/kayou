import { Component, createUniqueId } from 'solid-js';
import { render } from 'solid-js/web';

import { CustomResourceProvider } from '../../src/context/CustomResourceContext';
import { ToastMethodProps, ToastProvider } from '../../src/context/ToastContext';
import App from './app';
import './index.css';

const SuccessToast: Component<ToastMethodProps> = (props) => {
  return (
    <div class="flex h-24 w-lg items-center justify-between rounded bg-green-500 px-4 text-white">
      <span>
        {props.message} {createUniqueId()} {props.paused() ? '⏸' : '▶️'} {props.duration}
      </span>
      <button onClick={() => props.pause()}>⏸</button>
      <button onClick={() => props.play()}>▶️</button>
      <button onClick={() => props.dismiss()}>×</button>
    </div>
  );
};

render(
  () => (
    <CustomResourceProvider
      // pendingRequests={new Map()}
      // refreshData={{ todos: true }}
      baseUrl='https://jsonplaceholder.typicode.com'
    >
      <ToastProvider
        position="top-left"
        duration={30000}
        pauseOnHover={true}
        gutter={16}
        methods={{
          success: SuccessToast,
        }}
      >
        <App />
      </ToastProvider>
    </CustomResourceProvider>
  ),
  document.querySelector('#root')!,
);
