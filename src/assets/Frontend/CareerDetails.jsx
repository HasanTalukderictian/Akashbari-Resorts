
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/Backend/careerdetails.css";
import Header from "./Common/Header";
import Footer from "./Common/Footer";

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL } from "../../Config/api";

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  position: "",
  experience: "",
  coverLetter: "",
  currentCompany: "",
  designation: "",
  noticePeriod: "",
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

// Server HTML পাঠালেও crash করবে না
const parseJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      message:
        res.status >= 500
          ? `Server error (${res.status}). Please try again later.`
          : `Unexpected response (${res.status})`,
    };
  }
};

// 422 হলে প্রথম validation error দেখাও
const errorMessage = (body, fallback) => {
  if (body?.errors) {
    const first = Object.values(body.errors)[0];
    return Array.isArray(first) ? first[0] : String(first);
  }
  return body?.message || fallback;
};

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

  const [showSuccess, setShowSuccess] = useState(false);

  // Page load হলে উপরে scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Job details
  useEffect(() => {
    const controller = new AbortController();

    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/get-jobs/${id}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const data = await parseJson(response);

        if (response.status === 404 || data?.status === false) {
          throw new Error(data?.message || "Job not found.");
        }
        if (!response.ok) {
          throw new Error(errorMessage(data, `Failed to fetch job details (${response.status})`));
        }

        const jobData = data.data;
        if (!jobData || Object.keys(jobData).length === 0) {
          throw new Error("Job not found.");
        }

        setJob({
          ...jobData,
          metaInfo: jobData.jobDetails?.metaInfo || jobData.metaInfo,
          overview: jobData.jobDetails?.overview || jobData.overview,
          responsibilities: jobData.jobDetails?.responsibilities || jobData.responsibilities,
          requirements: jobData.jobDetails?.requirements || jobData.requirements,
          benefits: jobData.jobDetails?.benefits || jobData.benefits,
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching job details:", err);
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchJobDetails();
    return () => controller.abort();
  }, [id]);

  // Escape চাপলে modal বন্ধ
  useEffect(() => {
    if (!isApplyModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeApplyModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isApplyModalOpen]);

  // Success toast ২ সেকেন্ড পর বন্ধ
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 2000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const openApplyModal = () => {
    setFormData({
      ...initialFormState,
      position: POSITION_OPTIONS.includes(job.title) ? job.title : "",
    });
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
    setFormData(initialFormState);
    setResumeFile(null);
    setResumeError("");
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitting) closeApplyModal();
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
    setResumeError("");
    try {
      const formPayload = new FormData();
      formPayload.append("job_id", id);
      formPayload.append("full_name", formData.fullName.trim());
      formPayload.append("email", formData.email.trim());
      formPayload.append("phone", formData.phone.trim());
      formPayload.append("experience", formData.experience);
      formPayload.append("cover_letter", formData.coverLetter.trim());
      formPayload.append("resume", resumeFile);

      if (formData.experience && formData.experience !== "entry") {
        formPayload.append("current_company", formData.currentCompany.trim());
        formPayload.append("designation", formData.designation.trim());
        formPayload.append("notice_period", formData.noticePeriod);
      }

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: { Accept: "application/json" }, // Content-Type দেবেন না, FormData নিজে দেয়
        body: formPayload,
      });

      const result = await parseJson(response);

      if (response.status === 429) {
        throw new Error("Too many attempts. Please wait a minute and try again.");
      }
      if (!response.ok || result?.status === false) {
        throw new Error(errorMessage(result, "Failed to submit application"));
      }

      closeApplyModal();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      setResumeError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
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

  // Error অথবা job নেই
  if (error || !job) {
    return (
      <>
        <Header />
        <div className="career-details-container">
          <div className="career-details-wrapper">
            <div className="error-message">
              <h2>{error ? "Job not available" : "Job not found"}</h2>
              <p>{error || "This job may have been removed or closed."}</p>
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
          {job.responsibilities?.items?.length > 0 && (
            <section className="details-section">
              <h2 className="section-title">{job.responsibilities?.title || "KEY RESPONSIBILITIES"}</h2>
              <ul className="details-list">
                {job.responsibilities.items.map((item, index) => (
                  <li key={index} className="details-list-item">
                    <span className="list-icon">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements?.items?.length > 0 && (
            <section className="details-section">
              <h2 className="section-title">{job.requirements?.title || "REQUIREMENTS"}</h2>
              <ul className="details-list">
                {job.requirements.items.map((item, index) => (
                  <li key={index} className="details-list-item">
                    <span className="list-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Benefits & Perks */}
          {job.benefits?.items?.length > 0 && (
            <section className="details-section">
              <h2 className="section-title">{job.benefits?.title || "BENEFITS & PERKS"}</h2>
              <ul className="details-list benefits-list">
                {job.benefits.items.map((item, index) => (
                  <li key={index} className="details-list-item">
                    <span className="list-icon">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Apply Section */}
          <section className="apply-section">
            <h2 className="apply-title">APPLY NOW</h2>
            <p className="apply-text">
              Ready to join our team? Submit your application today and start your journey with us!
            </p>
            <button className="apply-button" onClick={openApplyModal}>
              APPLY NOW
            </button>
          </section>
        </div>
      </div>
      <Footer />

      {/* Apply For Position Modal */}
      {isApplyModalOpen && (
        <div className="apply-modal-overlay" onClick={handleOverlayClick} role="presentation">
          <div className="apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-modal-title">
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
                disabled={submitting}
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
                    placeholder="+880 1XXX-XXXXXX"
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

              {/* অভিজ্ঞ প্রার্থীদের জন্য extra field */}
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
                        value={formData.currentCompany}
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
                        value={formData.designation}
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
                        value={formData.noticePeriod}
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
                      <span className="apply-resume-dropzone-text">Click to upload your CV/resume</span>
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

                  {resumeError && <span className="apply-resume-error">{resumeError}</span>}
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
                By submitting this form, you agree to be contacted for recruitment purposes. We respect
                your privacy and never share your information.
              </p>

              <div className="apply-modal-actions">
                <button
                  type="button"
                  className="apply-cancel-btn"
                  onClick={closeApplyModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="apply-submit-btn" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast" role="alert" aria-live="polite">
          <div className="success-toast-content">
            <div className="success-toast-icon">✓</div>
            <h3 className="success-toast-title">Thank You!</h3>
            <p className="success-toast-message">Your application has been submitted successfully.</p>
            <p
              className="success-toast-message"
              style={{ fontSize: "0.9rem", color: "var(--cd-teal)", fontWeight: 600 }}
            >
              Our HR team will monitor your application.
            </p>
            <div className="success-toast-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CareerDetails;