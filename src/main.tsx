import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import './index.css'
import App from './App.tsx'

// Windows no incluye glyphs de banderas: este polyfill inyecta la font
// "Twemoji Country Flags" para que 🇦🇷, 🇧🇷, etc. se vean en desktop también.
polyfillCountryFlagEmojis()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
