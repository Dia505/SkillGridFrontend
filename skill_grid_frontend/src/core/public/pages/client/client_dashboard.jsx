import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";
import AppFeatureDiv from "../../../../components/client_dashboard/app_feature_div";
import OnGoingCollaborations from "../../../../components/client_dashboard/on_going_collaborations";

function ClientDashboard() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

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

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col items-center justify-center mt-[90px] pt-10 pb-14 gap-10">
                    <div className="w-[1067px] h-[556px] bg-purple-700 rounded-xl flex justify-between pl-20">
                        <div className="flex flex-col mt-10 gap-8">
                            <div className="w-[538px]">
                                <p className="text-[53px] text-purple-50 font-caprasimo">Discover exceptional talent tailored to your needs.</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search freelancer"
                                    className="bg-purple-100 p-2 w-[350px] h-[47px] rounded-xl" />
                                <button className="absolute left-80 h-[47px] w-[47px] bg-purple-400 text-purple-50 rounded-r-xl pl-2">
                                    <MagnifyingGlassIcon className="h-8"/>
                                </button>
                            </div>
                        </div>

                        <img className="w-[419px] rounded-xl" src="src/assets/client_dashboard_top_img.png"/>
                    </div>

                    <div className="flex gap-8">
                        <AppFeatureDiv
                            bgColor="bg-blue-300"
                            featureImg="src/assets/client_dashboard_feature1.png"
                            title="Tailored Hiring Service"
                            subtitle="Connect with the right talent to meet your unique project requirements effortlessly."
                        />
                        <AppFeatureDiv
                            bgColor="bg-blue-500"
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

                    <OnGoingCollaborations/>
                </div>
            </div>
        </>
    );
}

export default ClientDashboard;
