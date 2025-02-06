import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../../../components/footer";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";

function FreelancerProfileClientView() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

    const { _id } = useParams();

    const [freelancer, setFreelancer] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [education, setEducation] = useState([]);
    const [employment, setEmployment] = useState([]);
    const [review, setReview] = useState([]);
    const [service, setService] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [portfolioImages, setPortfolioImages] = useState([]);

    const navigate = useNavigate();

    const [imageIndexes, setImageIndexes] = useState(() => {
        const initialIndexes = {};
        portfolioImages.forEach(portfolio => {
            initialIndexes[portfolio.serviceId] = 0; // Initialize index for each service
        });
        return initialIndexes;
    });

    let isTokenValid = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                isTokenValid = true;
            } else {
                localStorage.removeItem("authData");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("authData"); // Remove invalid token
        }
    }

    useEffect(() => {
        if (!_id) return; // ✅ Prevents API call if ID is undefined

        async function fetchFreelancer() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer/${_id}`);
                if (!response.ok) throw new Error("Freelancer not found");

                const data = await response.json();
                setFreelancer(data);
                console.log("Fetched Freelancer Data:", data);
            } catch (error) {
                console.error("Error fetching freelancer:", error);
            }
        }

        fetchFreelancer();

        function fetchFreelancerBookings() {
            try {
                fetch(`http://localhost:3000/api/appointment/freelancer/${_id}`)
                    .then(response => response.json())
                    .then(data => setAppointments(data))
                    .catch(error => console.error("Error fetching appointments:", error));
            }
            catch (error) {
                console.error("Error fetching appointments:", error);
            }
        }

        fetchFreelancerBookings();

        async function fetchFreelancerEducation() {
            try {
                const response = await fetch(`http://localhost:3000/api/education/freelancer/${_id}`);
                const data = await response.json();
                setEducation(data);
            }
            catch {
                console.error("Error fetching freelancer education:", error);
            }
        }

        fetchFreelancerEducation();

        async function fetchFreelancerEmployment() {
            try {
                const response = await fetch(`http://localhost:3000/api/employment/freelancer/${_id}`);
                const data = await response.json();
                setEmployment(data);
            }
            catch {
                console.error("Error fetching freelancer employment:", error);
            }
        }

        fetchFreelancerEmployment();

        async function fetchFreelancerReviews() {
            try {
                const response = await fetch(`http://localhost:3000/api/review/freelancer/${_id}`);
                const data = await response.json();
                setReview(data);
            }
            catch {
                console.error("Error fetching freelancer reviews:", error);
            }
        }

        fetchFreelancerReviews();

        async function fetchFreelancerService() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer-service/freelancer/${_id}`);
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const allPortfolioImages = [];

                    for (const service of data) {
                        const freelancerServiceId = service._id;

                        const portfolioResponse = await fetch(`http://localhost:3000/api/portfolio/freelancer-service/${freelancerServiceId}`);
                        const portfolioData = await portfolioResponse.json();
                        allPortfolioImages.push({ serviceId: freelancerServiceId, images: portfolioData[0].file_path });
                    }

                    setService(data);
                    setPortfolioImages(allPortfolioImages);

                } else {
                    console.error("No freelancer service data found");
                }
            } catch (error) {
                console.error("Error fetching freelancer service:", error);
            }
        }


        fetchFreelancerService();
    }, [_id]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push("⭐");
        }
        return stars;
    };

    const prevService = () => {
        const newIndex = currentIndex === 0 ? service.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setImageIndexes(prevIndexes => {
            const newIndexes = { ...prevIndexes };
            newIndexes[service[newIndex].service_id] = 0;
            return newIndexes;
        });
    };

    const nextService = () => {
        const newIndex = currentIndex === service.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setImageIndexes(prevIndexes => {
            const newIndexes = { ...prevIndexes };
            newIndexes[service[newIndex].service_id] = 0;
            return newIndexes;
        });
    };

    useEffect(() => {
        if (!portfolioImages.length) return;

        const interval = setInterval(() => {
            setImageIndexes(prevIndexes => {
                const newIndexes = { ...prevIndexes };

                portfolioImages.forEach(portfolio => {
                    const freelancerServiceId = portfolio.serviceId;
                    const currentIndex = prevIndexes[freelancerServiceId] ?? 0;
                    newIndexes[freelancerServiceId] = (currentIndex + 1) % portfolio.images.length;
                });

                return newIndexes;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [portfolioImages]);

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                {freelancer && (
                    <div className="flex flex-col mt-[90px] pl-40 pr-40 pt-10 pb-20 gap-16">
                        <div className="flex flex-col border-2 border-grey-500 rounded-xl">
                            <div className="w-full h-[180px] overflow-hidden rounded-t-xl relative">
                                <img
                                    src={`http://localhost:3000/freelancer_images/${freelancer.background_picture}`}
                                    className="w-full h-full object-cover"
                                    alt="Freelancer Background"
                                />
                            </div>

                            <div className="flex bg-purple-50 pl-16 pr-16 pt-5 justify-between items-center">
                                <div className='flex gap-6'>
                                    <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
                                        <img
                                            src={`${freelancer.profile_picture}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="text-[22px] font-bold">{`${freelancer.first_name} ${freelancer.last_name}`}</p>
                                        <p className="text-xl">{`${freelancer.profession}`}</p>

                                        <div className="flex gap-2">
                                            <PhoneIcon className="h-5 text-grey-400" />
                                            <p className="text-sm text-grey-500">{`${freelancer.mobile_no}`}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <MapPinIcon className="h-5 text-grey-400" />
                                            <p className="text-sm text-grey-500">{`${freelancer.address}, ${freelancer.city}`}</p>
                                        </div>
                                    </div>
                                </div>

                                {isTokenValid ?
                                    <button className='w-[240px] h-[46px] bg-purple-300 rounded-xl text-white font-bold' 
                                    onClick={() => {
                                        console.log("Navigating with Freelancer ID:", _id);
                                        navigate("/send-an-offer", { state: { freelancerId: _id } });
                                      }}>
                                            Book an Appointment
                                    </button>
                                    : <div className="flex flex-col items-center gap-2">
                                        <p className="text-xl font-semibold">Ready to work with {`${freelancer.first_name}`}?</p>
                                        <button className='w-[240px] h-[46px] bg-purple-300 rounded-xl text-white font-bold' onClick={() => navigate("/client-registration")}>Sign up</button>
                                        <div className="flex gap-2">
                                            <p className="font-inter font-light text-sm">Already have an account?</p>
                                            <p className="text-sm font-caprasimo text-purple-700 hover:underline cursor-pointer" onClick={() => navigate("/login")}>Log In</p>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="w-full h-0.5 bg-grey-500 mt-9"></div>

                            <div className="flex">
                                <div className='flex flex-col pt-5'>
                                    <div className='flex gap-14 pb-5 pl-8 pr-14'>
                                        <div className='flex items-center gap-2'>
                                            <img className='h-10' src="/freelancer_profile_bookings.png" />
                                            <div className='flex flex-col items-center'>
                                                <p className='text-xl'>{appointments.length}</p>
                                                <p className='text-grey-500'>bookings</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <img className='h-11' src="/freelancer_profile_experience.png" />
                                            <div className='flex flex-col items-center'>
                                                <p className='text-xl'>{`${freelancer.years_of_experience} years`}</p>
                                                <p className='text-grey-500'>experience</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>

                                    <div className='flex flex-col pt-5 pb-5 pl-8 pr-8 gap-2'>
                                        <p className='text-[22px] font-bold'>Education</p>

                                        <div className='flex flex-col gap-4'>
                                            {education.length > 0 ? (
                                                education.map((education, index) => (
                                                    <div key={index} className='flex flex-col'>
                                                        <p className="text-lg">{education.degree_title}</p>
                                                        <p className="text-sm text-grey-500">{education.institution_name}</p>
                                                        <p className="text-sm text-grey-500">
                                                            {new Date(education.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} -
                                                            {new Date(education.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No education details available</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>

                                    <div className='flex flex-col pt-5 pb-5 pl-8 pr-8 gap-2'>
                                        <p className='text-[22px] font-bold'>Employment</p>

                                        <div className='flex flex-col gap-8'>
                                            {employment.length > 0 ? (
                                                employment.map((employment, index) => (
                                                    <div key={index} className='flex flex-col gap-1'>
                                                        <p className="text-lg">{employment.job_title} | {employment.company_name}</p>
                                                        <p className="text-sm text-grey-500">
                                                            {new Date(employment.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} -
                                                            {employment.end_date
                                                                ? new Date(employment.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                                                : 'Present'}
                                                        </p>
                                                        <div className='w-[270px]'>
                                                            <p className="text-sm text-grey-500">{employment.description}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No employment details available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-0.5 h-full bg-grey-500"></div>

                                <div className='flex flex-col'>
                                    <div className='pl-8 pt-8 pb-8'>
                                        <p>{`${freelancer.bio}`}</p>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>

                                    <div className='flex flex-col pl-8 pt-5 pb-14 gap-4'>
                                        <p className='text-[22px] font-bold'>Services</p>

                                        <div className='relative flex items-center'>
                                            {service.length > 0 ? (
                                                <div className="transition-all duration-500 ease-in-out transform">
                                                    <div
                                                        key={currentIndex}
                                                        className='w-[580px] h-[350px] flex flex-col gap-6 rounded-xl border-2 border-grey-500 ml-28 py-10 pl-8'
                                                    >
                                                        <div className='flex justify-between items-center'>
                                                            <p className='text-purple-400 text-xl font-bold font-inter'>
                                                                {currentIndex + 1}. {service[currentIndex].service_id.service_name}
                                                            </p>
                                                            <div className='flex bg-purple-700 w-[182px] h-[40px] rounded-l-xl text-white font-bold font-inter justify-center items-center'>
                                                                Rs. {service[currentIndex].hourly_rate}/hr
                                                            </div>
                                                        </div>

                                                        <div className="w-[350px] h-[200px] rounded-xl overflow-hidden relative ml-20">
                                                            {portfolioImages.length > 0 ? (
                                                                portfolioImages.map((portfolio) => {
                                                                    if (portfolio.serviceId === service[currentIndex]._id) {
                                                                        return portfolio.images.map((image, imgIndex) => (
                                                                            <img
                                                                                key={imgIndex}
                                                                                className={`w-full h-full object-cover absolute transition-opacity duration-1000 ease-in-out
                                            ${imgIndex === imageIndexes[portfolio.serviceId] ? "opacity-100" : "opacity-0"}`}
                                                                                src={image}
                                                                                alt="Portfolio"
                                                                            />
                                                                        ));
                                                                    }
                                                                    return null;
                                                                })
                                                            ) : (
                                                                <p>No portfolio images available</p>
                                                            )}
                                                        </div>


                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No service details available</p>
                                            )}
                                            <button
                                                className="absolute left-12 border border-purple-700 rounded-full"
                                                onClick={prevService}
                                            >
                                                <ChevronLeftIcon className='h-8 text-purple-700' />
                                            </button>

                                            {/* Next Button */}
                                            <button
                                                className="absolute right-16 border border-purple-700 rounded-full"
                                                onClick={nextService}
                                            >
                                                <ChevronRightIcon className='h-8 text-purple-700' />
                                            </button>
                                        </div>

                                        {/* Carousel Indicator */}
                                        <div className="flex justify-center mt-4 space-x-2">
                                            {service.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentIndex(index)}
                                                    className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? "bg-purple-400 w-4" : "bg-grey-400"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>

                                    <div className='flex flex-col pl-8 pt-5 pb-5 gap-5'>
                                        <p className='text-[22px] font-bold'>Reviews</p>

                                        <div className='flex flex-col gap-8'>
                                            {review.length > 0 ? (
                                                review.map((review, index) => (
                                                    <div key={index} className='flex flex-col gap-1'>
                                                        <p className='text-purple-400 text-lg'>{review.appointment_id.appointment_purpose}</p>
                                                        <p className='text-sm font-inter'>
                                                            {renderStars(review.rating)} {review.rating}
                                                            <span className='px-2'>|</span>
                                                            <span className='text-grey-700'>
                                                                {new Date(review.review_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </span>
                                                        </p>
                                                        <p>"{review.review}"</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No reviews available</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>

                                    <div className='flex flex-col pl-8 pr-8 pt-5 pb-10 gap-5'>
                                        <p className='text-[22px] font-bold'>Skills</p>

                                        <div className="flex flex-wrap gap-3">
                                            {freelancer?.skills && (
                                                <div className="flex flex-wrap gap-2">
                                                    {freelancer.skills.split(",").map((skill, index) => (
                                                        <span key={index} className="bg-purple-100 text-grey-700 px-4 py-2 rounded-full">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex bg-purple-700 h-[270px] rounded-xl justify-between items-center px-10'>
                            <div className='flex flex-col gap-4'>
                                <p className='text-2xl font-bold text-white font-inter'>Find Talent That Fits Your Vision</p>
                                <div className='w-[600px]'>
                                    <p className='text-white font-inter text-lg font-light'>Explore in-depth profiles featuring work
                                        experience, education, services, and client reviews — all designed to help you
                                        make informed decisions and
                                        connect with the right freelancer for your project.</p>
                                </div>
                            </div>

                            <img className='h-64' src="/freelancer_profile_static_img.png" />
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </>
    );
}

export default FreelancerProfileClientView;
