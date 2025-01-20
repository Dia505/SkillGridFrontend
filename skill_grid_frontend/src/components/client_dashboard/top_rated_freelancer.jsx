import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

function TopRatedFreelancer() {
    const [topFreelancers, setTopFreelancers] = useState([]);

    // Fetch top-rated freelancers with rating 5
    const fetchFreelancersByRating = async (rating) => {
        const response = await fetch(`http://localhost:3000/api/review/rating/${rating}`);
        return response.json();
    };

    // Fetch freelancer portfolio images
    const fetchFreelancerPortfolioImages = async (freelancerId) => {
        const response = await fetch(`http://localhost:3000/api/portfolio/freelancer/${freelancerId}`);
        return response.json();
    };

    // Fetch top-rated freelancers and their portfolio images
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

                        // Fetch portfolio images for the freelancer
                        const portfolioImages = await fetchFreelancerPortfolioImages(freelancer.freelancer_id._id);
                        
                        // Sort images by upload date and take the 3 most recent
                        const recentImages = portfolioImages
                            .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
                            .slice(0, 3);

                        return { ...freelancer, portfolioImages: recentImages };
                    })
                );
                setTopFreelancers(freelancerWithRates.filter(Boolean));
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-wrap gap-4">
            {topFreelancers.map((freelancer) => (
                <div
                    key={freelancer.freelancer_id._id}
                    className="w-[312px] h-[297px] bg-white rounded-xl flex flex-col gap-4"
                >
                    <div className="w-full h-[150px] rounded-t-xl bg-red-500 overflow-hidden relative">
                        {/* Carousel */}
                        <div className="w-full h-full absolute">
                            {freelancer.portfolioImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`w-full h-full absolute bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'} ${index === 1 ? 'opacity-100 delay-3000' : ''} ${index === 2 ? 'opacity-100 delay-6000' : ''}`}
                                    style={{
                                        backgroundImage: `url(${image.file_path})`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 ml-2">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={freelancer.profile_picture}
                                alt="Profile"
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-lg">
                                {freelancer.freelancer_id.first_name} {freelancer.freelancer_id.last_name}
                            </p>
                            <p className="text-base text-grey-500">{freelancer.freelancer_id.profession}</p>
                            <p className="text-base font-inter">⭐ {freelancer.rating}</p>
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
