import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/video.css'; 

const Video = () => {
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/get-videos`);
                if (res.data.success && res.data.data.length > 0) {
                    // এপিআই থেকে প্রথম ভিডিও ডাটাটি নেওয়া হচ্ছে
                    setVideoData(res.data.data[0]);
                }
            } catch (err) {
                console.error("Video Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, []);

    // ইউটিউব লিঙ্ককে এমবেড লিঙ্কে কনভার্ট করার ফাংশন
    const getEmbedUrl = (url) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) 
            ? `https://www.youtube.com/embed/${match[2]}` 
            : url;
    };

    if (loading) {
        return <div className="text-center py-5">Loading Video Section...</div>;
    }

    if (!videoData) {
        return null; // ডাটা না থাকলে সেকশনটি দেখাবে না
    }

    return (
        <section className="video-section py-5" style={{ backgroundColor: 'rgb(248, 249, 252)' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* Top Header Section */}
                <div className="text-center mb-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="mx-auto mb-3"></div>
                            {/* ডাইনামিক টাইটেল */}
                            <p className="gateway-text mb-2" style={{ fontSize: '1.8rem', fontWeight: '500', color: '#5e2e10' }}>{videoData.title}</p>
                            {/* ডাইনামিক ডেসক্রিপশন */}
                            <h5 className="video-subtext text-muted" style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>
                                {videoData.description.length > 200 
                                    ? `${videoData.description.substring(0, 200)}...` 
                                    : videoData.description}
                            </h5>
                        </div>
                    </div>
                </div>

                {/* Video Section - Full Width */}
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="video-wrapper shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden', width: '100%' }}>
                            <div className="ratio ratio-16x9" style={{ width: '100%' }}>
                                <iframe 
                                    src={getEmbedUrl(videoData.video_url || videoData.videoUrl)} 
                                    title={videoData.title} 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ width: '100%', height: '100%', border: 'none' }}
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