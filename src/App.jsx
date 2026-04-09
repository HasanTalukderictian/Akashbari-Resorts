import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './assets/Frontend/Homepage'
import LandingPage from './assets/Frontend/LandingPage'
import AboutUs from './assets/Frontend/AboutUs'
import Blog from './assets/Frontend/Blog'


function App() {
  return (
    <BrowserRouter>
      <Routes>
      
       <Route path='/' element={<Homepage />} />
        <Route path='/landingpage' element={<LandingPage />} />
             <Route path='/about' element={<AboutUs />} />
              <Route path='/blog' element={<Blog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App