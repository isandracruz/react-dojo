import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme'
import { EditorThemeProvider } from './hooks/useEditorTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <EditorThemeProvider>
        <App />
      </EditorThemeProvider>
    </ThemeProvider>
  </StrictMode>,
)
