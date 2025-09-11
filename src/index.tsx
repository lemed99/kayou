/* @refresh reload */
import { render } from 'solid-js/web';

import { Router } from '@solidjs/router';
import routes from '~solid-pages';

import App from './app';
import './index.css';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => <Router root={(props) => <App>{props.children}</App>}>{routes}</Router>,
  root as HTMLElement,
);
