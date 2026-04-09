import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './assets/Frontend/Homepage'
import LandingPage from './assets/Frontend/LandingPage'
import AboutUs from './assets/Frontend/AboutUs'
import Blog from './assets/Frontend/Blog'
import BlogDetails from './assets/Frontend/BlogDetails'
import Contact from './assets/Frontend/Contact'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Homepage />} />
        <Route path='/landingpage' element={<LandingPage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<Contact />} />
           <Route path='/blog' element={<Blog />} />
        <Route path="/blog-details" element={<BlogDetails />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App