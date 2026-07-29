import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppProvider } from './context/AppContext'
import './index.css'
import { ThemedApp } from './ThemedApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <ThemedApp>
        <App />
      </ThemedApp>
    </AppProvider>
  </StrictMode>,
)
