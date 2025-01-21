import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

function TopRatedFreelancer() {
    const [topFreelancers, setTopFreelancers] = useState([]);
    const [imageIndexes, setImageIndexes] = useState({}); // Initialize image index state

    // Fetch freelancers by rating
    const fetchFreelancersByRating = async (rating) => {
        const response = await fetch(`http://localhost:3000/api/review/rating/${rating}`);
        return response.json();
    };

    // Fetch freelancer portfolio images
    const fetchFreelancerPortfolioImages = async (freelancerId) => {
        const response = await fetch(`http://localhost:3000/api/portfolio/freelancer/${freelancerId}`);
        return response.json();
    };

    // Fetch freelancer services
    const fetchFreelancerServices = async (freelancerId) => {
        const response = await fetch(`http://localhost:3000/api/freelancer-service/freelancer/${freelancerId}`);
        return response.json();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const freelancers = await fetchFreelancersByRating(5);
                const uniqueFreelancers = new Set();

                const freelancerWithRates = await Promise.all(
                    freelancers.map(async (freelancer) => {
                        if (uniqueFreelancers.has(freelancer.freelancer_id._id)) {
                            return null;
                        }
                        uniqueFreelancers.add(freelancer.freelancer_id._id);

                        // Fetch portfolio images
                        const portfolioImages = await fetchFreelancerPortfolioImages(freelancer.freelancer_id._id);

                        // Sort images by upload date and take the 3 most recent
                        const recentImages = portfolioImages
                            .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
                            .slice(0, 3) // Get the 3 most recent
                            .flatMap(imageObj => imageObj.file_path); // Flatten the file_path array

                        // Fetch freelancer services and determine the lowest rate
                        const services = await fetchFreelancerServices(freelancer.freelancer_id._id);
                        // Make sure services is an array, even if the response is empty or null
                        const validServices = Array.isArray(services) ? services : [];
                        // Safely find the lowest rate
                        const serviceRates = validServices.map(service => service.hourly_rate);
                        const lowestRate = serviceRates.length > 0 ? Math.min(...serviceRates) : 0; // Default to 0 if no rates exist

                        return { ...freelancer, portfolioImages: recentImages, lowestRate };

                    })
                );

                const filteredFreelancers = freelancerWithRates.filter(Boolean);
                setTopFreelancers(filteredFreelancers);

                // Initialize image index state
                const initialIndexes = {};
                filteredFreelancers.forEach(freelancer => {
                    initialIndexes[freelancer.freelancer_id._id] = 0;
                });
                setImageIndexes(initialIndexes);

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    // Auto-change images every 3s
    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndexes((prevIndexes) => {
                const newIndexes = { ...prevIndexes };
                topFreelancers.forEach(freelancer => {
                    if (freelancer.portfolioImages.length > 0) {
                        newIndexes[freelancer.freelancer_id._id] =
                            (prevIndexes[freelancer.freelancer_id._id] + 1) % freelancer.portfolioImages.length;
                    }
                });
                return newIndexes;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [topFreelancers]);

    return (
        <div className="flex flex-wrap gap-4">
            {topFreelancers.map((freelancer) => (
                <div
                    key={freelancer.freelancer_id._id}
                    className="w-[312px] h-[297px] bg-white rounded-xl flex flex-col gap-4"
                >
                    <div className="w-full h-[150px] rounded-t-xl overflow-hidden relative">
                        {/* Carousel */}
                        <div className="w-full h-full absolute">
                            {freelancer.portfolioImages.length > 0 && freelancer.portfolioImages.map((img, index) => (
                                <img
                                    key={index}
                                    className={`w-full h-full object-cover absolute transition-opacity duration-1000 ease-in-out 
            ${index === imageIndexes[freelancer.freelancer_id._id] ? "opacity-100" : "opacity-0"}`}
                                    src={img}
                                    alt="Portfolio"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 ml-2">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={`http://localhost:3000/freelancer_images/${freelancer.freelancer_id.profile_picture}`}
                                alt="Profile"
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-lg">
                                {freelancer.freelancer_id.first_name} {freelancer.freelancer_id.last_name}
                            </p>
                            <p className="text-base text-grey-500">{freelancer.freelancer_id.profession}</p>
                            <p className="text-base font-inter">⭐⭐⭐⭐⭐</p>
                            <p className="text-base">From Rs. {freelancer.lowestRate}/hr</p>
                        </div>

                        <button className="h-[40px] w-[40px] bg-purple-400 rounded-lg justify-center items-center flex mt-16">
                            <ChevronRightIcon className="w-7 h-7 text-purple-50" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TopRatedFreelancer;
