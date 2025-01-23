import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function ServiceCategoryDiv({ serviceImg, serviceName, serviceList }) {
  const [jobCategoryData, setJobCategoryData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobCategoryData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/freelancer/job-category/${serviceName}`); 
        setJobCategoryData(response.data);
      } catch (error) {
        console.error('Error fetching job category data:', error);
      }
    };

    fetchJobCategoryData();
  }, [serviceName]); // Re-fetch data when serviceName changes

  const handleServiceClick = () => {
    console.log('Service clicked:', serviceName);
    navigate(`/search-freelancer?jobCategory=${serviceName}`);
  };

  return (
    <>
      <div className="w-[515px] h-[200px] bg-blue-700 flex rounded-xl justify-between pl-10">
        <div className="flex flex-col pt-7 gap-2">
          <p className="font-inter font-medium text-xl text-purple-50">{serviceName}</p>
          <div className="font-light text-sm text-blue-100">
            {serviceList.map((service, index) => (
              <p key={index}>{service}</p>
            ))}
          </div>
          <p className="font-light text-sm text-blue-100 hover:underline cursor-pointer" onClick={handleServiceClick}>Learn more</p>
        </div>

        <img className="w-1/2 object-cover rounded-r-xl" src={serviceImg} />
      </div>
    </>
  );
}

export default ServiceCategoryDiv;