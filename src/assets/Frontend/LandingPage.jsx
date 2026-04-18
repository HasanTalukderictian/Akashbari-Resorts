
import Banner from './Banner'
import Footer from './Common/Footer'
import Header from './Common/Header'
import Welcome from './Common/Welcome'
import Event from './Event'
import Facility from './Facility'
import Investment from './Investment'
import Room from './Room'
import Testominal from './Testominal'
import Video from './Video'

const LandingPage = () => {
  return (
    <>
      <Header/>
      <Banner/>
      <Welcome/>
      <Video/>
      <Room/>
      <Facility/>
      <Event/>
      <Investment/>
      <Testominal/>
      <Footer/>
    </>
  )
}

export default LandingPage
