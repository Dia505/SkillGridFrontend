import { useEffect, useState } from "react";

function SearchResult({ freelancer }) {
    const skills = freelancer.skills.split(",").map(skill => skill.trim());
    const [imageIndexes, setImageIndexes] = useState({});
    const [portfolioImages, setPortfolioImages] = useState([]);
    const maxSkills = 4;

    const fetchFreelancerPortfolioImages = async (freelancerId) => {
        const response = await fetch(`http://localhost:3000/api/portfolio/freelancer/${freelancerId}`);
        return response.json();
    };

    const fetchFreelancerServices = async (freelancerId) => {
        const response = await fetch(`http://localhost:3000/api/freelancer-service/freelancer/${freelancerId}`);
        return response.json();
    };

    const fetchFreelancerRatings = async (freelancerId) => {
        const response = await fetch(`http://localhost:3000/api/review/freelancer/${freelancerId}`)
        return response.json();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const portfolioImages = await fetchFreelancerPortfolioImages(freelancer._id);
                const recentImages = portfolioImages
                    .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
                    .slice(0, 3)
                    .flatMap(imageObj => imageObj.file_path);

                const services = await fetchFreelancerServices(freelancer._id);
                const validServices = Array.isArray(services) ? services : [];
                const serviceRates = validServices.map(service => service.hourly_rate);
                const lowestHourlyRate = serviceRates.length > 0 ? Math.min(...serviceRates) : 0;

                // Update freelancer object directly with lowestHourlyRate
                freelancer.lowestHourlyRate = lowestHourlyRate;

                const ratings = await fetchFreelancerRatings(freelancer._id);
                const avgRating = ratings.reduce((acc, review) => acc + review.rating, 0) / ratings.length || 0;
                freelancer.avgRating = avgRating;

                setImageIndexes(prev => ({ ...prev, [freelancer._id]: 0 }));
                setPortfolioImages(recentImages);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [freelancer._id]);

    useEffect(() => {
        if (portfolioImages.length === 0) return;

        const interval = setInterval(() => {
            setImageIndexes(prevIndexes => {
                const newIndexes = { ...prevIndexes };
                if (portfolioImages.length > 0) {
                    newIndexes[freelancer._id] = (prevIndexes[freelancer._id] + 1) % portfolioImages.length;
                }
                return newIndexes;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [portfolioImages]);

    const remainingSkillsCount = skills.length > maxSkills ? skills.length - maxSkills : 0;

    return (
        <div className="flex flex-col pt-8 pl-14 items-center gap-10">
            <div className="flex justify-between w-[687px] items-center">
                <div className="flex gap-5">
                    <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-purple-700">
                        <img
                            src={`http://localhost:3000/freelancer_images/${freelancer.profile_picture}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-lg font-bold font-inter">
                            {`${freelancer.first_name} ${freelancer.last_name}`}
                        </p>
                        <p className="text-base font-inter">{freelancer.profession}</p>
                        <p className="text-sm text-grey-500 font-inter">
                            {`${freelancer.address}, ${freelancer.city}`}
                        </p>
                    </div>
                </div>

                {/* Display lowest rate */}
                <p className="text-base font-inter">{`From Rs. ${freelancer.lowestHourlyRate}/hr`}</p>
            </div>

            {/* Portfolio Image Section */}
            <div className="w-[350px] h-[200px] rounded-xl overflow-hidden relative">
                {portfolioImages.length > 0 ? (
                    portfolioImages.map((img, index) => (
                        <img
                            key={index}
                            className={`w-full h-full object-cover absolute transition-opacity duration-1000 ease-in-out 
                                ${index === imageIndexes[freelancer._id] ? "opacity-100" : "opacity-0"}`}
                            src={img}
                            alt="Portfolio"
                        />
                    ))
                ) : (
                    <p>No portfolio images available</p>
                )}
            </div>

            {/* Skills Section */}
            <div className="w-[550px] flex flex-wrap gap-3">
                {skills.slice(0, maxSkills).map((skill, index) => (
                    <div
                        key={index}
                        className="flex bg-purple-100 rounded-3xl items-center justify-center pt-2 pl-4 pr-4 pb-2"
                    >
                        <p className="text-grey-700">{skill}</p>
                    </div>
                ))}
                {remainingSkillsCount > 0 && (
                    <div className="flex bg-purple-100 rounded-3xl items-center justify-center pt-2 pl-4 pr-4 pb-2">
                        <p className="text-grey-700">+{remainingSkillsCount} more</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResult;
