import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";
import Footer from "../../../../components/footer";

function FreelancerProfileClientView() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

    const { _id } = useParams();

    const [freelancer, setFreelancer] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [education, setEducation] = useState([]);
    const [employment, setEmployment] = useState([]);
    const [review, setReview] = useState([]);
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
    }, [_id]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push("⭐");
        }
        return stars;
    };

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

                                <button className='w-[240px] h-[46px] bg-purple-300 rounded-xl text-white font-bold'>Book an Appointment</button>
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

                                    <div className='flex flex-col pl-8 pt-5 pb-5'>
                                        <p className='text-[22px] font-bold'>Services</p>
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

                                    <div className='flex flex-col pl-8 pr-8 pt-5 pb-5 gap-5'>
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

                <Footer/>
            </div>
        </>
    );
}

export default FreelancerProfileClientView;
