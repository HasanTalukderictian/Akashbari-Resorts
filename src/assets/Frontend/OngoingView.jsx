import React from 'react';

// ইমেজ ইমপোর্ট সমূহ
import customer1 from '../image/section/Blog/Customer1.jpeg';
import customer2 from '../image/section/Blog/Customer2.jpeg';
import customer3 from '../image/section/Blog/Customer3.jpeg';
import customer4 from '../image/section/Blog/Customer4.jpeg';
import customer5 from '../image/section/Blog/Customer5.jpeg';
import customer6 from '../image/section/Blog/Customer6.jpg';

const OngoingView = () => {
  const images = [
    customer1, // Image 1 (Big Left)
    customer2, // Image 2
    customer3, // Image 3
    customer4, // Image 4
    customer5, // Image 5
    customer6  // Image 6 (Big Right)
  ];

  return (
    <div className="container my-5 project-view-container">
      <h3 className='text-center fw-bold'>Our Achievement</h3>
      <p className='text-center'>Some of our Customers</p>

      {/* 1st Div/Row: Left 50% Big, Right 50% Two Small */}
      <div className="row g-3 custom-project-row">
        
        {/* Left Side: 50% Width (col-md-6) */}
        <div className="col-md-6 big-img-col">
          <img 
            src={images[0]} 
            alt="Customer 1" 
            className="w-100 h-100 rounded" 
            style={{ objectFit: 'cover' }} 
          />
        </div>
        
        {/* Right Side: 50% Width, 2 Images Stacked */}
        <div className="col-md-6 stacked-img-col d-flex flex-column justify-content-between">
          <div className="small-img-wrapper pb-md-2">
            <img 
              src={images[1]} 
              alt="Customer 2" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div className="small-img-wrapper pt-md-2">
            <img 
              src={images[2]} 
              alt="Customer 3" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
        </div>

      </div>

      {/* 2nd Div/Row */}
      <div className="row g-3 mt-4 mt-md-5 custom-project-row">
        
        {/* Left Side: 50% Width, 2 Images Stacked */}
        <div className="col-md-6 stacked-img-col d-flex flex-column justify-content-between">
          <div className="small-img-wrapper pb-md-2">
            <img 
              src={images[3]} 
              alt="Customer 4" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div className="small-img-wrapper pt-md-2">
            <img 
              src={images[4]} 
              alt="Customer 5" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Right Side: 50% Width (col-md-6) */}
        <div className="col-md-6 big-img-col">
          <img 
            src={images[5]} 
            alt="Customer 6" 
            className="w-100 h-100 rounded" 
            style={{ objectFit: 'cover' }} 
          />
        </div>

      </div>

      {/* রেস্পন্সিভ ও ক্লিন লেআউট সিএসএস */}
      <style>
        {`
          /* ডেক্সটপ ও বড় স্ক্রিনের ডিফল্ট হাইট */
          .custom-project-row {
            height: 500px;
          }
          .big-img-col {
            height: 100%;
          }
          .stacked-img-col {
            height: 100%;
          }
          .small-img-wrapper {
            height: 50%;
          }

          /* মোবাইল ও ট্যাবলেট ডিভাইস (max-width: 768px) */
          @media (max-width: 768px) {
            .custom-project-row {
              height: auto !important;
            }
            
            /* প্রতিটি ইমেজ কন্টেইনার সমান আনুপাতিক হাইট পাবে */
            .big-img-col, 
            .small-img-wrapper {
              height: 280px !important;
              margin-bottom: 8px;
            }
            
            .stacked-img-col {
              height: auto !important;
            }

            /* মোবাইলে অপ্রয়োজনীয় এক্সট্রা প্যাডিং রিমুভ */
            .pb-md-2, .pt-md-2 {
              padding: 0 !important;
            }

            img {
              object-fit: cover;
              border-radius: 8px !important;
            }
          }
          
          /* খুব ছোট মোবাইল স্ক্রিন (max-width: 480px) */
          @media (max-width: 480px) {
            .big-img-col, 
            .small-img-wrapper {
              height: 220px !important;
            }
            
            h3 {
              font-size: 22px;
            }
          }
          
          /* মাঝারি স্ক্রিন বা ট্যাবলেট (769px - 1024px) */
          @media (min-width: 769px) and (max-width: 1024px) {
            .custom-project-row {
              height: 400px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OngoingView
