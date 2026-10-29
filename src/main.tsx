import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource-variable/instrument-sans'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
