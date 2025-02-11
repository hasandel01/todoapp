import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AddTask from './forms/AddTask.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AddTask />
  </StrictMode>,
)
