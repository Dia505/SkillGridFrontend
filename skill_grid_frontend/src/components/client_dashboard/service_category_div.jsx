import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function ServiceCategoryDiv({ serviceImg, serviceName, serviceList }) {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (serviceName.trim()) {
        navigate(`/search-freelancer/${encodeURIComponent(serviceName.trim())}`);
    }
};

  return (
    <>
      <div className="1175:w-[33.64vw] 921:w-[40vw] 800:w-[36vw] 589:w-[80vw] 500:w-[90vw] 1175:h-[15.06vw] 921:h-[19vw] 800:h-[22vw] 589:h-[35vw] 500:h-[40vw] bg-blue-700 flex rounded-xl justify-between pl-10">
        <div className="flex flex-col pt-7 gap-2">
          <p className="font-inter font-medium text-xl text-purple-50">{serviceName}</p>
          <div className="font-light text-sm text-blue-100">
            {serviceList.map((service, index) => (
              <p key={index}>{service}</p>
            ))}
          </div>
          <p className="font-light text-sm text-blue-100 hover:underline cursor-pointer" onClick={handleSearch}>Learn more</p>
        </div>

        <img className="w-1/2 object-cover rounded-r-xl" src={serviceImg} />
      </div>
    </>
  );
}

export default ServiceCategoryDiv;