import { Component } from 'solid-js';
import { render } from 'solid-js/web';
import { ToastMethodProps, ToastProvider } from '../../src/hooks/useToast';
import App from './app';
import './index.css';

const SuccessToast: Component<ToastMethodProps> = (props) => {
  // const toast = useToast();
  return (
    <div class="toast toast-success">
      <span>{props.message}</span>
      {/* <button onClick={() => toast.dismiss(props.toastId)}>×</button> */}
    </div>
  );
};

render(() => <ToastProvider
  position="bottom-right"
  duration={3000}
  pauseOnHover={true}
  gutter={12}
  methods={{
    success: SuccessToast,
  }}
        ><App /></ToastProvider>, document.querySelector('#root')!);
