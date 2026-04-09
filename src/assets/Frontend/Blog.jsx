import React from 'react'
import Header from './Common/Header'
import Footer from './Common/Footer'
import '../css/blog.css';


import king1 from '../image/section/Blog/Blog_image-1.webp';
import king2 from '../image/section/Blog/Blog_image-2.webp'
import king3 from '../image/section/Blog/Blog_image-3.webp'
import king4 from '../image/section/Blog/Blog_image-5.webp'
import king5 from '../image/section/Blog/Blog_image-6.webp'
import king6 from '../image/section/Blog/Blog_image-7.webp'
import { useNavigate } from 'react-router-dom';




const Blog = () => {  

    const navigate = useNavigate();

    const blogData = [
        { id: 1, title: "What Makes a Suite Stay Feel Comfortable, Not Complicated", img: king1 },
        { id: 2, title: "Planning a Relaxed Weekend Stay at Orrivaa", img: king2 },
        { id: 3, title: "Why Guests Choose the Signature Suite for Longer Stays", img: king3 },
        { id: 4, title: "Staying Productive While Traveling: Our Business-Friendly Rooms", img: king4 },
        { id: 5, title: "A Slow Afternoon at the Spa: What to Expect at Orrivaa", img: king5 },
        { id: 6, title: "Which Room at Orrivaa Fits Your Stay Best?", img: king6 },
    ];

    const handleCardClick = (post) => {
        navigate('/blog-details', { state: { post } }); 
    };

    return (
        <>
            <Header />
            {/* 1st section  */}

            <section className="blog-banner text-center d-flex flex-column justify-content-center">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-white">
                            <h1 className="blog-title serif mb-2">Blog</h1>
                            <div className="breadcrumb-wrapper">
                                <a href="/" className="text-white text-decoration-none small">Home</a>
                                <span className="separator mx-2 text-warning small">&gt;</span>
                                <span className="current-page text-white small">Blog</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>




            {/* 2nd Section: Blog Grid */}


           <section className="blog-content-section py-5">
                <div className="container">
                    <div className="row g-4">
                        {blogData.map((post) => (
                            <div 
                                className="col-lg-4 col-md-6" 
                                key={post.id} 
                                onClick={() => handleCardClick(post)} // ক্লিক করলে ডেটা পাঠাবে
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="blog-card h-100">
                                    <div className="blog-img-wrapper">
                                        <img src={post.img} alt={post.title} className="img-fluid" />
                                    </div>
                                    <div className="blog-info p-4 d-flex flex-column justify-content-between">
                                        <h4 className="blog-card-title mb-4">{post.title}</h4>
                                        <button className="read-more-btn-gold">Read More</button>
                                    </div>
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

export default Blog
