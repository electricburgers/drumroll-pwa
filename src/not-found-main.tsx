import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemedNotFound } from './ThemedNotFound'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemedNotFound />
  </StrictMode>,
)
