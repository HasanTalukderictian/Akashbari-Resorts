import { useRef } from "react";
import Banner from './Banner';
import Footer from './Common/Footer';
import Header from './Common/Header';
import Welcome from './Common/Welcome';
import Event from './Event';
import Facility from './Facility';
import Investment from './Investment';
import Testominal from './Testominal';
import Video from './Video';
import Owner from "./Owner";
import Packagegrap from "./Packagegrap";
import Luxury from "./Luxury";
import HappyClient from "./HappyClient";
import Notice from "./Notice";
import Member from "./Member";
import ProjectView from "./ProjectView";
import OngoingView from "./OngoingView";

const LandingPage = () => {
  const welcomeRef = useRef(null);
  const ownerRef = useRef(null);
  const investRef = useRef(null);

  const scrollToWelcome = () => {
    welcomeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const scrollToOwner = () => {
    ownerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  // Packages বাটনে ক্লিক করলে Investment সেকশনে স্ক্রোল করবে
  const scrollToInvestment = () => {
    investRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <>
      <Header scrollToOwner={scrollToOwner} />

      {/* onPackagesClick prop যোগ করা হয়েছে */}
      <Banner 
        onDiscoverClick={scrollToWelcome} 
        onPackagesClick={scrollToInvestment} 
      />
      
      <Notice/>

      <div ref={welcomeRef}>
        <Welcome />
      </div>

      <Video />

      <div ref={ownerRef} id="owner-section">
        <Owner />
      </div>

      <HappyClient />

      <div ref={investRef} id="invest-section">
        <Investment />
      </div>

      <Packagegrap />

      {/* <Luxury /> */}

      <Facility />
      
      <ProjectView/>
       
      <OngoingView/>
      
      {/* <Event /> */}
      {/* <Member/> */}

      <Testominal />

      <Footer />
    </>
  );
};

export default LandingPage;