import React from 'react'
import Header from './Common/Header'
import Footer from './Common/Footer'
import '../css/blog.css';
import '../css/Contact.css'
import 'bootstrap-icons/font/bootstrap-icons.css';



import contactImg from '../image/section/Blog/orrivaa_contact_image_new.webp'



const Contact = () => {



    const contactInfo = [
        {
            id: 1,
            title: "Call Us",
            detail: "(123) 456 7890",
            icon: "bi bi-telephone", // Bootstrap icons use kora hoyeche
        },
        {
            id: 2,
            title: "Mail Us",
            detail: "email@example.com",
            icon: "bi bi-envelope",
        },
        {
            id: 3,
            title: "Visit Us",
            detail: "Anywhere City, Central 123 Business area",
            icon: "bi bi-geo-alt",
        }
    ];


    return (
        <>
            <Header />

            <section className="blog-banner text-center d-flex flex-column justify-content-center">
                <div className="container">
                    <h1 className="blog-title serif mb-2 text-white">Contact</h1>
                    <h1 className="blog-title serif mb-2 text-white"> Akashbari Resort</h1>

                </div>
            </section>


            {/* 2nd Section */}


            {/* 2nd Section: Send an Enquiry */}
            <section className="enquiry-section py-5">
                <div className="container">
                    {/* Note: align-items-center remove kore stretch default rakha hoyeche */}
                    <div className="row g-5">
                        {/* Left Side: Image */}
                        <div className="col-lg-6">
                            <div className="contact-image-wrapper h-100">
                                <img
                                    src={contactImg}
                                    alt="Staff Member"
                                    className="img-fluid rounded-4 shadow-sm custom-enquiry-img"
                                />
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="col-lg-6 text-start"> {/* text-start যুক্ত করা হয়েছে */}
                            <div className="form-content">
                                <span className="text-gold text-uppercase ls-2 small fw-bold d-block mb-2">
                                    <span className="dot-icon">●</span> Quick Enquiry
                                </span>
                                <h2 className="serif display-6 mb-3 text-start"> {/* text-start নিশ্চিত করুন */}
                                    Send an <span className="text-italic">Enquiry</span>
                                </h2>
                                <p className="text-muted mb-4 text-start"> {/* text-start নিশ্চিত করুন */}
                                    Have a question or special request? Leave us a message and we'll
                                    follow up soon with the details you need.
                                </p>

                                <form className="enquiry-form text-start"> {/* ফর্মের ভেতরেও text-start */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small d-block text-start">Name *</label>
                                        <input type="text" className="form-control custom-input" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small d-block text-start">Email Address *</label>
                                        <input type="email" className="form-control custom-input" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small d-block text-start">Phone Number *</label>
                                        <input type="tel" className="form-control custom-input" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small d-block text-start">Message *</label>
                                        <textarea className="form-control custom-input" rows="4" required></textarea>
                                    </div>
                                    <button type="submit" className="btn-submit-query">
                                        Submit Query
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* 3rd Section  */}

            {/* 3rd Section: Get in Touch */}
            <section className="contact-info-section py-5">
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center mb-5">
                        <span className="text-gold text-uppercase ls-2 small fw-bold d-block mb-2">
                            <span className="dot-icon">●</span> Contact Us
                        </span>
                        <h2 className="serif display-6">
                            Get in <span className="text-italic">Touch</span>
                        </h2>
                        <p className="text-muted mt-3">
                            Prefer a quick call or a message? Use the option that suits you.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="row g-4">
                        {contactInfo.map((item) => (
                            <div className="col-lg-4 col-md-6" key={item.id}>
                                <div className="contact-card text-center h-100">
                                    {/* p-5 soriye dewa hoyeche jate CSS padding kaj kore */}
                                    <div className="contact-icon-wrapper">
                                        <i className={`bi ${item.icon} text-gold`}></i>
                                    </div>
                                    <h4 className="serif">{item.title}</h4>
                                    <p className="text-muted">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default Contact
