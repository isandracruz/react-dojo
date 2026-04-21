import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme'
import { EditorThemeProvider } from './hooks/useEditorTheme'
import { ProgressProvider } from './hooks/useProgress'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <EditorThemeProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </EditorThemeProvider>
    </ThemeProvider>
  </StrictMode>,
)
