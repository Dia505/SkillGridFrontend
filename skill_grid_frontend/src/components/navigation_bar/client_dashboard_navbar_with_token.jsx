import { BellIcon, CalendarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLogo2 from "../app_logo/app_logo2";

function ClientDashboardNavbarWithToken() {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const savedAuthData = JSON.parse(localStorage.getItem("authData")) || {};
        const userId = savedAuthData?.userId ?? "";
        const token = savedAuthData?.token ?? "";

        console.log("User ID:", userId);

        if (userId && token) {
            fetch(`http://localhost:3000/api/client/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log("API Response Data:", data); // Log the whole response
                    if (data.profile_picture) {
                        setProfileImage(data.profile_picture);
                        console.log("Profile img path:", data.profile_picture);
                    } else {
                        console.log("Profile image not found in response.");
                    }
                })
                .catch(err => console.error("Error fetching profile:", err));
        }
    }, []);


    return (
        <div className="bg-purple-50 flex w-full h-[90px] items-center justify-between pl-10 pr-10">
            <AppLogo2 onClick={() => navigate("/client-dashboard")} />

            <div className="flex gap-5">
                <div className="relative">
                    <input
                        type="text"
                        className="border border-grey-500 bg-purple-50 p-2 w-[260px] rounded-xl" />
                    <button className="absolute w-[29px] h-[29px] right-2 top-1.5">
                        <MagnifyingGlassIcon />
                    </button>
                </div>

                <button className="w-[30px]" onClick={() => navigate("/")}>
                    <CalendarIcon />
                </button>

                <button className="w-[30px]" onClick={() => navigate("/")}>
                    <BellIcon />
                </button>

                <div className="w-[40px] h-[40px] rounded-full overflow-hidden border border-gray-300">
                    {profileImage ? (
                        <img src={profileImage} alt="User Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                            ?
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientDashboardNavbarWithToken;
