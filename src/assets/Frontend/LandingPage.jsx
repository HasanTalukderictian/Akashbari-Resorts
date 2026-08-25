// import { useRef, useState, useEffect } from "react";
// import Banner from './Banner';
// import Footer from './Common/Footer';
// import Header from './Common/Header';
// import Welcome from './Common/Welcome';
// import Event from './Event';
// import Facility from './Facility';
// import Investment from './Investment';
// import Testominal from './Testominal';
// import Video from './Video';
// import Owner from "./Owner";
// import Packagegrap from "./Packagegrap";
// import Luxury from "./Luxury";
// import HappyClient from "./HappyClient";
// import Notice from "./Notice";
// import Member from "./Member";
// import ProjectView from "./ProjectView";
// import OngoingView from "./OngoingView";
// import Sister from "./Sister";

// const LandingPage = () => {
//   const welcomeRef = useRef(null);
//   const ownerRef = useRef(null);
//   const investRef = useRef(null);
  
//   const [showOnlyBenefits, setShowOnlyBenefits] = useState(false);
//   const [isManualScroll, setIsManualScroll] = useState(false);

//   const scrollToWelcome = () => {
//     welcomeRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "start"
//     });
//   };

//   const scrollToOwner = () => {
//     ownerRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "start"
//     });
//   };

//   // Packages বাটনে ক্লিক করলে Investment সেকশনে স্ক্রোল করবে (Full View)
//   const scrollToInvestment = () => {
//     setShowOnlyBenefits(false); // Full view দেখাবে
//     setIsManualScroll(true);
//     investRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "start"
//     });
//   };

//   // More Button - শুধু Benefits দেখাবে
//   const scrollToBenefitsOnly = () => {
//     setShowOnlyBenefits(true);
//     setIsManualScroll(true);
//     // Benefits সেকশনে স্ক্রোল
//     setTimeout(() => {
//       const benefitsElement = document.getElementById('investment-benefits');
//       if (benefitsElement) {
//         benefitsElement.scrollIntoView({
//           behavior: "smooth",
//           block: "start"
//         });
//       }
//     }, 100);
//   };

//   // স্ক্রল ইভেন্ট ডিটেক্ট করা
//   useEffect(() => {
//     const handleScroll = () => {
//       if (!isManualScroll) return;
      
//       const investSection = document.getElementById('invest-section');
//       if (investSection) {
//         const rect = investSection.getBoundingClientRect();
//         const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
        
//         // যদি Investment Section ভিউতে আসে এবং manually scroll করা হয়
//         if (isVisible && showOnlyBenefits) {
//           // 1 সেকেন্ড পর পুরো ভিউ দেখাবে
//           setTimeout(() => {
//             setShowOnlyBenefits(false);
//             setIsManualScroll(false);
//           }, 1000);
//         }
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [isManualScroll, showOnlyBenefits]);

//   return (
//     <>
//       <Header scrollToOwner={scrollToOwner} />

//       <Banner 
//         onDiscoverClick={scrollToWelcome} 
//         onPackagesClick={scrollToInvestment} 
//       />
      
//       <Notice/>

//       <div ref={welcomeRef}>
//         <Welcome scrollToInvestment={scrollToBenefitsOnly} />
//       </div>

//         <div ref={investRef} id="invest-section">
//         <Investment showOnlyBenefits={showOnlyBenefits} />
//       </div>
//         <Packagegrap />
//       <Video />

//       <div ref={ownerRef} id="owner-section">
//         <Owner />
//       </div>

//       <HappyClient />

    

//       <Facility />
      
//       <ProjectView/>
       
//       <OngoingView/>
//       <Sister/>
      
//       <Testominal />

//       <Footer />
//     </>
//   );
// };

// export default LandingPage;


import { useRef, useState, useEffect } from "react";
import axios from "axios";

import Banner from "./Banner";
import Footer from "./Common/Footer";
import Header from "./Common/Header";
import Welcome from "./Common/Welcome";
import Event from "./Event";
import Facility from "./Facility";
import Investment from "./Investment";
import Testominal from "./Testominal";
import Video from "./Video";
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
    // ============================================
    // Refs
    // ============================================

    const welcomeRef = useRef(null);
    const ownerRef = useRef(null);
    const investRef = useRef(null);

    // ============================================
    // UI States
    // ============================================

    const [showOnlyBenefits, setShowOnlyBenefits] = useState(false);
    const [isManualScroll, setIsManualScroll] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ============================================
    // Landing Page Data
    // ============================================

    const [landingData, setLandingData] = useState({
        welcome: [],
        investment: [],
        facility: [],
        projects: [],
        ongoing: [],
        sister: [],
        testimonials: [],
        events: [],
        owner: [],
        happyClients: [],
        notices: [],
        members: [],
        videos: [],
        luxury: [],
        packages: [],
    });

    // ============================================
    // API URL
    // ============================================

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    // ============================================
    // Fetch All Landing Page Data
    // ============================================

 useEffect(() => {
    let isMounted = true;

    const fetchLandingPageData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${API_URL}/landing-page`,
                {
                    timeout: 15000,
                }
            );

            // DEBUG
            console.log("Landing API Response:", response);
            console.log("Landing API Data:", response.data);

            if (isMounted) {
                setLandingData(response.data?.data || {});
            }

        } catch (err) {

            console.error(
                "Landing Page API Error:",
                err
            );

            console.error(
                "Response:",
                err?.response
            );

            console.error(
                "Response Data:",
                err?.response?.data
            );

            if (isMounted) {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong"
                );
            }

        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    fetchLandingPageData();

    return () => {
        isMounted = false;
    };
}, [API_URL]);

    // ============================================
    // Scroll To Welcome
    // ============================================

    const scrollToWelcome = () => {
        welcomeRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // ============================================
    // Scroll To Owner
    // ============================================

    const scrollToOwner = () => {
        ownerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // ============================================
    // Scroll To Investment
    // ============================================

    const scrollToInvestment = () => {
        setShowOnlyBenefits(false);
        setIsManualScroll(true);

        investRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        // Safety reset
        setTimeout(() => {
            setIsManualScroll(false);
        }, 1500);
    };

    // ============================================
    // Scroll To Benefits Only
    // ============================================

    const scrollToBenefitsOnly = () => {
        setShowOnlyBenefits(true);
        setIsManualScroll(true);

        setTimeout(() => {
            const benefitsElement =
                document.getElementById(
                    "investment-benefits"
                );

            if (benefitsElement) {
                benefitsElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100);
    };

    // ============================================
    // Detect Scroll
    // ============================================

    useEffect(() => {
        const handleScroll = () => {
            if (!isManualScroll) return;

            const investSection =
                document.getElementById(
                    "invest-section"
                );

            if (!investSection) return;

            const rect =
                investSection.getBoundingClientRect();

            const isVisible =
                rect.top <= window.innerHeight &&
                rect.bottom >= 0;

            if (isVisible && showOnlyBenefits) {
                setTimeout(() => {
                    setShowOnlyBenefits(false);
                    setIsManualScroll(false);
                }, 1000);
            }
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [
        isManualScroll,
        showOnlyBenefits,
    ]);

    // ============================================
    // Loading Screen
    // ============================================

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="text-center">
                    <div
                        className="spinner-border"
                        role="status"
                    />

                    <p className="mt-3">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // Error Screen
    // ============================================

    if (error) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                }}
            >
                <div className="text-center">
                    <h4>
                        Something went wrong
                    </h4>

                    <p>{error}</p>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ============================================
    // Page
    // ============================================

    return (
        <>
            {/* Header */}
            <Header
                scrollToOwner={scrollToOwner}
            />

            {/* Banner */}
            <Banner
                onDiscoverClick={
                    scrollToWelcome
                }
                onPackagesClick={
                    scrollToInvestment
                }
                data={landingData}
            />

            {/* Notice */}
            <Notice
                data={landingData.notices}
            />

            {/* Welcome */}
            <div ref={welcomeRef}>
                <Welcome
                    data={landingData.welcome}
                    scrollToInvestment={
                        scrollToBenefitsOnly
                    }
                />
            </div>

            {/* Investment */}
            <div
                ref={investRef}
                id="invest-section"
            >
                <Investment
                    data={landingData.investment}
                    showOnlyBenefits={
                        showOnlyBenefits
                    }
                />
            </div>

            {/* Packages */}
            <Packagegrap
                data={landingData.packages}
            />

            {/* Video */}
            <Video
                data={landingData.videos}
            />

            {/* Owner */}
            <div
                ref={ownerRef}
                id="owner-section"
            >
                <Owner
                    data={landingData.owner}
                />
            </div>

            {/* Happy Client */}
            <HappyClient
                data={
                    landingData.happyClients
                }
            />

            {/* Facility */}
            <Facility
                data={landingData.facility}
            />

            {/* Project */}
            <ProjectView
                data={landingData.projects}
            />

            {/* Ongoing */}
            <OngoingView
                data={landingData.ongoing}
            />

            {/* Sister */}
            <Sister
                data={landingData.sister}
            />

            {/* Testimonial */}
            <Testominal
                data={
                    landingData.testimonials
                }
            />

            {/* Event */}
            {/* <Event
                data={landingData.events}
            /> */}

            {/* Luxury */}
            {/* <Luxury
                data={landingData.luxury}
            /> */}

            {/* Member */}
            {/* <Member
                data={landingData.members}
            /> */}

            {/* Footer */}
            <Footer />
        </>
    );
};

export default LandingPage;