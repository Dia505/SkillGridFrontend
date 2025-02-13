import FreelancerSideBar from "../../../components/navigation_bar/freelancer_side_bar";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function FreelancerNotification() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const userId = authData?.userId;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch only unread notifications
        axios.get(`http://localhost:3000/notifications/${userId}`)
            .then((res) => setNotifications(res.data))
            .catch((err) => console.error(err));

        // Listen for new real-time notifications
        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {
            socket.off("newNotification");
        };
    }, [userId]);

    const handleReadNotification = async (id) => {
        await axios.put(`http://localhost:3000/notifications/${id}/read`);
        setNotifications((prev) => prev.filter((notif) => notif._id !== id)); // Remove it from UI
    };

    return (
        <>
            <div className="flex bg-purple-50">
                <FreelancerSideBar />

                <div className="h-screen flex bg-purple-50 py-10 pl-14">
                    <div className="flex flex-col gap-8">
                        <p className="text-2xl font-inter">Notifications</p>

                        <div className="flex flex-col gap-3 pl-14">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div key={notification._id} className="flex gap-20 p-4 border rounded-lg shadow-sm bg-white">
                                        <div className="flex gap-6">
                                            <img
                                                className="h-20 w-20 rounded-full"
                                                src={`http://localhost:3000/client_images/${notification.client_id?.profile_picture}`}
                                                alt="client_profile_picture"
                                            />

                                            <div className="flex flex-col">
                                                <p className="text-lg font-semibold">{notification.message}</p>
                                                <p className="text-grey-400">Click here to know the details</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <p className="text-sm">{new Date(notification.notification_date).toLocaleString()}</p>
                                            {!notification.read && <div className="bg-blue-500 rounded-full h-2 w-2"></div>}
                                        </div>
                                    </div>
                                ))
                            ): (
                                <p className="text-gray-500">No new notifications</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FreelancerNotification;