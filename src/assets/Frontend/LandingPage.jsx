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

/*
 * কোন page এ কোন section দেখাবে (ক্রম অনুযায়ী)
 * নতুন section যোগ / বাদ দিতে শুধু এই তালিকা বদলান
 */
const PAGE_SECTIONS = {
    investment: ["invest", "package", "owner"],
    benefits: ["owner", "benefitsList",  "facility"],
};

/**
 * view = "home"       → পুরো Home page
 * view = "investment" → Investment + Packages + Owner (Header এর INVESTMENT)
 * view = "benefits"   → Welcome + Facility (Header এর BENEFITS)
 */
const LandingPage = ({ view = "home", investmentOnly = false }) => {
    // পুরোনো route <LandingPage investmentOnly /> ও কাজ করবে
    const pageView = investmentOnly ? "investment" : view;
    const isSubPage = pageView !== "home";

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

    // Investment / Benefits page এ ঢুকলে উপর থেকে শুরু
    useEffect(() => {
        if (isSubPage && !location.state?.scrollTo) {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [isSubPage, location.pathname]);

    // ---------- অন্য page থেকে আসা scroll request ----------
    // data load শেষ হলে সেই section এ যাবে
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
        const hasInvestSection = !!document.getElementById("invest-section");
        const benefitsEl = document.getElementById("investment-benefits");

        // Benefits page: Investment section নেই, কিন্তু benefits আছে → এখানেই scroll
        if (!hasInvestSection) {
            if (benefitsEl) {
                benefitsEl.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                navigate("/investment", { state: { scrollTo: "investment-benefits" } });
            }
            return;
        }

        // Home page: আগের মতো
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

    // ---------- সব section এক জায়গায় (design একই, শুধু কোথায় দেখাবে তা বদলায়) ----------
       const SECTION = {
        welcome: (
            <div key="welcome" ref={welcomeRef} id="welcome-section" className="lp-anchor">
                <Welcome data={landingData.welcome} scrollToInvestment={scrollToBenefitsOnly} />
            </div>
        ),
        invest: (
            <div key="invest" ref={investRef} id="invest-section" className="lp-anchor">
                <Investment data={landingData.investment} showOnlyBenefits={showOnlyBenefits} />
            </div>
        ),
        package: (
            <div key="package" ref={packageRef} id="package-section" className="lp-anchor">
                <Packagegrap data={landingData.packages} />
            </div>
        ),
        owner: (
            <div key="owner" ref={ownerRef} id="owner-section" className="lp-anchor">
                <Owner data={landingData.owner} />
            </div>
        ),
        facility: (
            <div key="facility" id="facility-section" className="lp-anchor">
                <Facility data={landingData.facility} />
            </div>
        ),
        // শুধু Investment Benefits (package / stats ছাড়া) — Benefits page এর জন্য
        benefitsList: (
            <div key="benefitsList" id="benefits-section" className="lp-anchor">
                <Investment data={landingData.investment} showOnlyBenefits />
            </div>
        ),
    };

    const anchorStyle = (
        <style>{`
            .lp-anchor { scroll-margin-top: 90px; }
            @media (max-width: 991px) { .lp-anchor { scroll-margin-top: 70px; } }
        `}</style>
    );

    // ---------- Investment / Benefits page: শুধু নির্দিষ্ট section ----------
    if (isSubPage) {
        const keys = PAGE_SECTIONS[pageView] || [];
        return (
            <>
                <Header />
                {keys.map((key) => SECTION[key])}
                <Footer />
                {anchorStyle}
            </>
        );
    }

    // ---------- Full Home page ----------
    return (
        <>
            <Header />

            <Banner
                onDiscoverClick={scrollToWelcome}
                onPackagesClick={scrollToInvestment}
                data={landingData}
            />

            <Notice data={landingData.notices} />

            {SECTION.welcome}
            {SECTION.invest}
            {SECTION.package}
            {SECTION.owner}

            <HappyClient data={landingData.happyClients} />
            {SECTION.facility}
            <Video data={landingData.videos} />
            <ProjectView data={landingData.projects} />
            <OngoingView data={landingData.ongoing} />
            <Faqpage data={landingData.faqpage} />
            <Sister data={landingData.sister} />
            <Testominal data={landingData.testimonials} />

            <Footer />
            {anchorStyle}
        </>
    );
};

export default LandingPage;