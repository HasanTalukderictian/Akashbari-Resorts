import React from 'react';

// ইমেজ ইমপোর্ট সমূহ
import customer1 from '../image/section/Blog/Customer1.jpeg';
import customer2 from '../image/section/Blog/Customer2.jpeg';
import customer3 from '../image/section/Blog/Customer3.jpeg';
import customer4 from '../image/section/Blog/Customer4.jpeg';
import customer5 from '../image/section/Blog/Customer5.jpeg';
import customer6 from '../image/section/Blog/Customer6.jpg';

const ProjectView = () => {
  const images = [
    customer1, // Image 1 (Big Left)
    customer2, // Image 2
    customer3, // Image 3
    customer4, // Image 4
    customer5, // Image 5
    customer6  // Image 6 (Big Right)
  ];

  return (
    <div className="container my-5">
      {/* টাইটেলটি row এর বাইরে রাখলে লেআউট নিখুঁত থাকবে */}
      <h3 className='text-center  fw-bold'>On going Hotel and Resorts</h3>
      <p className='text-center'>Under Developmemnt view</p>

      {/* 1st Div/Row: Left 50% Big, Right 50% Two Small */}
      <div className="row g-3" style={{ height: '500px' }}>
        
        {/* Left Side: 50% Width (col-md-6) */}
        <div className="col-md-6 h-100">
          <img 
            src={images[0]} 
            alt="Customer 1" 
            className="w-100 h-100 rounded" 
            style={{ objectFit: 'cover' }} 
          />
        </div>
        
        {/* Right Side: 50% Width, 2 Images Stacked */}
        <div className="col-md-6 h-100 d-flex flex-column justify-content-between">
          <div className="h-50 pb-2">
            <img 
              src={images[1]} 
              alt="Customer 2" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div className="h-50 pt-2">
            <img 
              src={images[2]} 
              alt="Customer 3" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
        </div>

      </div>

      {/* 2nd Div/Row: mt-5 ক্লাস দিয়ে মাঝে মার্জিন বাড়ানো হয়েছে */}
      <div className="row g-3 mt-5" style={{ height: '500px' }}>
        
        {/* Left Side: 50% Width, 2 Images Stacked */}
        <div className="col-md-6 h-100 d-flex flex-column justify-content-between">
          <div className="h-50 pb-2">
            <img 
              src={images[3]} 
              alt="Customer 4" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div className="h-50 pt-2">
            <img 
              src={images[4]} 
              alt="Customer 5" 
              className="w-100 h-100 rounded" 
              style={{ objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Right Side: 50% Width (col-md-6) */}
        <div className="col-md-6 h-100">
          <img 
            src={images[5]} 
            alt="Customer 6" 
            className="w-100 h-100 rounded" 
            style={{ objectFit: 'cover' }} 
          />
        </div>

      </div>
    </div>
  );
};

export default ProjectView;