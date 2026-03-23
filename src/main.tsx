import ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { ToastContainer } from '@components/common/ToastContainer';
import { useThemeStore } from '@store/theme.store';
import App from './App';

Amplify.configure(outputs);

const currentTheme = useThemeStore.getState().theme;
document.documentElement.setAttribute('data-theme', currentTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Authenticator>
      <App />
    </Authenticator>
    <ToastContainer />
  </ErrorBoundary>
);
