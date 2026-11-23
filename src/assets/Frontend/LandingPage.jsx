import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Banner from "./Banner";
import Footer from "./Common/Footer";
import Header from "./Common/Header";
import Welcome from "./Common/Welcome";
import Facility from "./Facility";
import Investment from "./Investment";
import Testominal from "./Testominal";
import Video from "./Video";
import Owner from "./Owner";
import Packagegrap from "./Packagegrap";
import Faqpage from "./Faqpage";
import HappyClient from "./HappyClient";
import Notice from "./Notice";
import ProjectView from "./ProjectView";
import OngoingView from "./OngoingView";
import Sister from "./Sister";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const LandingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ---------- Refs (প্রতিটা section এর আলাদা ref) ----------
    const welcomeRef = useRef(null);
    const investRef = useRef(null);
    const packageRef = useRef(null);
    const ownerRef = useRef(null);

    // ---------- UI States ----------
    const [showOnlyBenefits, setShowOnlyBenefits] = useState(false);
    const [isManualScroll, setIsManualScroll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ---------- Landing Page Data ----------
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
        faqpage: [],
    });

    // ---------- Fetch ----------
    const fetchLandingPageData = async (isMounted = () => true) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${API_URL}/landing-page`, { timeout: 15000 });

            if (isMounted()) {
                setLandingData((prev) => ({ ...prev, ...(response.data?.data || {}) }));
            }
        } catch (err) {
            console.error("Landing Page API Error:", err?.response?.data || err);
            if (isMounted()) {
                setError(err?.response?.data?.message || err?.message || "Something went wrong");
            }
        } finally {
            if (isMounted()) setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        fetchLandingPageData(() => mounted);
        return () => { mounted = false; };
    }, []);

    // ---------- Header থেকে আসা scroll request ----------
    // অন্য page থেকে PACKAGES / INVESTMENT চাপলে: data load শেষ হলে সেই section এ যাবে
    useEffect(() => {
        if (loading || error) return;

        const target = location.state?.scrollTo;
        if (!target) return;

        const timer = setTimeout(() => {
            document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
            // state মুছে দাও, যাতে refresh করলে আবার scroll না করে
            navigate(location.pathname, { replace: true, state: null });
        }, 100);

        return () => clearTimeout(timer);
    }, [loading, error, location.state]);

    // ---------- Scroll helpers ----------
    const scrollToWelcome = () => {
        welcomeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const scrollToInvestment = () => {
        setShowOnlyBenefits(false);
        setIsManualScroll(true);
        investRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => setIsManualScroll(false), 1500);
    };

    const scrollToBenefitsOnly = () => {
        setShowOnlyBenefits(true);
        setIsManualScroll(true);
        setTimeout(() => {
            document.getElementById("investment-benefits")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    // ---------- Benefits view reset on scroll ----------
    useEffect(() => {
        const handleScroll = () => {
            if (!isManualScroll) return;

            const investSection = document.getElementById("invest-section");
            if (!investSection) return;

            const rect = investSection.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

            if (isVisible && showOnlyBenefits) {
                setTimeout(() => {
                    setShowOnlyBenefits(false);
                    setIsManualScroll(false);
                }, 1000);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isManualScroll, showOnlyBenefits]);

    // ---------- Loading ----------
    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="text-center">
                    <div className="spinner-border" role="status" style={{ color: "#5e2e10" }} />
                    <p className="mt-3">Loading...</p>
                </div>
            </div>
        );
    }

    // ---------- Error ----------
    if (error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <div className="text-center">
                    <h4>Something went wrong</h4>
                    <p>{error}</p>
                    <button
                        className="btn text-white"
                        style={{ backgroundColor: "#5e2e10", borderColor: "#5e2e10" }}
                        onClick={() => fetchLandingPageData()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ---------- Page ----------
    return (
        <>
            <Header />

            <Banner
                onDiscoverClick={scrollToWelcome}
                onPackagesClick={scrollToInvestment}
                data={landingData}
            />

            <Notice data={landingData.notices} />

            <div ref={welcomeRef}>
                <Welcome data={landingData.welcome} scrollToInvestment={scrollToBenefitsOnly} />
            </div>

            <div ref={investRef} id="invest-section" className="lp-anchor">
                <Investment data={landingData.investment} showOnlyBenefits={showOnlyBenefits} />
            </div>

            {/* Packages — নিজের আলাদা ref */}
            <div ref={packageRef} id="package-section" className="lp-anchor">
                <Packagegrap data={landingData.packages} />
            </div>

            <Video data={landingData.videos} />

            <div ref={ownerRef} id="owner-section" className="lp-anchor">
                <Owner data={landingData.owner} />
            </div>

            <HappyClient data={landingData.happyClients} />
            <Facility data={landingData.facility} />
            <ProjectView data={landingData.projects} />
            <OngoingView data={landingData.ongoing} />
            <Faqpage data={landingData.faqpage} />
            <Sister data={landingData.sister} />
            <Testominal data={landingData.testimonials} />

            <Footer />

            {/* Sticky header এর নিচে section এর শিরোনাম যেন ঢাকা না পড়ে */}
            <style>{`
                .lp-anchor { scroll-margin-top: 90px; }
                @media (max-width: 991px) { .lp-anchor { scroll-margin-top: 70px; } }
            `}</style>
        </>
    );
};

export default LandingPage;