import { useRef } from "react";
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
import Owner from "./Owner";
import Packagegrap from "./Packagegrap";
import Luxury from "./Luxury";
import HappyClient from "./HappyClient";

const LandingPage = () => {

  const welcomeRef = useRef(null);

  const scrollToWelcome = () => {
    welcomeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <Banner onDiscoverClick={scrollToWelcome} />

      <div ref={welcomeRef}>
        <Welcome />
      </div>

      <Video />
      <Owner/>
         <HappyClient/>
      <Investment />
   
      <Packagegrap/>
      <Luxury/>
      {/* <Room /> */}
      <Facility />
      <Event />

      <Testominal />
      <Footer />
    </>
  )
}

export default LandingPage