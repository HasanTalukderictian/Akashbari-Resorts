// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import "../css/Backend/careerdetails.css";
// import Header from "./Common/Header";
// import Footer from "./Common/Footer";

// const initialFormState = {
//   fullName: "",
//   email: "",
//   phone: "",
//   position: "",
//   experience: "",
//   coverLetter: "",
// }; 

// const POSITION_OPTIONS = [
//   "Software Developer",
//   "IT Support",
//   "Sales Executive",
//   "Marketing Executive",
//   "Customer Service Representative",
//   "HR Executive",
//   "Accountant",
//   "Graphic Designer",
//   "Tour Guide",
//   "Operations Manager",
//   "Other",
// ];

// const MAX_RESUME_SIZE_MB = 5;
// const ACCEPTED_RESUME_TYPES = [
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// ];

// const CareerDetails = () => {
//   const { id } = useParams();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
//   const [formData, setFormData] = useState(initialFormState);
//   const [submitting, setSubmitting] = useState(false);
//   const [resumeFile, setResumeFile] = useState(null);
//   const [resumeError, setResumeError] = useState("");

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         // Correct path: from public folder, use "/" as root
//         const response = await fetch("/public/career.json");
//         if (!response.ok) {
//           throw new Error("Failed to fetch job details");
//         }
//         const data = await response.json();

//         // Get specific job by id
//         const jobData = data.jobDetails[id];
//         if (!jobData) {
//           throw new Error("Job not found");
//         }

//         setJob(jobData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchJobDetails();
//   }, [id]);

//   // Close modal on Escape key
//   useEffect(() => {
//     if (!isApplyModalOpen) return;

//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         closeApplyModal();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [isApplyModalOpen]);

//   const openApplyModal = () => {
//     setFormData((prev) => ({
//       ...prev,
//       position: POSITION_OPTIONS.includes(job.title) ? job.title : "",
//     }));
//     setIsApplyModalOpen(true);
//   };

//   const closeApplyModal = () => {
//     setIsApplyModalOpen(false);
//     setFormData(initialFormState);
//     setResumeFile(null);
//     setResumeError("");
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       closeApplyModal();
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleResumeChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) {
//       setResumeFile(null);
//       setResumeError("");
//       return;
//     }

//     if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
//       setResumeError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
//       setResumeFile(null);
//       e.target.value = "";
//       return;
//     }

//     if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
//       setResumeError(`File is too large. Max size is ${MAX_RESUME_SIZE_MB}MB.`);
//       setResumeFile(null);
//       e.target.value = "";
//       return;
//     }

//     setResumeError("");
//     setResumeFile(file);
//   };

//   const removeResume = () => {
//     setResumeFile(null);
//     setResumeError("");
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     if (!resumeFile) {
//       setResumeError("Please attach your CV/resume.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // TODO: wire this up to your actual application endpoint, e.g.:
//       // const payload = new FormData();
//       // Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
//       // payload.append("jobId", id);
//       // payload.append("resume", resumeFile);
//       // await fetch("/api/applications", { method: "POST", body: payload });
//       console.log("Application submitted:", { jobId: id, ...formData, resumeFile });
//       closeApplyModal();
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="career-details-container">
//           <div className="career-details-wrapper">
//             <div className="loading-spinner">
//               <p>Loading job details...</p>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="career-details-container">
//           <div className="career-details-wrapper">
//             <div className="error-message">
//               <h2>Error</h2>
//               <p>{error}</p>
//               <Link to="/career" className="back-button">
//                 ← Back to Careers
//               </Link>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Job not found
//   if (!job) {
//     return (
//       <>
//         <Header />
//         <div className="career-details-container">
//           <div className="career-details-wrapper">
//             <h2>Job not found</h2>
//             <Link to="/career" className="back-button">
//               ← Back to Careers
//             </Link>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="career-details-container">
//         <div className="career-details-wrapper">
//           {/* Back Button */}
//           <Link to="/career" className="back-button">
//             ← Back to Careers
//           </Link>

//           {/* Job Header */}
//           <div className="job-header">
//             <h1 className="job-title">{job.title}</h1>
//             <div className="job-meta-grid">
//               <div className="job-meta-item">
//                 <span className="meta-label">Job Role:</span>
//                 <span className="meta-value">{job.metaInfo.duration}</span>
//               </div>
//               <div className="job-meta-item">
//                 <span className="meta-label">salary:</span>
//                 <span className="meta-value">{job.metaInfo.salary}</span>
//               </div>
//               <div className="job-meta-item">
//                 <span className="meta-label">Job Type:</span>
//                 <span className="meta-value">{job.metaInfo.type}</span>
//               </div>
//               <div className="job-meta-item">
//                 <span className="meta-label">Start Time:</span>
//                 <span className="meta-value">{job.metaInfo.startTime}</span>
//               </div>
//               <div className="job-meta-item">
//                 <span className="meta-label">End Time:</span>
//                 <span className="meta-value">{job.metaInfo.endTime}</span>
//               </div>
//             </div>
//           </div>

//           {/* Job Overview */}
//           <section className="details-section">
//             <h2 className="section-title">{job.overview.title}</h2>
//             <p className="section-text">{job.overview.description}</p>
//           </section>

//           {/* Key Responsibilities */}
//           <section className="details-section">
//             <h2 className="section-title">{job.responsibilities.title}</h2>
//             <ul className="details-list">
//               {job.responsibilities.items.map((item, index) => (
//                 <li key={index} className="details-list-item">
//                   <span className="list-icon">▸</span>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </section>


//           {/* Requirements */}
//           <section className="details-section">
//             <h2 className="section-title">{job.requirements.title}</h2>
//             <ul className="details-list">
//               {job.requirements.items.map((item, index) => (
//                 <li key={index} className="details-list-item">
//                   <span className="list-icon">✓</span>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </section>

//           {/* Benefits & Perks */}
//           <section className="details-section">
//             <h2 className="section-title">{job.benefits.title}</h2>
//             <ul className="details-list benefits-list">
//               {job.benefits.items.map((item, index) => (
//                 <li key={index} className="details-list-item">
//                   <span className="list-icon">✦</span>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </section>

//           {/* Apply Section */}
//           <section className="apply-section">
//             <h2 className="apply-title">APPLY NOW</h2>
//             <p className="apply-text">Ready to join our customer service team? Submit your application today and start your journey with us!</p>
//             <button className="apply-button" onClick={openApplyModal}>
//               APPLY NOW
//             </button>
           
//           </section>

          
//         </div>
//       </div>
//       <Footer />

//       {/* Apply For Position Modal */}
//       {isApplyModalOpen && (
//         <div
//           className="apply-modal-overlay"
//           onClick={handleOverlayClick}
//           role="presentation"
//         >
//           <div
//             className="apply-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="apply-modal-title"
//           >
//             <div className="apply-modal-header">
//               <div className="apply-modal-eyebrow">APPLICATION FORM</div>
//               <h2 id="apply-modal-title" className="apply-modal-title">
//                 Apply for Position
//               </h2>
//               <p className="apply-modal-position">Position: {job.title}</p>
//               <button
//                 type="button"
//                 className="apply-modal-close"
//                 onClick={closeApplyModal}
//                 aria-label="Close application form"
//               >
//                 ✕
//               </button>
//             </div>

//             <form className="apply-modal-body" onSubmit={handleFormSubmit}>
//               <div className="apply-form-row">
//                 <div className="apply-form-group">
//                   <label className="apply-form-label" htmlFor="fullName">
//                     Full Name<span className="required">*</span>
//                   </label>
//                   <input
//                     id="fullName"
//                     name="fullName"
//                     type="text"
//                     className="apply-form-input"
//                     placeholder="John Doe"
//                     value={formData.fullName}
//                     onChange={handleFormChange}
//                     required
//                   />
//                 </div>
//                 <div className="apply-form-group">
//                   <label className="apply-form-label" htmlFor="email">
//                     Email Address<span className="required">*</span>
//                   </label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     className="apply-form-input"
//                     placeholder="john@example.com"
//                     value={formData.email}
//                     onChange={handleFormChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="apply-form-row">
//                 <div className="apply-form-group full-width">
//                   <label className="apply-form-label" htmlFor="position">
//                     Position<span className="required">*</span>
//                   </label>
//                   <select
//                     id="position"
//                     name="position"
//                     className="apply-form-select"
//                     value={formData.position}
//                     onChange={handleFormChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select a position
//                     </option>
//                     {POSITION_OPTIONS.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="apply-form-row">
//                 <div className="apply-form-group">
//                   <label className="apply-form-label" htmlFor="phone">
//                     Phone Number<span className="required">*</span>
//                   </label>
//                   <input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     className="apply-form-input"
//                     placeholder="+1 (555) 123-4567"
//                     value={formData.phone}
//                     onChange={handleFormChange}
//                     required
//                   />
//                 </div>
//                 <div className="apply-form-group">
//                   <label className="apply-form-label" htmlFor="experience">
//                     Years of Experience<span className="required">*</span>
//                   </label>
//                   <select
//                     id="experience"
//                     name="experience"
//                     className="apply-form-select"
//                     value={formData.experience}
//                     onChange={handleFormChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select experience
//                     </option>
//                     <option value="entry">Fresh Graduate / Entry Level</option>
//                     <option value="1-2">1–2 years</option>
//                     <option value="3-5">3–5 years</option>
//                     <option value="5-10">5–10 years</option>
//                     <option value="10+">10+ years</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="apply-form-row">
//                 <div className="apply-form-group full-width">
//                   <label className="apply-form-label" htmlFor="resume">
//                     CV / Resume<span className="required">*</span>
//                   </label>

//                   {!resumeFile ? (
//                     <label htmlFor="resume" className="apply-resume-dropzone">
//                       <span className="apply-resume-dropzone-icon">⤒</span>
//                       <span className="apply-resume-dropzone-text">
//                         Click to upload your CV/resume
//                       </span>
//                       <span className="apply-resume-dropzone-hint">
//                         PDF or Word · Max {MAX_RESUME_SIZE_MB}MB
//                       </span>
//                       <input
//                         id="resume"
//                         name="resume"
//                         type="file"
//                         className="apply-resume-input"
//                         accept=".pdf,.doc,.docx"
//                         onChange={handleResumeChange}
//                       />
//                     </label>
//                   ) : (
//                     <div className="apply-resume-file">
//                       <span className="apply-resume-file-icon">📄</span>
//                       <div className="apply-resume-file-info">
//                         <span className="apply-resume-file-name">{resumeFile.name}</span>
//                         <span className="apply-resume-file-size">
//                           {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
//                         </span>
//                       </div>
//                       <button
//                         type="button"
//                         className="apply-resume-remove"
//                         onClick={removeResume}
//                         aria-label="Remove uploaded file"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}

//                   {resumeError && (
//                     <span className="apply-resume-error">{resumeError}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="apply-form-row">
//                 <div className="apply-form-group full-width">
//                   <label className="apply-form-label" htmlFor="coverLetter">
//                     Cover Letter / Additional Information
//                   </label>
//                   <textarea
//                     id="coverLetter"
//                     name="coverLetter"
//                     className="apply-form-textarea"
//                     placeholder="Tell us why you're interested in this position..."
//                     value={formData.coverLetter}
//                     onChange={handleFormChange}
//                   />
//                 </div>
//               </div>

//               <p className="apply-form-note">
//                 By submitting this form, you agree to be contacted by Akashbari for
//                 recruitment purposes. We respect your privacy and never share your
//                 information.
//               </p>

//               <div className="apply-modal-actions">
//                 <button
//                   type="button"
//                   className="apply-cancel-btn"
//                   onClick={closeApplyModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="apply-submit-btn"
//                   disabled={submitting}
//                 >
//                   {submitting ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CareerDetails;


import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/Backend/careerdetails.css";
import Header from "./Common/Header";
import Footer from "./Common/Footer";

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  position: "",
  experience: "",
  coverLetter: "",
};

const POSITION_OPTIONS = [
  "Software Developer",
  "IT Support",
  "Sales Executive",
  "Marketing Executive",
  "Customer Service Representative",
  "HR Executive",
  "Accountant",
  "Graphic Designer",
  "Tour Guide",
  "Operations Manager",
  "Other",
];

const MAX_RESUME_SIZE_MB = 5;
const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const CareerDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Fetch from Laravel API with ID
        // const response = await fetch(`http://127.0.0.1:8000/api/get-jobs/${id}`);
              const response = await fetch(`https://backend.akashbariresort.com/api/get-jobs/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch job details: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Job Detail Response:", data); // For debugging
        
        // API returns: { status: true, message: "...", data: { id, title, category, ..., jobDetails: {...}} }
        // We need to use the jobDetails object for the detailed view
        const jobData = data.data;
        
        if (!jobData || Object.keys(jobData).length === 0) {
          throw new Error("Job not found");
        }

        // Set the job data - use the nested jobDetails for detailed view
        // But keep the main job info as well
        setJob({
          ...jobData,
          // If jobDetails exists, use it for the detailed sections
          metaInfo: jobData.jobDetails?.metaInfo || jobData.metaInfo,
          overview: jobData.jobDetails?.overview || jobData.overview,
          responsibilities: jobData.jobDetails?.responsibilities || jobData.responsibilities,
          requirements: jobData.jobDetails?.requirements || jobData.requirements,
          benefits: jobData.jobDetails?.benefits || jobData.benefits,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isApplyModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeApplyModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isApplyModalOpen]);

  const openApplyModal = () => {
    setFormData((prev) => ({
      ...prev,
      position: POSITION_OPTIONS.includes(job.title) ? job.title : "",
    }));
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
    setFormData(initialFormState);
    setResumeFile(null);
    setResumeError("");
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeApplyModal();
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      setResumeError("");
      return;
    }

    if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
      setResumeError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
      setResumeError(`File is too large. Max size is ${MAX_RESUME_SIZE_MB}MB.`);
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    setResumeError("");
    setResumeFile(file);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeError("");
  };

const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
        setResumeError("Please attach your CV/resume.");
        return;
    }

    setSubmitting(true);
    try {
        // Create FormData for file upload
        const formPayload = new FormData();
        formPayload.append("job_id", id);
        formPayload.append("full_name", formData.fullName);
        formPayload.append("email", formData.email);
        formPayload.append("phone", formData.phone);
        formPayload.append("experience", formData.experience);
        formPayload.append("cover_letter", formData.coverLetter || "");
        formPayload.append("resume", resumeFile);

        // Add conditional fields only if not fresh graduate
        if (formData.experience && formData.experience !== "entry") {
            formPayload.append("current_company", formData.currentCompany || "");
            formPayload.append("designation", formData.designation || "");
            formPayload.append("notice_period", formData.noticePeriod || "");
        }

        // Send to Laravel API
        const response = await fetch("http://127.0.0.1:8000/api/applications", {
            method: "POST",
            body: formPayload,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit application");
        }

        const result = await response.json();
        console.log("Application submitted:", result);
        
        // Close modal on success
        closeApplyModal();
        
        // Show success message
        alert("Application submitted successfully!");
        
    } catch (err) {
        console.error("Error submitting application:", err);
        setResumeError(err.message || "Failed to submit application. Please try again.");
    } finally {
        setSubmitting(false);
    }
};

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="career-details-container">
          <div className="career-details-wrapper">
            <div className="loading-spinner">
              <p>Loading job details...</p>
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
        <div className="career-details-container">
          <div className="career-details-wrapper">
            <div className="error-message">
              <h2>Error</h2>
              <p>{error}</p>
              <Link to="/career" className="back-button">
                ← Back to Careers
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Job not found
  if (!job) {
    return (
      <>
        <Header />
        <div className="career-details-container">
          <div className="career-details-wrapper">
            <h2>Job not found</h2>
            <Link to="/career" className="back-button">
              ← Back to Careers
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="career-details-container">
        <div className="career-details-wrapper">
          {/* Back Button */}
          <Link to="/career" className="back-button">
            ← Back to Careers
          </Link>

          {/* Job Header */}
          <div className="job-header">
            <h1 className="job-title">{job.title}</h1>
            <div className="job-meta-grid">
              <div className="job-meta-item">
                <span className="meta-label">Job Role:</span>
                <span className="meta-value">{job.metaInfo?.duration || "N/A"}</span>
              </div>
              <div className="job-meta-item">
                <span className="meta-label">Salary:</span>
                <span className="meta-value">{job.metaInfo?.salary || "N/A"}</span>
              </div>
              <div className="job-meta-item">
                <span className="meta-label">Job Type:</span>
                <span className="meta-value">{job.metaInfo?.type || "N/A"}</span>
              </div>
              <div className="job-meta-item">
                <span className="meta-label">Start Time:</span>
                <span className="meta-value">{job.metaInfo?.startTime || "N/A"}</span>
              </div>
              <div className="job-meta-item">
                <span className="meta-label">End Time:</span>
                <span className="meta-value">{job.metaInfo?.endTime || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Job Overview */}
          <section className="details-section">
            <h2 className="section-title">{job.overview?.title || "JOB OVERVIEW"}</h2>
            <p className="section-text">{job.overview?.description || "No description available."}</p>
          </section>

          {/* Key Responsibilities */}
          <section className="details-section">
            <h2 className="section-title">{job.responsibilities?.title || "KEY RESPONSIBILITIES"}</h2>
            <ul className="details-list">
              {job.responsibilities?.items?.map((item, index) => (
                <li key={index} className="details-list-item">
                  <span className="list-icon">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section className="details-section">
            <h2 className="section-title">{job.requirements?.title || "REQUIREMENTS"}</h2>
            <ul className="details-list">
              {job.requirements?.items?.map((item, index) => (
                <li key={index} className="details-list-item">
                  <span className="list-icon">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits & Perks */}
          <section className="details-section">
            <h2 className="section-title">{job.benefits?.title || "BENEFITS & PERKS"}</h2>
            <ul className="details-list benefits-list">
              {job.benefits?.items?.map((item, index) => (
                <li key={index} className="details-list-item">
                  <span className="list-icon">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Apply Section */}
          <section className="apply-section">
            <h2 className="apply-title">APPLY NOW</h2>
            <p className="apply-text">Ready to join our team? Submit your application today and start your journey with us!</p>
            <button className="apply-button" onClick={openApplyModal}>
              APPLY NOW
            </button>
          </section>
        </div>
      </div>
      <Footer />

    
      {/* Apply For Position Modal */}
{isApplyModalOpen && (
  <div
    className="apply-modal-overlay"
    onClick={handleOverlayClick}
    role="presentation"
  >
    <div
      className="apply-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div className="apply-modal-header">
        <div className="apply-modal-eyebrow">APPLICATION FORM</div>
        <h2 id="apply-modal-title" className="apply-modal-title">
          Apply for Position
        </h2>
        <p className="apply-modal-position">Position: {job.title}</p>
        <button
          type="button"
          className="apply-modal-close"
          onClick={closeApplyModal}
          aria-label="Close application form"
        >
          ✕
        </button>
      </div>

      <form className="apply-modal-body" onSubmit={handleFormSubmit}>
        <div className="apply-form-row">
          <div className="apply-form-group">
            <label className="apply-form-label" htmlFor="fullName">
              Full Name<span className="required">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="apply-form-input"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="apply-form-group">
            <label className="apply-form-label" htmlFor="email">
              Email Address<span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="apply-form-input"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>

        <div className="apply-form-row">
          <div className="apply-form-group">
            <label className="apply-form-label" htmlFor="phone">
              Phone Number<span className="required">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="apply-form-input"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="apply-form-group">
            <label className="apply-form-label" htmlFor="experience">
              Years of Experience<span className="required">*</span>
            </label>
            <select
              id="experience"
              name="experience"
              className="apply-form-select"
              value={formData.experience}
              onChange={handleFormChange}
              required
            >
              <option value="" disabled>
                Select experience
              </option>
              <option value="entry">Fresh Graduate / Entry Level</option>
              <option value="1-2">1–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5-10">5–10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
        </div>

        {/* Conditional fields for experienced candidates */}
        {formData.experience && formData.experience !== "entry" && (
          <>
            <div className="apply-form-row">
              <div className="apply-form-group">
                <label className="apply-form-label" htmlFor="currentCompany">
                  Current Company Name<span className="required">*</span>
                </label>
                <input
                  id="currentCompany"
                  name="currentCompany"
                  type="text"
                  className="apply-form-input"
                  placeholder="Company name"
                  value={formData.currentCompany || ""}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="apply-form-group">
                <label className="apply-form-label" htmlFor="designation">
                  Designation<span className="required">*</span>
                </label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  className="apply-form-input"
                  placeholder="Your designation"
                  value={formData.designation || ""}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="apply-form-row">
              <div className="apply-form-group full-width">
                <label className="apply-form-label" htmlFor="noticePeriod">
                  Notice Period<span className="required">*</span>
                </label>
                <select
                  id="noticePeriod"
                  name="noticePeriod"
                  className="apply-form-select"
                  value={formData.noticePeriod || ""}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled>
                    Select notice period
                  </option>
                  <option value="immediate">Immediate</option>
                  <option value="15-days">15 days</option>
                  <option value="30-days">30 days</option>
                  <option value="45-days">45 days</option>
                  <option value="60-days">60 days</option>
                  <option value="90-days">90 days</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="apply-form-row">
          <div className="apply-form-group full-width">
            <label className="apply-form-label" htmlFor="resume">
              CV / Resume<span className="required">*</span>
            </label>

            {!resumeFile ? (
              <label htmlFor="resume" className="apply-resume-dropzone">
                <span className="apply-resume-dropzone-icon">⤒</span>
                <span className="apply-resume-dropzone-text">
                  Click to upload your CV/resume
                </span>
                <span className="apply-resume-dropzone-hint">
                  PDF or Word · Max {MAX_RESUME_SIZE_MB}MB
                </span>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  className="apply-resume-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
              </label>
            ) : (
              <div className="apply-resume-file">
                <span className="apply-resume-file-icon">📄</span>
                <div className="apply-resume-file-info">
                  <span className="apply-resume-file-name">{resumeFile.name}</span>
                  <span className="apply-resume-file-size">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  className="apply-resume-remove"
                  onClick={removeResume}
                  aria-label="Remove uploaded file"
                >
                  ✕
                </button>
              </div>
            )}

            {resumeError && (
              <span className="apply-resume-error">{resumeError}</span>
            )}
          </div>
        </div>

        <div className="apply-form-row">
          <div className="apply-form-group full-width">
            <label className="apply-form-label" htmlFor="coverLetter">
              Cover Letter / Additional Information
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              className="apply-form-textarea"
              placeholder="Tell us why you're interested in this position..."
              value={formData.coverLetter}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <p className="apply-form-note">
          By submitting this form, you agree to be contacted for
          recruitment purposes. We respect your privacy and never share your
          information.
        </p>

        <div className="apply-modal-actions">
          <button
            type="button"
            className="apply-cancel-btn"
            onClick={closeApplyModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="apply-submit-btn"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </>
  );
};

export default CareerDetails;