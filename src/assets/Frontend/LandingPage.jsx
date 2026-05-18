import { useRef } from "react";

import Banner from './Banner'
import Footer from './Common/Footer'
import Header from './Common/Header'
import Welcome from './Common/Welcome'
import Event from './Event'
import Facility from './Facility'
import Investment from './Investment'
import Testominal from './Testominal'
import Video from './Video'
import Owner from "./Owner";
import Packagegrap from "./Packagegrap";
import Luxury from "./Luxury";
import HappyClient from "./HappyClient";
import Notice from "./Notice";
import Member from "./Member";
import ProjectView from "./ProjectView";

const LandingPage = () => {

  const welcomeRef = useRef(null);
  const ownerRef = useRef(null);

  const scrollToWelcome = () => {
    welcomeRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const scrollToOwner = () => {
    ownerRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <>
      <Header scrollToOwner={scrollToOwner} />

      <Banner onDiscoverClick={scrollToWelcome} />
      <Notice/>

      <div ref={welcomeRef}>
        <Welcome />
      </div>

      <Video />

      <div ref={ownerRef} id="owner-section">
        <Owner />
      </div>

      <HappyClient />

      <Investment />

      <Packagegrap />

      <Luxury />

      <Facility />
      
      <ProjectView/>

      <Event />

      {/* <Member/> */}

      <Testominal />

      <Footer />
    </>
  )
}

export default LandingPage;