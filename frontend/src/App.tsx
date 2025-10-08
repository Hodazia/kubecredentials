

import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Issuance from './pages/Issuance'
import { Toaster } from 'sonner'
import Verification from './pages/Verification'

function App() {

  return (
    <>
    <BrowserRouter>
    <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/issuance' element={<Issuance />} />
        <Route path='/verification' element={<Verification />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
