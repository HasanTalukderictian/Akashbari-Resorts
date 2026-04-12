import React from 'react';
import '../css/Investment.css'; // নিচের CSS ফাইলটি তৈরি করে এখানে ইম্পোর্ট করুন

const Investment = () => {
    // এই ডাটাগুলো আপনি পরবর্তীতে JSON API থেকে লোড করতে পারবেন
    const packages = [
        {
            id: 1,
            title: "SUPERIOR DELUXE",
            price: "299,900",
            discount: "50,000",
            land: "14 sft",
            building: "11 sft",
            totalSize: "328 sft",
            description: "Entry-level investment package with land, building space, and amenities.",
            isPopular: true,
            isSoldOut: false
        },
        {
            id: 2,
            title: "PREMIUM SUITES",
            price: "399,900",
            discount: "60,000",
            land: "26 sft",
            building: "22 sft",
            totalSize: "430 sft",
            description: "Mid-tier investment with enhanced space and premium benefits.",
            isPopular: false,
            isSoldOut: false
        },
        {
            id: 3,
            title: "VILLA",
            price: "",
            discount: "",
            land: "",
            building: "",
            totalSize: "",
            description: "",
            isPopular: false,
            isSoldOut: true
        },
        {
            id: 4,
            title: "PRESIDENTIAL SUITES",
            price: "599,900",
            discount: "1,00,000",
            land: "38 sft",
            building: "31 sft",
            totalSize: "1,710 sft",
            description: "Elite investment package with maximum space and exclusive.",
            isPopular: false,
            isSoldOut: false
        }
    ];

    return (
        <section className="investment-section py-5">
            <div className="container text-center">
                <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
                <h1 className="main-title mb-2">RESORT INVESTMENT PACKAGES</h1>
                <div className="yellow-divider mx-auto mb-4"></div>
                <p className="sub-text mb-5">Become a partner in Bangladesh's premier luxury resort destination</p>

                <div className="row g-4 justify-content-center">
                    {packages.map((pkg) => (
                        <div className="col-lg-3 col-md-6" key={pkg.id}>
                            <div className={`investment-card ${pkg.isPopular ? 'popular-border' : ''}`}>
                                
                                {pkg.isPopular && (
                                    <div className="popular-badge">
                                        <span>★ MOST POPULAR ★</span>
                                    </div>
                                )}

                                <div className="card-content d-flex flex-column h-100">
                                    <h3 className="pkg-title mt-4">{pkg.title}</h3>

                                    {pkg.isSoldOut ? (
                                        <div className="sold-out-container my-auto">
                                            <div className="sold-out-btn">SOLD OUT</div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="pkg-price">৳BDT {pkg.price}</h2>
                                            <p className="pkg-discount">Discount: ৳BDT {pkg.discount}</p>

                                            <ul className="pkg-features text-start ps-4 mt-3">
                                                <li><strong>Land:</strong> {pkg.land}</li>
                                                <li><strong>Building:</strong> {pkg.building}</li>
                                                <li><strong>Total Room Size:</strong> {pkg.totalSize}</li>
                                                <li>+ Amenities</li>
                                            </ul>

                                            <p className="pkg-desc px-3 mt-3">{pkg.description}</p>
                                        </>
                                    )}

                                    <button className={`inquire-btn mt-auto ${pkg.isPopular ? 'popular-btn' : pkg.isSoldOut ? 'sold-out-footer' : ''}`}>
                                        INQUIRE NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Investment;