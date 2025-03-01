import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../../context/auth_context";

const socket = io("http://localhost:3000", {
    transports: ["polling", "websocket"],
});

function ClientNotification({ isNotificationOpen, setIsNotificationOpen }) {
    const { authToken, userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            console.log("User is logged in");
        } else {
            console.log("User is not logged in");
        }
    }, [authToken]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/notification/client/${userId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        })
            .then((res) => setNotifications(res.data))
            .catch((err) => console.error(err));

        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {
            socket.off("newNotification");
        };
    }, [userId, authToken]);

    const handleReadNotification = async (id) => {
        await axios.put(
            `http://localhost:3000/api/notification/${id}/read`,
            {},
            {
                headers: { "Authorization": `Bearer ${authToken}` }
            }
        );
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        navigate("/client-contracts");
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        }

        if (isNotificationOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isNotificationOpen, setIsNotificationOpen]);

    return (
        <>
            {isNotificationOpen && (
                <div className="flex flex-col bg-white rounded-xl py-2 px-6 gap-3">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification._id}
                                className="flex gap-5 p-4 bg-white cursor-pointer"
                                onClick={() => handleReadNotification(notification._id)}
                            >

                                <div className="flex gap-4 items-center">
                                    <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                                        <img
                                            className="h-full w-full object-cover"
                                            src={`http://localhost:3000/freelancer_images/${notification.appointment_id.freelancer_service_id.freelancer_id.profile_picture}`}
                                            alt="freelancer_profile_picture"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <p className="font-semibold">{notification.message}</p>
                                        <p className="text-sm text-grey-400 w-[200px]">Your project is set to start on {new Date(notification.appointment_id.appointment_date).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}. Click here to review the details.</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <p className="text-sm font-bold">{new Date(notification.notification_date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}</p>
                                    {!notification.read && <div className="bg-blue-500 rounded-full h-2 w-2 mt-2"></div>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No new notifications</p>
                    )}
                </div>)}
        </>
    )
}

export default ClientNotification;