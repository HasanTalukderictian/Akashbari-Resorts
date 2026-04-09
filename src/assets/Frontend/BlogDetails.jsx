import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/blog.css'; 
import '../css/blogdetails.css'



const BlogDetails = () => {
    const location = useLocation();
    const { post } = location.state || {};

    if (!post) {
        return <div className="text-center py-5">No Blog Data Found!</div>;
    }

    return (
        <>
            <Header />
            {/* 1st section: Banner */}
            <section className="blog-banner text-center d-flex flex-column justify-content-center">
                <div className="container">
                    <h1 className="blog-title serif mb-2 text-white">Blog Details</h1>
                     <h5 className="serif display-6 mb-3 text-white ">{post.title}</h5>
                </div>
            </section>

            {/* 2nd Section: Main Content + Sidebar */}
            <section className="blog-details-content py-5">
                <div className="container">
                    <div className="row g-5">
                        {/* LEFT SIDE: Main Blog Content */}
                        <div className="col-lg-8">
                            <p className="text-muted mb-4 lead">
                                Walking into a hotel lobby sets the tone for the entire stay
                            </p>
                            
                            <div className="detail-img-wrapper mb-5">
                                <img src={post.img} alt={post.title} className="img-fluid main-detail-img" />
                            </div>

                           
                            <p className="text-muted mb-4">
                                {post.desc || "The layout of the lobby focuses on clarity and flow. Seating areas are arranged to feel relaxed rather than crowded..."}
                            </p>

                            <h3 className="serif h4 mb-3">First Interactions That Matter</h3>
                            <p className="text-muted">
                                Beyond design, the lobby is where guests often have their first interaction...
                            </p>
                        </div>

                        {/* RIGHT SIDE: Sidebar */}
                        <div className="col-lg-4">
                            {/* Recent Posts Card */}
                            <div className="sidebar-card mb-4">
                                <h5 className="serif mb-4">Recent Posts</h5>
                                <ul className="recent-posts-list">
                                    <li>What Makes a Suite Stay Feel Comfortable...</li>
                                    <li>Planning a Relaxed Weekend Stay at Orrivaa</li>
                                    <li>Why Guests Choose the Signature Suite...</li>
                                    <li>Staying Productive While Traveling...</li>
                                    <li>A Slow Afternoon at the Spa...</li>
                                </ul>
                            </div>

                            {/* Book Your Stay Card */}
                            <div className="book-now-card text-white">
                                <div className="book-img-overlay">
                                    <img src={post.img} alt="sidebar-cta" className="img-fluid" />
                                </div>
                                <div className="book-content p-4">
                                    <h4 className="serif">Book Your Stay</h4>
                                    <p className="small mb-4">Check availability and choose the room that fits your stay.</p>
                                    <button className="book-btn-white">
                                        Book Now <span className="ms-2">↗</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default BlogDetails;