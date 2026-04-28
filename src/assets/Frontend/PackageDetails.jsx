import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Footer from './Common/Footer';
import Header from './Common/Header';

const PackageDetails = () => {
    const { id } = useParams(); // URL থেকে আইডি পাওয়ার জন্য
    const location = useLocation();
    const pkg = location.state?.packageData; // Investment কার্ড থেকে পাঠানো ডাটা

    // যদি সরাসরি লিঙ্কে ঢুকে ডাটা না পায়
    if (!pkg) {
        return (
            <div className="text-center py-5">
                <h3>Package details not found!</h3>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="container py-5 mt-5">
                <div className="row">
                    <div className="col-lg-6">
                        {/* এখানে আপনি প্যাকেজের ইমেজ দিতে পারেন */}
                        <div className="bg-light rounded-4 p-5 text-center shadow-sm">
                            <h1 className="display-4 fw-bold text-primary">{pkg.title}</h1>
                            <p className="badge bg-warning text-dark fs-6">Package ID: {id}</p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h2 className="fw-bold mb-3">Investment Details</h2>
                        <h3 className="text-success mb-4">Price: ৳BDT {pkg.price}</h3>
                        
                        <div className="card border-0 shadow-sm p-4 rounded-4">
                            <ul className="list-unstyled">
                                <li className="mb-2"><strong>Land Area:</strong> {pkg.land}</li>
                                <li className="mb-2"><strong>Building Size:</strong> {pkg.building}</li>
                                <li className="mb-2"><strong>Total Space:</strong> {pkg.totalSize}</li>
                                <li className="mb-2"><strong>Discount:</strong> ৳BDT {pkg.discount}</li>
                            </ul>
                            <hr />
                            <p className="text-muted">{pkg.description}</p>
                            <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold">
                                PROCEED TO INVEST
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PackageDetails;