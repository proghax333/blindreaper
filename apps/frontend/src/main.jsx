import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { Provider as ReduxProvider } from "react-redux";
import { store } from '~/app/store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '~/modules/auth/auth.context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
    mutations: {
      networkMode: "always",
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </AuthProvider>
    </QueryClientProvider>
  // </React.StrictMode>
);
