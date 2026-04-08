import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './assets/Frontend/Homepage'
import LandingPage from './assets/Frontend/LandingPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
      
       <Route path='/' element={<Homepage />} />
        <Route path='/landingpage' element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App