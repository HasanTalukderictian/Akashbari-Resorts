import React from 'react';
import '../css/video.css'; 

const Video = () => {
  return (
    <section className="video-section py-5">
      <div className="container text-center">
        {/* Top Header Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            {/* এখানে class যোগ করা হয়েছে */}
            <div className=" mx-auto mb-3"></div>
            <p className="gateway-text mb-2">Your Gateway to Paradise</p>
            <h5 className="video-subtext text-muted">
              Experience luxury and tranquility at Akashbari Resorts - where nature meets comfort in perfect harmony.
            </h5>
          </div>
        </div>

        {/* Video Section */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="video-wrapper shadow-lg">
              <div className="ratio ratio-16x9">
                <iframe 
                  /* লিঙ্কটি watch থেকে embed এ পরিবর্তন করা হয়েছে */
                  src="https://www.youtube.com/embed/NpI3AMNz1Mg" 
                  title="Akashbari Hotels & Resorts Virtual Tour" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Video;