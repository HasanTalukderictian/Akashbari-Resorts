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
import Investment from './Backend/Investment'
import InvestmentBenefit from './Backend/InvestmentBenefit'
import Events from './Backend/Events'
import AllEvents from './assets/Frontend/AllEvents'
import EventsDetails from './assets/Frontend/EventsDetails'
import LuxurySection from './Backend/LuxurySection'
import Testominal from './Backend/Testominal'
import HappyClientsection from './Backend/HappyClientsection'
import GallerySection from './Backend/GallerySection'
import BlogSection from './Backend/BlogSection'
import Affliates from './assets/Frontend/Affliates'
import NoticeSection from './Backend/NoticeSection'
import PrivateRoute from './assets/Frontend/PrivateRoute'
import NotFound from './assets/Frontend/Common/NotFound'
import Packagestatistics from './Backend/Packagestatistics'
import Affilitaes from './Backend/Affilitaes'
import Club from './assets/Frontend/Club'
import Teamate from './Backend/Teamate'
import Partner from './assets/Frontend/Partner'
import OngoingView from './assets/Frontend/OngoingView'
import AdminSister from './Backend/AdminSister'
import Query from './Backend/Query'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ফ্রন্টএন্ড রুটসমূহ - পাবলিক */}
        <Route path='/home' element={<Homepage />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/sister' element={<Affliates />} />
        <Route path='/partner' element={<Partner />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/club' element={<Club />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/package-details/:id" element={<PackageDetails />} />
        <Route path="/all-events" element={<AllEvents />} />
        <Route path="/event/:id" element={<EventsDetails />} />
        <Route path="*" element={<NotFound />} />

        {/* লগইন রুট - পাবলিক */}
        <Route path="/login" element={<Login />} />

        {/* অ্যাডমিন রুটসমূহ - প্রাইভেট (লগইন প্রয়োজন) */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashbord />
          </PrivateRoute>
        } />

        <Route path="/users" element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        } />

        <Route path="/content" element={
          <PrivateRoute>
            <Content />
          </PrivateRoute>
        } />

        <Route path="/welcome" element={
          <PrivateRoute>
            <Welcome />
          </PrivateRoute>
        } />

        <Route path="/video" element={
          <PrivateRoute>
            <VideoSection />
          </PrivateRoute>
        } />

        <Route path="/owner-section" element={
          <PrivateRoute>
            <OwnerSection />
          </PrivateRoute>
        } />

        <Route path="/owner-benefit" element={
          <PrivateRoute>
            <OwnerBenefit />
          </PrivateRoute>
        } />

        <Route path="/admin-investment" element={
          <PrivateRoute>
            <Investment />
          </PrivateRoute>
        } />

        <Route path="/admin-investmentbenefit" element={
          <PrivateRoute>
            <InvestmentBenefit />
          </PrivateRoute>
        } />

        <Route path="/admin-events" element={
          <PrivateRoute>
            <Events />
          </PrivateRoute>
        } />

        <Route path="/admin-luxury" element={
          <PrivateRoute>
            <LuxurySection />
          </PrivateRoute>
        } />

        <Route path="/admin-testo" element={
          <PrivateRoute>
            <Testominal />
          </PrivateRoute>
        } />

        <Route path="/admin-gallery" element={
          <PrivateRoute>
            <GallerySection />
          </PrivateRoute>
        } />


        <Route path="/admin-stat" element={
          <PrivateRoute>
            <Packagestatistics />
          </PrivateRoute>
        } />

        <Route path="/admin-affilites" element={
          <PrivateRoute>
            <Affilitaes />
          </PrivateRoute>
        } />

         <Route path="/admin-sister" element={
          <PrivateRoute>
            <AdminSister/>
          </PrivateRoute>
        } />

        <Route path="/admin-client" element={
          <PrivateRoute>
            <HappyClientsection />
          </PrivateRoute>
        } />

           <Route path="/admin-query" element={
          <PrivateRoute>
            <Query/>
          </PrivateRoute>
        } />

        <Route path="/admin-notice" element={
          <PrivateRoute>
            <NoticeSection />
          </PrivateRoute>
        } />

        <Route path="/admin-team" element={
          <PrivateRoute>
            <Teamate />
          </PrivateRoute>
        } />

        <Route path="/admin-blog" element={
          <PrivateRoute>
            <BlogSection />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App