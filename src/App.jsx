import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css'

/* ---------- Frontend (public) ---------- */
import Homepage from './assets/Frontend/Homepage'
import LandingPage from './assets/Frontend/LandingPage'
import AboutUs from './assets/Frontend/AboutUs'
import Blog from './assets/Frontend/Blog'
import BlogDetails from './assets/Frontend/BlogDetails'
import Contact from './assets/Frontend/Contact'
import Gallery from './assets/Frontend/Gallery'
import PackageDetails from './assets/Frontend/PackageDetails'
import AllEvents from './assets/Frontend/AllEvents'
import EventsDetails from './assets/Frontend/EventsDetails'
import Affliates from './assets/Frontend/Affliates'
import Club from './assets/Frontend/Club'
import Partner from './assets/Frontend/Partner'
import OngoingView from './assets/Frontend/OngoingView'
import Career from './assets/Frontend/Career'
import CareerDetails from './assets/Frontend/CareerDetails'
import Register from './assets/Frontend/Register'
import UserLogin from './assets/Frontend/UserLogin'
import WriteBlog from './assets/Frontend/Writeblog'
import InvestmentForm from './assets/Frontend/InvestmentForm'
import NotFound from './assets/Frontend/Common/NotFound'

/* ---------- Backend (admin) ---------- */
import Login from './Backend/Login'

import Dashbord from './Backend/Dashbord'
import Users from './Backend/Users'
import Content from './Backend/Content'
import Welcome from './Backend/Welcome'
import VideoSection from './Backend/VideoSection'
import OwnerSection from './Backend/Ownersection'
import OwnerBenefit from './Backend/OwnerBenefit'
import Investment from './Backend/Investment'
import InvestmentBenefit from './Backend/InvestmentBenefit'
import Events from './Backend/Events'
import LuxurySection from './Backend/LuxurySection'
import Testominal from './Backend/Testominal'
import HappyClientsection from './Backend/HappyClientsection'
import GallerySection from './Backend/GallerySection'
import BlogSection from './Backend/BlogSection'
import NoticeSection from './Backend/NoticeSection'
import Packagestatistics from './Backend/Packagestatistics'
import Affilitaes from './Backend/Affilitaes'
import Teamate from './Backend/Teamate'
import AdminSister from './Backend/AdminSister'
import Query from './Backend/Query'
import Achievement from './Backend/Achievement'
import InvestmentRecord from './Backend/InvestmentRecord'
import ClubSettings from './Backend/ClubSettings'
import Clubgallery from './Backend/Clubgallery'
import ProjectState from './Backend/ProjectState'
import PackageQuery from './Backend/PackageQuery'
import FqaSettings from './Backend/FqaSettings'
import JobSettings from './Backend/JobSettings'
import JobQuery from './Backend/JobQuery'
import InvestQuery from './Backend/InvestQuery'
import AdminRoute from './assets/Frontend/AdminRoute'

/* ---------- Google Analytics (GA4) — একবারই initialize ---------- */
const GA_ID = 'G-FBHHGLQ9KQ'
ReactGA.initialize(GA_ID)

// প্রতিবার page বদলালে pageview পাঠায়
const AnalyticsTracker = () => {
  const location = useLocation()

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
    })
  }, [location.pathname, location.search])

  return null
}

/*
 * Admin route তালিকা
 * module = backend এর User::MODULES key (null = শুধু login লাগবে)
 */
const ADMIN_ROUTES = [
  // সবার জন্য (login থাকলেই)
  { path: '/dashboard', module: null, element: <Dashbord /> },

  // শুধু Super Admin
  { path: '/users', module: 'users', element: <Users /> },

  // Landing page
  { path: '/content', module: 'landing', element: <Content /> },
  { path: '/welcome', module: 'landing', element: <Welcome /> },
  { path: '/video', module: 'landing', element: <VideoSection /> },
  { path: '/owner-section', module: 'landing', element: <OwnerSection /> },
  { path: '/owner-benefit', module: 'landing', element: <OwnerBenefit /> },
  { path: '/admin-investment', module: 'landing', element: <Investment /> },
  { path: '/admin-investmentbenefit', module: 'landing', element: <InvestmentBenefit /> },
  { path: '/admin-luxury', module: 'landing', element: <LuxurySection /> },
  { path: '/admin-testo', module: 'landing', element: <Testominal /> },
  { path: '/admin-client', module: 'landing', element: <HappyClientsection /> },
  { path: '/admin-achievement', module: 'landing', element: <Achievement /> },
  { path: '/admin-investrecord', module: 'landing', element: <InvestmentRecord /> },

  // অন্য section
  { path: '/admin-gallery', module: 'gallery', element: <GallerySection /> },
  { path: '/admin-project-view', module: 'project', element: <ProjectState /> },
  { path: '/package-query', module: 'package_query', element: <PackageQuery /> },
  { path: '/admin-query', module: 'package_query', element: <Query /> },
  { path: '/admin-blog', module: 'blog', element: <BlogSection /> },
  { path: '/admin-notice', module: 'notice', element: <NoticeSection /> },
  { path: '/admin-stat', module: 'packages', element: <Packagestatistics /> },
  { path: '/admin-affilites', module: 'affiliates', element: <Affilitaes /> },
  { path: '/admin-sister', module: 'partners', element: <AdminSister /> },
  { path: '/admin-events', module: 'events', element: <Events /> },
  { path: '/admin-team', module: 'team', element: <Teamate /> },
  { path: '/admin-faq', module: 'faq', element: <FqaSettings /> },
  { path: '/admin-job', module: 'jobs', element: <JobSettings /> },
  { path: '/admin-jobquery', module: 'job_applications', element: <JobQuery /> },
  { path: '/admin-investquery', module: 'investment_query', element: <InvestQuery /> },

  // Club
  { path: '/admin-club', module: 'club', element: <ClubSettings /> },
  { path: '/admin-club-gallery', module: 'club', element: <Clubgallery /> },
]

function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />

      <Routes>
        {/* ---------- Frontend (public) ---------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/investment" element={<LandingPage view="investment" />} />
        <Route path="/benefits" element={<LandingPage view="benefits" />} />

        <Route path="/home" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/career/:id" element={<CareerDetails />} />
        <Route path="/sister" element={<Affliates />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route path="/write-blog" element={<WriteBlog />} />
        <Route path="/invest-form" element={<InvestmentForm />} />
        <Route path="/club" element={<Club />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/ongoing" element={<OngoingView />} />
        <Route path="/package-details/:id" element={<PackageDetails />} />
        <Route path="/all-events" element={<AllEvents />} />
        <Route path="/event/:id" element={<EventsDetails />} />

        {/* ---------- Login / Register ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/visitor-login" element={<UserLogin />} />

        {/* ---------- Admin (role + permission check) ---------- */}
        {ADMIN_ROUTES.map(({ path, module, element }) => (
          <Route
            key={path}
            path={path}
            element={<AdminRoute module={module}>{element}</AdminRoute>}
          />
        ))}

        {/* পুরোনো link → নতুন path */}
        <Route path="/admin-investment-query" element={<Navigate to="/admin-investquery" replace />} />

        {/* ---------- 404 (সবার শেষে) ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App