import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientNotification from "../../core/private/client/client_notification";
import AppLogo2 from "../app_logo/app_logo2";
import ClientSideBar from "./client_side_bar";

function ClientDashboardNavbarWithToken() {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    useEffect(() => {
        const savedAuthData = JSON.parse(localStorage.getItem("authData")) || {};
        const userId = savedAuthData?.userId ?? "";
        const token = savedAuthData?.token ?? "";
        const role = savedAuthData?.role ?? "";

        console.log("User ID:", userId);

        if (userId && token && role === "client") {
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

            fetch(`http://localhost:3000/api/notification/client/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    setNotifications(data);
                })
                .catch(err => console.error("Error fetching notifications:", err));
        }
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search-freelancer/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

    return (
        <div className="bg-purple-50 flex w-full h-[90px] items-center justify-between pl-10 pr-10 fixed top-0 z-50">
            <button onClick={() => navigate("/")} ><AppLogo2 /></button>

            <div className="flex gap-8">
                <div className="relative hidden 700:block">
                    <input
                        type="text"
                        className="border border-grey-500 bg-purple-50 p-2 w-[260px] rounded-xl"
                        placeholder="Search freelancer/profession"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button className="absolute w-[29px] h-[29px] right-2 top-1.5" onClick={handleSearch}>
                        <MagnifyingGlassIcon />
                    </button>
                </div>

                <button className="w-[30px]" onClick={() => {setIsNotificationOpen((prev) => !prev); setIsSideBarOpen(false);}}>
                    <BellIcon />
                </button>

                {unreadNotificationsCount > 0 && (
                    <span className="absolute top-5 right-24 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadNotificationsCount}
                    </span>
                )}


                {isNotificationOpen && (
                    <div className="absolute right-12 top-20 bg-white rounded-lg z-50">
                        <ClientNotification isNotificationOpen={isNotificationOpen} setIsNotificationOpen={setIsNotificationOpen} />
                    </div>
                )}

                <div className="w-[40px] h-[40px] rounded-full overflow-hidden border cursor-pointer" onClick={() => {setIsSideBarOpen((prev) => !prev); setIsNotificationOpen(false)}}>
                    {profileImage ? (
                        <img src={profileImage} alt="User Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                            ?
                        </div>
                    )}
                </div>

                {isSideBarOpen && (
                    <div className="absolute right-7 top-20 z-50">
                        <ClientSideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClientDashboardNavbarWithToken;
