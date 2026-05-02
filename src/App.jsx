import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './assets/Frontend/Homepage'
import LandingPage from './assets/Frontend/LandingPage'
import AboutUs from './assets/Frontend/AboutUs'
import Blog from './assets/Frontend/Blog'
import BlogDetails from './assets/Frontend/BlogDetails'
import Contact from './assets/Frontend/Contact'
import Gallery from './assets/Frontend/Gallery'
import Dashbord from './Backend/Dashbord'
import Login from './Backend/Login'
import PackageDetails from './assets/Frontend/PackageDetails'
import Users from './Backend/Users'
import Content from './Backend/Content'
import Welcome from './Backend/Welcome'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import VideoSection from './Backend/VideoSection'
import OwnerSection from './Backend/Ownersection'
import OwnerBenefit from './Backend/OwnerBenefit'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/home' element={<Homepage />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/blog' element={<Blog />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/package-details/:id" element={<PackageDetails />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/content" element={<Content />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/video" element={<VideoSection />} />
        <Route path="/owner-section" element={<OwnerSection />} />
        <Route path="/owner-benefit" element={<OwnerBenefit />} />



      </Routes>
    </BrowserRouter>
  )
}

export default App