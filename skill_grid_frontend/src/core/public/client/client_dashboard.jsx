import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFeatureDiv from "../../../components/client_dashboard/app_feature_div";
import OnGoingCollaborations from "../../../components/client_dashboard/on_going_collaborations";
import ServiceCategoryDiv from "../../../components/client_dashboard/service_category_div";
import TopRatedFreelancer from "../../../components/client_dashboard/top_rated_freelancer";
import Footer from "../../../components/footer";
import ClientDashboardNavbarWithToken from "../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../components/navigation_bar/client_dashboard_navbar_without_token";
import { useAuth } from "../../../context/auth_context";

function ClientDashboard() {
    const { authToken, role, userId } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (authToken) {
            console.log("User is logged in:", userId);
        } else {
            console.log("User is not logged in");
        }
    }, [authToken, userId]);

    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search-freelancer/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {authToken && role == "client" ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] pt-10 pb-40 1175:pl-[15.3vw] 1002:pl-[8vw] 921:pl-[3vw] 800:pl-[14vw] 589:pl-[8vw] 500:pl-[4vw] pr-[15.3vw] gap-10">
                    <div className="800:w-[69vw] 589:w-[80vw] 500:w-[89vw] 1175:h-[36vw] 900:h-[40vw] 500:h-[40vw] bg-purple-700 rounded-xl flex justify-between 858:pl-20 500:pl-8">
                        <div className="flex flex-col mt-10 gap-8">
                            <div className="705:w-[538px] 589:w-[450px]">
                                <p className="589:text-[3.46vw] 500:text-[4vw] text-purple-50 font-caprasimo">Discover exceptional talent tailored to your needs.</p>
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

                        <img className="w-[27vw] rounded-xl hidden 921:block" src="src/assets/client_dashboard_top_img.png" />
                    </div>

                    <div className="flex 800:flex-row 500:flex-col gap-8 921:-mr-28">
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


                    {authToken && (
                        <OnGoingCollaborations />
                    )}

                    <div className="1472:w-[69vw] h-[3px] 1175:w-[77vw] 1020:w-[85vw] 921:w-[90vw] 800:w-[69vw] 589:w-[80vw] 500:w-[90vw] bg-grey-500"></div>

                    <div className="1175:w-[69vw] 921:w-[85vw] 800:w-[75vw] 589:w-[80vw] 500:w-[90vw] 1002:h-[26vw] 589:h-[35vw] 500:h-[40vw] bg-blue-400 rounded-2xl flex justify-between pl-10">
                        <div className="flex flex-col gap-4 pt-12">
                            <div className="921:w-[25vw] 500:w-[20vw]">
                                <span className="font-caprasimo 1175:text-[3.12vw] 921:text-[3vw] 500:text-[4vw] text-white leading-[1.1]">
                                    Access a Pool of
                                    <span className="text-blue-700"> Exceptional Talent</span>
                                </span>
                            </div>


                            <p className="font-inter text-white font-light text-base 1175:text-base 921:text-sm hidden 921:block">Browse comprehensive freelancer profiles with detailed work experience, skills, and client feedback, empowering you to choose the perfect fit for your project.</p>

                        </div>

                        <img className="1175:w-[35vw] 589:w-[43vw] 500:w-[50vw] 921:-ml-0 705:-ml-[0vw] 589:-ml-[30vw] 500:-ml-[40vw] rounded-r-2xl" src="src/assets/client_dashboard_exceptional_talent.png" />
                    </div>


                    <div className="flex flex-col gap-8">
                        <p className="text-3xl font-inter font-light">Service Category</p>

                        <div className="flex 800:flex-row 500:flex-col gap-10">
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

                <Footer />
            </div>
        </>
    );
}

export default ClientDashboard;
