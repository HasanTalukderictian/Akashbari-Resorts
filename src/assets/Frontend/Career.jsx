import React, { useState, useEffect } from "react";
import "../css/Backend/career.css";
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import { Link } from "react-router-dom";

const Career = () => {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        // Correct path: from public folder, use "/" as root
        // const response = await fetch("/career.json");
        const response = await fetch("/public/career.json");
        if (!response.ok) {
          throw new Error("Failed to fetch career data");
        }
        const data = await response.json();
        setCareerData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCareerData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="career-container">
          <div className="career-wrapper">
            <div className="loading-spinner">
              <p>Loading career opportunities...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="career-container">
          <div className="career-wrapper">
            <div className="error-message">
              <p>Error loading data: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { careerPage } = careerData;
  const jobs = careerPage.jobs;

  return (
    <>
      <Header />
      <div className="career-container">
        <div className="career-wrapper">
          {/* Header Section */}
          <div className="career-header">
            <h1 className="career-main-title">{careerPage.header.mainTitle}</h1>
            <h2 className="career-sub-title">{careerPage.header.subTitle}</h2>
            <p className="career-description">
              {careerPage.header.description}
            </p>
          </div>

          {/* Job Cards Grid */}
          <div className="career-grid">
            {jobs.map((job) => (
              <div key={job.id} className="career-card">
                <div className="career-card-content">
                  <div className="career-badge-wrapper">
                    <span className="career-code">
                      NO. {String(job.id).padStart(3, "0")}
                    </span>
                    <span className="career-badge">{job.category}</span>
                  </div>

                  <h3 className="career-job-title">{job.title}</h3>
                  <p className="career-job-description">{job.description}</p>

                  <div className="career-job-details">
                    <p className="career-detail-item">{job.locations}</p>
                    <p className="career-detail-item">{job.type}</p>
                    <p className="career-detail-item">{job.posted}</p>
                  </div>

                  <Link to={`/career/${job.id}`} className="career-view-btn">
                    {job.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Career;