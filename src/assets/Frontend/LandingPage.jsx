import { useRef, useState, useEffect } from "react";
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
import Sister from "./Sister";

const LandingPage = () => {
  const welcomeRef = useRef(null);
  const ownerRef = useRef(null);
  const investRef = useRef(null);
  
  const [showOnlyBenefits, setShowOnlyBenefits] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);

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

  // Packages বাটনে ক্লিক করলে Investment সেকশনে স্ক্রোল করবে (Full View)
  const scrollToInvestment = () => {
    setShowOnlyBenefits(false); // Full view দেখাবে
    setIsManualScroll(true);
    investRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  // More Button - শুধু Benefits দেখাবে
  const scrollToBenefitsOnly = () => {
    setShowOnlyBenefits(true);
    setIsManualScroll(true);
    // Benefits সেকশনে স্ক্রোল
    setTimeout(() => {
      const benefitsElement = document.getElementById('investment-benefits');
      if (benefitsElement) {
        benefitsElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };

  // স্ক্রল ইভেন্ট ডিটেক্ট করা
  useEffect(() => {
    const handleScroll = () => {
      if (!isManualScroll) return;
      
      const investSection = document.getElementById('invest-section');
      if (investSection) {
        const rect = investSection.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
        
        // যদি Investment Section ভিউতে আসে এবং manually scroll করা হয়
        if (isVisible && showOnlyBenefits) {
          // 1 সেকেন্ড পর পুরো ভিউ দেখাবে
          setTimeout(() => {
            setShowOnlyBenefits(false);
            setIsManualScroll(false);
          }, 1000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isManualScroll, showOnlyBenefits]);

  return (
    <>
      <Header scrollToOwner={scrollToOwner} />

      <Banner 
        onDiscoverClick={scrollToWelcome} 
        onPackagesClick={scrollToInvestment} 
      />
      
      <Notice/>

      <div ref={welcomeRef}>
        <Welcome scrollToInvestment={scrollToBenefitsOnly} />
      </div>

        <div ref={investRef} id="invest-section">
        <Investment showOnlyBenefits={showOnlyBenefits} />
      </div>
        <Packagegrap />
      <Video />

      <div ref={ownerRef} id="owner-section">
        <Owner />
      </div>

      <HappyClient />

    

      <Facility />
      
      <ProjectView/>
       
      <OngoingView/>
      <Sister/>
      
      <Testominal />

      <Footer />
    </>
  );
};

export default LandingPage;