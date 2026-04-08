import React from 'react'
import logo from '../image/logo-removebg-preview.png';

const Homepage = () => {
    return (
        <div
            style={{
                height: "100vh",
                backgroundImage: "url('https://i.ibb.co.com/F4pR05Pb/hilton-moorea-lagoon-resort-spa-moorea-french-poly-110160-1.jpg')",
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
                }}
            >
                {/* Responsive logo + title */}
                <div className="d-flex flex-column flex-md-row align-items-center gap-3 mb-3 text-center text-md-start">
                    <img
                        src={logo}
                        alt="logo"
                        style={{ width: "120px" }}
                    />
                    <h1 className="fw-bold mb-0">
                        Akashbari Resort
                    </h1>
                </div>

                <h4 className="mb-4 px-3">
                    This website is currently under Maintaince. <br />
                    To view content from our existing website, please click the button below.
                </h4>

                <a
                    href="https://www.akashbariholidays.com/resorts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning px-4 py-2 fw-bold"
                >
                    Click here for Details
                </a>
            </div>

        </div>
    )
}

export default Homepage