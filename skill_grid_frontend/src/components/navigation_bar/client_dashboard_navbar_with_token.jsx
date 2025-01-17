import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, CalendarIcon, BellIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 
import AppLogo2 from "../app_logo/app_logo2";

function ClientDashboardNavbarWithToken() {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            console.log(userId);

            fetch(`http://localhost:3000/api/client/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.profileImage) {
                    setProfileImage(data.profileImage);  
                }
            })
            .catch(err => console.error("Error fetching profile:", err));
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }, []);

    return (
        <>
            <div className="bg-purple-50 flex w-full h-[90px] items-center justify-between pl-10 pr-10">
                <AppLogo2 onClick={() => navigate("/client-dashboard")} />

                <div className="flex gap-5">
                    <div className="relative">
                        <input
                            type="last_name"
                            className={`border border-grey-500 bg-purple-50 p-2 w-[260px] rounded-xl`} />
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
                        <img src={profileImage} alt="User Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientDashboardNavbarWithToken;