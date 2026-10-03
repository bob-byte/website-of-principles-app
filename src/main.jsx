import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/App.css'
import App from './App.jsx'
import { LocaleProvider } from './locale/LocaleProvider.jsx'
import { initSiteLogging } from './utils/siteLog.js'

initSiteLogging()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
)
