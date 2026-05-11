import React from 'react';
import { Phone } from 'lucide-react'; // আইকন ব্যবহারের জন্য এটি ইনস্টল থাকতে হবে: npm install lucide-react

const Homepage = () => {
    return (
        <div
            style={{
                height: "100vh",
                backgroundImage: "url('https://i.ibb.co.com/yBcPqBqZ/d1-1715829836350.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
            }}
        >
            {/* Dark overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.6)"
                }}
            ></div>

            {/* Content */}
            <div
                className="text-center text-white"
                style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 20px"
                }}
            >
                {/* Responsive logo + title */}
                <div className="d-flex flex-column flex-md-row align-items-center gap-3 mb-3 text-center text-md-start">
                    <img
                        src="https://i.ibb.co.com/21J7GS2S/Akashbari-resort-logo-png-01.png"
                        alt="logo"
                        style={{ width: "120px" }}
                    />
                    <h1 className="fw-bold mb-0">
                        Akashbari Resort
                    </h1>
                </div>

                <h4 className="mb-4">
                    This website is currently under Maintenance. <br />
                    To view content from our existing website, please click the button below.
                </h4>

                {/* Button and Call Icon Parallel Container */}
                <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
                    <a
                        href="https://www.akashbariholidays.com/resorts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-warning px-4 py-2 fw-bold"
                        style={{ borderRadius: "50px" }}
                    >
                        Click here for Details
                    </a>

                    <a 
                        href="tel:01701294455" 
                        className="d-flex align-items-center gap-2 text-decoration-none fw-bold"
                        style={{ 
                            color: "#ffc107", // Matching btn-warning color
                            fontSize: "1.2rem",
                            padding: "8px 15px",
                            border: "2px solid #ffc107",
                            borderRadius: "50px"
                        }}
                    >
                        <Phone size={20} fill="#ffc107" />
                        01701294455
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Homepage;