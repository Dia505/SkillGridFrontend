import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import AddEducationForm from "../../../components/freelancer_profile/add_education_form";
import AddEmploymentForm from "../../../components/freelancer_profile/add_employment_form";
import AddFreelancerServiceForm from "../../../components/freelancer_profile/add_freelancer_service_form";
import EditEducationForm from "../../../components/freelancer_profile/edit_education_form";
import EditEmploymentForm from "../../../components/freelancer_profile/edit_employment_form";
import EditFreelancerProfileForm from "../../../components/freelancer_profile/edit_freelancer_profile_form";
import EditFreelancerServiceForm from "../../../components/freelancer_profile/edit_freelancer_service_form";
import FreelancerSideBar from "../../../components/navigation_bar/freelancer_side_bar";
import { useAuth } from "../../../context/auth_context";

function FreelancerProfile() {
    const { authToken, userId } = useAuth();
    const [freelancer, setFreelancer] = useState(null);
    const [education, setEducation] = useState([]);
    const [employment, setEmployment] = useState([]);
    const [service, setService] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [portfolioImages, setPortfolioImages] = useState([]);
    const [showAddEducationForm, setShowAddEducationForm] = useState(false);
    const [showAddEmploymentForm, setShowAddEmploymentForm] = useState(false);
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [showEditEducationForm, setShowEditEducationForm] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [showEditEmploymentForm, setShowEditEmploymentForm] = useState(false);
    const [selectedEmployment, setSelectedEmployment] = useState(null);
    const [showEditServiceForm, setShowEditServiceForm] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const [imageIndexes, setImageIndexes] = useState(() => {
        const initialIndexes = {};
        portfolioImages.forEach(portfolio => {
            initialIndexes[portfolio.serviceId] = 0;
        });
        return initialIndexes;
    });

    useEffect(() => {
        async function fetchFreelancer() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });

                if (!response.ok) throw new Error("Freelancer not found");

                const data = await response.json();
                setFreelancer(data);
                console.log("Fetched Freelancer Data:", data);
            } catch (error) {
                console.error("Error fetching freelancer:", error);
            }
        }

        fetchFreelancer();

        async function fetchFreelancerEducation() {
            try {
                const response = await fetch(`http://localhost:3000/api/education/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });
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
                const response = await fetch(`http://localhost:3000/api/employment/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });
                const data = await response.json();
                setEmployment(data);
            }
            catch {
                console.error("Error fetching freelancer employment:", error);
            }
        }

        fetchFreelancerEmployment();

        async function fetchFreelancerService() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer-service/freelancer/${userId}`);
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

    }, [authToken, userId]);

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

    const handleDeleteEmployment = async (employmentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employment?");

        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/employment/${employmentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (!response.ok) {
                throw new Error("Failed to delete employment");
            }

        } catch (error) {
            console.error("Error deleting employment:", error);
        }
    };

    const handleDeleteEducation = async (educationId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this education?");

        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/education/${educationId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (!response.ok) {
                throw new Error("Failed to delete education");
            }

        } catch (error) {
            console.error("Error deleting education:", error);
        }
    };

    const handleDeleteService = async (freelancerServiceId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this education?");

        if (!confirmDelete) {
            return;
        }

        try {
            // Deleting the freelancer service
            const freelancerServiceResponse = await fetch(`http://localhost:3000/api/freelancer-service/${freelancerServiceId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${authToken}` },
            });

            if (!freelancerServiceResponse.ok) {
                throw new Error("Failed to delete service");
            }

            // Deleting the associated portfolio images
            const portfolioResponse = await fetch(`http://localhost:3000/api/portfolio/freelancer-service/${freelancerServiceId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${authToken}` },
            });

            if (!portfolioResponse.ok) {
                throw new Error('Failed to delete portfolio');
            }

            // Update the UI state after successful deletion
            setService((prevService) => {
                const updatedServices = prevService.filter((s) => s._id !== freelancerServiceId); // Remove the deleted service

                // Adjust the currentIndex if necessary
                if (updatedServices.length === 0) {
                    setCurrentIndex(0); // If no services left, reset to index 0 (or a suitable index)
                } else if (updatedServices.length <= currentIndex) {
                    setCurrentIndex(updatedServices.length - 1); // If the currentIndex is out of bounds, set it to the last service
                }

                return updatedServices;
            });

            setPortfolioImages((prevImages) => prevImages.filter((portfolio) => portfolio.serviceId !== freelancerServiceId)); // Remove the portfolio images

        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the service and portfolio');
        }
    };

    return (
        <>
            <div className="flex bg-purple-50 overflow-auto">
                <FreelancerSideBar />

                <div className="min-h-screen flex flex-col bg-purple-50 py-14 pl-80 pr-16 gap-5">
                    <p className="text-2xl font-inter font-bold">Profile</p>

                    {freelancer && (
                        <div className="flex flex-col border-2 border-grey-300 rounded-xl items-center pr-14 pl-10 py-5">
                            <div className="w-full h-[180px] overflow-hidden rounded-t-xl relative">
                                <img
                                    src={`http://localhost:3000/freelancer_images/${freelancer.background_picture}`}
                                    className="w-full h-full object-cover"
                                    alt="Freelancer Background"
                                />
                            </div>

                            <div className="flex bg-purple-50 pl-16 pt-5 pb-8 gap-28">
                                <div className='flex gap-6'>
                                    <div className="w-24 h-24 rounded-full overflow-hidden">
                                        <img
                                            src={`${freelancer.profile_picture}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p className="text-xl font-bold">{`${freelancer.first_name} ${freelancer.last_name}`}</p>
                                        <p className="text-lg">{`${freelancer.profession}`}</p>
                                        <p className="text-sm text-grey-500">{new Date(freelancer.date_of_birth).toISOString().split('T')[0]}</p>
                                        <p className="text-sm text-grey-500">{`${freelancer.mobile_no}`}</p>
                                        <p className="text-sm text-grey-500">{`${freelancer.address}, ${freelancer.city}`}</p>
                                        <p className="text-sm text-grey-500">{`${freelancer.email}`}</p>
                                        <p className="text-sm text-grey-500">Experience: {`${freelancer.years_of_experience} years`}</p>
                                    </div>
                                </div>

                                <div className="flex gap-20">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-wrap gap-3">
                                            {freelancer?.skills && (
                                                <div className="flex flex-wrap gap-2">
                                                    {freelancer.skills.split(",").map((skill, index) => (
                                                        <span key={index} className="bg-purple-100 text-grey-700 px-4 py-2 rounded-full text-sm">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-80">
                                            <p className="text-sm text-grey-500">{`${freelancer.bio}`}</p>
                                        </div>
                                    </div>

                                    <div className="flex border-2 border-purple-400 rounded-full px-3 py-3 cursor-pointer h-12" onClick={() => setShowEditProfileForm(true)}>
                                        <button className="text-purple-400">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {showEditProfileForm && (
                                <>
                                    <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                                    <div className="fixed inset-0 flex justify-center items-center z-20">
                                        <EditFreelancerProfileForm
                                            closeForm={() => setShowEditProfileForm(false)}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="bg-grey-300 h-0.5 w-full"></div>

                            <div className="flex pt-8">
                                <div className="flex flex-col gap-3 pr-10">
                                    <div className='flex flex-col pb-5 pl-8 pr-8 gap-5'>
                                        <div className="flex items-center justify-between">
                                            <p className='text-2xl font-bold'>Education</p>
                                            <button className="text-purple-400 text-3xl font-bold border-2 rounded-full h-10 w-10 leading-none pb-6" onClick={() => setShowAddEducationForm(true)}>+</button>
                                        </div>

                                        <div className='flex flex-col gap-4'>
                                            {education.length > 0 ? (
                                                education.map((education, index) => (
                                                    <div key={index} className='flex flex-col'>
                                                        <div className="flex items-center justify-between gap-4">
                                                            <p className="text-lg">{education.degree_title}</p>

                                                            <div className="flex gap-2">
                                                                <div className="flex border-2 border-purple-400 rounded-full pl-2 cursor-pointer h-9 w-9" >
                                                                    <button className="text-purple-400">
                                                                        <PencilIcon className="h-4 w-4" onClick={() => {
                                                                            setSelectedEducation(education._id);
                                                                            setShowEditEducationForm(true);
                                                                        }} />
                                                                    </button>
                                                                </div>

                                                                <div className="flex border-2 border-purple-400 rounded-full pl-2 cursor-pointer h-9 w-9" onClick={() => handleDeleteEducation(education._id)}>
                                                                    <button className="text-purple-400">
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-grey-500">{education.institution_name}</p>
                                                        <p className="text-sm text-grey-500">
                                                            {new Date(education.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {new Date(education.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                ))
                                            )

                                                : (
                                                    <p className="text-gray-500">No education details available</p>
                                                )}
                                        </div>
                                    </div>

                                    {showAddEducationForm && (
                                        <>
                                            <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                                            <div className="fixed inset-0 flex justify-center items-center z-20">
                                                <AddEducationForm
                                                    closeForm={() => setShowAddEducationForm(false)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {showEditEducationForm && selectedEducation && (
                                        <>
                                            <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                                            <div className="fixed inset-0 flex justify-center items-center z-20">
                                                <EditEducationForm
                                                    educationId={selectedEducation}
                                                    closeForm={() => setShowEditEducationForm(false)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="bg-grey-300 h-0.5 w-full"></div>

                                    <div className='flex flex-col py-5 pl-8 pr-8 gap-5'>
                                        <div className="flex items-center justify-between">
                                            <p className='text-[22px] font-bold'>Employment</p>
                                            <button className="text-purple-400 text-3xl font-bold border-2 rounded-full h-10 w-10 leading-none pb-6" onClick={() => setShowAddEmploymentForm(true)}>+</button>
                                        </div>

                                        <div className='flex flex-col gap-4'>
                                            {employment.length > 0 ? (
                                                employment.map((employment, index) => (
                                                    <div key={index} className='flex flex-col'>
                                                        <div className="flex items-center justify-between gap-4">
                                                            <p className="text-lg">{employment.job_title} | {employment.company_name}</p>

                                                            <div className="flex gap-2">
                                                                <div className="flex border-2 border-purple-400 rounded-full pl-2 cursor-pointer h-9 w-9" >
                                                                    <button className="text-purple-400">
                                                                        <PencilIcon className="h-4 w-4"
                                                                            onClick={() => {
                                                                                setSelectedEmployment(employment._id);
                                                                                setShowEditEmploymentForm(true);
                                                                            }} />
                                                                    </button>
                                                                </div>

                                                                <div className="flex border-2 border-purple-400 rounded-full pl-2 cursor-pointer h-9 w-9" onClick={() => handleDeleteEmployment(employment._id)}>
                                                                    <button className="text-purple-400">
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-grey-500">
                                                            {new Date(employment.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {employment.end_date
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

                                    {showAddEmploymentForm && (
                                        <>
                                            <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                                            <div className="fixed inset-0 flex justify-center items-center z-20">
                                                <AddEmploymentForm
                                                    closeForm={() => setShowAddEmploymentForm(false)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {showEditEmploymentForm && selectedEmployment && (
                                        <>
                                            <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                                            <div className="fixed inset-0 flex justify-center items-center z-20">
                                                <EditEmploymentForm
                                                    employmentId={selectedEmployment}
                                                    closeForm={() => setShowEditEmploymentForm(false)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="bg-grey-300 h-full w-0.5"></div>

                                <div className='flex flex-col pl-8 pt-5 pb-14 gap-6'>
                                    <div className="flex items-center justify-between">
                                        <p className='text-[22px] font-bold'>Services</p>
                                        <button className="text-purple-400 text-3xl font-bold border-2 rounded-full h-10 w-10 leading-none pb-6" onClick={() => setShowAddServiceForm(true)}>+</button>
                                    </div>

                                    <div className='relative flex items-center'>
                                        {service.length > 0 && currentIndex >= 0 && currentIndex < service.length ? (
                                            <div className="transition-all duration-500 ease-in-out transform">
                                                <div
                                                    key={currentIndex}
                                                    className='w-[580px] h-[350px] flex flex-col gap-6 rounded-xl border-2 border-grey-500 ml-10 py-8 pl-8'
                                                >
                                                    <div className='flex justify-between items-center'>
                                                        <p className='text-purple-400 text-lg font-bold font-inter'>
                                                            {currentIndex + 1}. {service[currentIndex].service_id.service_name}
                                                        </p>
                                                        <div className='flex bg-purple-700 w-[182px] h-[40px] rounded-l-xl text-white font-bold font-inter justify-center items-center'>
                                                            Rs. {service[currentIndex].hourly_rate}/hr
                                                        </div>
                                                    </div>

                                                    <div className="w-[330px] h-[180px] rounded-xl overflow-hidden relative ml-20">
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

                                                    <div className="flex gap-2 ml-48">
                                                        <div className="flex border-2 border-purple-400 rounded-full pl-2 cursor-pointer h-9 w-9" >
                                                            <button className="text-purple-400">
                                                                <PencilIcon className="h-4 w-4" onClick={() => {
                                                                    setSelectedService(service[currentIndex]._id);
                                                                    setShowEditServiceForm(true);
                                                                }} />
                                                            </button>
                                                        </div>

                                                        <div className="flex border-2 border-purple-400 rounded-full pl-2 cursor-pointer h-9 w-9" onClick={() => handleDeleteService(service[currentIndex]._id)}>
                                                            <button className="text-purple-400">
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No service details available</p>
                                        )}
                                        <button
                                            className="absolute left-20 border border-purple-700 rounded-full"
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

                                {showAddServiceForm && (
                                    <>
                                        <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                                        <div className="fixed inset-0 flex justify-center items-center z-20">
                                            <AddFreelancerServiceForm
                                                closeForm={() => setShowAddServiceForm(false)}
                                            />
                                        </div>
                                    </>
                                )}

                                {showEditServiceForm && selectedService && (
                                    <>
                                        <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                                        <div className="fixed inset-0 flex justify-center items-center z-20">
                                            <EditFreelancerServiceForm
                                                freelancerServiceId={selectedService}
                                                closeForm={() => setShowEditServiceForm(false)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default FreelancerProfile;