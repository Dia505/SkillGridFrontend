import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AppFeatureDiv from "../../../../components/client_dashboard/app_feature_div";
import OnGoingCollaborations from "../../../../components/client_dashboard/on_going_collaborations";
import ServiceCategoryDiv from "../../../../components/client_dashboard/service_category_div";
import TopRatedFreelancer from "../../../../components/client_dashboard/top_rated_freelancer";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";
import { useState } from "react";

function ClientDashboard() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;
    const [searchQuery, setSearchQuery] = useState("");

    let isTokenValid = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                isTokenValid = true;
            } else {
                // Token expired, remove it from localStorage
                localStorage.removeItem("authData");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("authData"); // Remove invalid token
        }
    }

    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search-freelancer/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] pt-10 pb-40 pl-56 gap-10">
                    <div className="w-[1067px] h-[556px] bg-purple-700 rounded-xl flex justify-between pl-20">
                        <div className="flex flex-col mt-10 gap-8">
                            <div className="w-[538px]">
                                <p className="text-[53px] text-purple-50 font-caprasimo">Discover exceptional talent tailored to your needs.</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search freelancer/profession"
                                    className="bg-purple-100 p-2 w-[366px] h-[47px] rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                                <button className="absolute left-80 h-[47px] w-[47px] bg-purple-400 text-purple-50 rounded-r-xl pl-2" onClick={handleSearch}>
                                    <MagnifyingGlassIcon className="h-8" />
                                </button>
                            </div>
                        </div>

                        <img className="w-[419px] rounded-xl" src="src/assets/client_dashboard_top_img.png" />
                    </div>

                    {!isTokenValid && (
                        <div className="flex gap-8">
                            <AppFeatureDiv
                                bgColor="bg-blue-100"
                                featureImg="src/assets/client_dashboard_feature1.png"
                                title="Tailored Hiring Service"
                                subtitle="Connect with the right talent to meet your unique project requirements effortlessly."
                            />
                            <AppFeatureDiv
                                bgColor="bg-blue-200"
                                featureImg="src/assets/client_dashboard_feature2.png"
                                title="Secure Payments, Simplified"
                                subtitle="Enjoy seamless transactions with transparent billing and secure payment gateways."
                            />
                            <AppFeatureDiv
                                bgColor="bg-pink-300"
                                featureImg="src/assets/client_dashboard_feature3.png"
                                title="Streamlined Project Management"
                                subtitle="Effortlessly manage all your projects and collaborations in one unified space."
                            />
                        </div>
                    )}

                    <OnGoingCollaborations />

                    <div className="w-[1067px] h-[3px] bg-grey-500"></div>

                    {!isTokenValid && (
                        <div className="w-[1067px] h-[400px] bg-blue-400 rounded-2xl flex justify-between pl-10">
                            <div className="flex flex-col gap-4 pt-12">
                                <div className="w-[427px]">
                                    <span className="font-caprasimo text-[48px] text-white leading-[1.1]">
                                        Access a Pool of
                                        <span className="text-blue-700"> Exceptional Talent</span>
                                    </span>
                                </div>

                                <div className="w-[427px]">
                                    <p className="font-inter text-white font-light text-base">Browse comprehensive freelancer profiles with detailed work experience, skills, and client feedback, empowering you to choose the perfect fit for your project.</p>
                                </div>
                            </div>

                            <img className="w-[560px] rounded-r-2xl" src="src/assets/client_dashboard_exceptional_talent.png" />
                        </div>
                    )}

                    <div className="flex flex-col gap-8">
                        <p className="text-3xl font-inter font-light">Service Category</p>

                        <div className="flex gap-10">
                            <div className="flex flex-col gap-4">
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_technology.jpg"
                                    serviceName="Technology"
                                    serviceList={["Mobile App Development", "Web Development", "Cloud Computing", "Software Development"]}
                                />
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_marketing.png"
                                    serviceName="Marketing"
                                    serviceList={["Digital Marketing", "Digital Marketing", "Content Marketing", "Search Engine Optimization (SEO)"]}
                                />
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_education.jpg"
                                    serviceName="Education"
                                    serviceList={["Online Tutoring", "Educational Content Creation", "Course Development", "Exam Preparation and Coaching"]}
                                />
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_art.jpg"
                                    serviceName="Artisan and Craft"
                                    serviceList={["Painting", "Pottery and Ceramics", "Custom Woodworking", "Textile Arts and Weaving"]}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_design.jpg"
                                    serviceName="Design"
                                    serviceList={["UI/UX Design", "Graphic Design", "Interior Design", "Motion Graphics Design"]}
                                />
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_business.png"
                                    serviceName="Business"
                                    serviceList={["Business Consulting", "Market Research", "Financial Planning and Analysis", "Project Management"]}
                                />
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_photography.jpg"
                                    serviceName="Photography"
                                    serviceList={["Event Photography", "Product Photography", "Wedding Photography", "Event Videography"]}
                                />
                                <ServiceCategoryDiv
                                    serviceImg="src/assets/client_dashboard_content.png"
                                    serviceName="Content creation"
                                    serviceList={["Video Production", "Blogging", "Copywriting", "Social Media Management"]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <p className="text-3xl font-inter font-light">Top-rated Freelancers</p>
                        <TopRatedFreelancer />
                    </div>
                </div>

                <div className="flex bg-black w-full justify-between items-center pl-12 pr-12 pt-6 pb-6">
                    <p className="text-lg text-white font-inter">© 2024 SkillGrid. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <img className="h-[80px]" src="src/assets/app_logo_dashboard.png" />
                        <p className="font-caprasimo text-white text-3xl">SkillGrid.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ClientDashboard;
