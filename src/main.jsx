import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ১. আগে Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// ২. তারপর নিজের global CSS (website font এখানে) — Bootstrap এর পরে, যাতে এটা জেতে
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)