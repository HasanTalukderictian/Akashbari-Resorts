import React from 'react';

const Terms = () => {
  const brandColor = "#5e2e10";

  return (
    <div className="bg-light min-vh-100 py-md-5">
      {/* maxWidth কে ৯০০ থেকে বাড়িয়ে ১১০০ করা হয়েছে */}
      <div className="container-fluid shadow-lg bg-white p-0 rounded-3 overflow-hidden" style={{ maxWidth: '1275px' }}>
        
        {/* Header Section */}
        <div style={{ backgroundColor: brandColor }} className="text-white p-5 pb-4">
          <div className="border-top border-white-50 pt-4 mt-2">
            <h1 className="display-3 fw-bold mb-0">Terms And Conditions Contract</h1>
          </div>

          <div className="border-top border-white-50 mt-5 pt-3 d-flex flex-wrap justify-content-between small opacity-75">
            <span>🌐 www.techchainstrategies.com</span>
            <span>📷 @techchain_strategies</span>
            <span>📞 210-788-8829</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          
          {/* Section 1 */}
          <div className="mb-5">
            <h5 className="fw-bold d-flex align-items-center mb-3" style={{ color: brandColor }}>
              <span className="rounded-circle me-2" style={{ width: '15px', height: '15px', backgroundColor: brandColor }}></span>
              The Agreement
            </h5>
            <hr className="mb-4" />
            <p className="text-dark opacity-75 lh-base">
              This Service Agreement ("Contract") is made and entered into as of <strong>September 1, 2028</strong>, 
              by and between <strong>TechChain Strategies</strong> ("Service Provider") and <strong>Samantha Rachel</strong> 
              ("Client"). By engaging the services of TechChain Strategies, the Client agrees to be bound by the terms 
              and conditions outlined in this Agreement.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-5">
            <h5 className="fw-bold d-flex align-items-center mb-3" style={{ color: brandColor }}>
              <span className="rounded-circle me-2" style={{ width: '15px', height: '15px', backgroundColor: brandColor }}></span>
              User Obligations
            </h5>
            <hr className="mb-4" />
            <ul className="list-unstyled ps-4">
              <li className="mb-2">
                <strong>• Accurate Information:</strong> The Client must provide correct information.
              </li>
              <li className="mb-2">
                <strong>• Compliance:</strong> The Client must follow laws and regulations.
              </li>
              <li className="mb-2">
                <strong>• Use of Services:</strong> The Client will use TechChain Strategies' services only for lawful purposes and as outlined in this Agreement.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-5">
            <h5 className="fw-bold d-flex align-items-center mb-3" style={{ color: brandColor }}>
              <span className="rounded-circle me-2" style={{ width: '15px', height: '15px', backgroundColor: brandColor }}></span>
              Product/Service Details
            </h5>
            <hr className="mb-4" />
            <p className="mb-3 opacity-75">TechChain Strategies offers the following services:</p>
            <ul className="list-unstyled ps-4">
              <li className="mb-1">• IT consulting</li>
              <li className="mb-1">• Software development</li>
              <li className="mb-1">• Cybersecurity solutions</li>
              <li className="mb-1">• Technical support</li>
              <li className="mb-1">• Custom IT solutions</li>
            </ul>
          </div>

          {/* Page Number */}
          <div className="text-end mt-5 pt-5 text-muted">
            <small>1</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;