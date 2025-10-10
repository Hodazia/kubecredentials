

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Issuance from './pages/Issuance'
import { Toaster } from 'sonner'
import Verification from './pages/Verification'

function App() {
  return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

          <main>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/issuance' element={<Issuance />} />
              <Route path='/verification' element={<Verification />}/>
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
            }}
          />
        </div>
      </BrowserRouter>
  )
}

export default App
