import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import FreelancerSideBar from "../../../../components/navigation_bar/freelancer_side_bar";

const socket = io("http://localhost:3000", {
    transports: ["polling", "websocket"],
});

function FreelancerNotification() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const userId = authData?.userId;
    const token = authData?.token;
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch only unread notifications
        axios.get(`http://localhost:3000/api/notification/freelancer/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((res) => setNotifications(res.data))
            .catch((err) => console.error(err));

        // Listen for new real-time notifications
        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {
            socket.off("newNotification");
        };
    }, [userId, token]);

    const handleReadNotification = async (id, appointment_id) => {
        await axios.put(
            `http://localhost:3000/api/notification/${id}/read`,
            {},
            {
                headers: { "Authorization": `Bearer ${token}` }
            }
        );
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        navigate(`/freelancer-offer-view/${appointment_id}`);
    };

    return (
        <>
            <div className="flex bg-purple-50">
                <FreelancerSideBar />

                <div className="h-screen bg-purple-50 py-10 1200:pl-80 560:pl-10 500:pl-5 560:pr-10 500:pr-5">
                    <div className="flex flex-col gap-8">
                        <p className="text-2xl font-inter">Notifications</p>

                        <div className="flex flex-col gap-3 900:pl-14">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div key={notification._id}
                                        className="flex md:flex-row flex-col 800:gap-20 p-4 rounded-xl shadow-sm bg-white cursor-pointer"
                                        onClick={() => handleReadNotification(notification._id, notification.appointment_id._id)}
                                    >

                                        <div className="flex 600:gap-6 500: gap-3 items-center">
                                            <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={`http://localhost:3000/client_images/${notification.appointment_id.client_id?.profile_picture}`}
                                                    alt="client_profile_picture"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <p className="text-lg font-semibold">{notification.message}</p>
                                                <p className="text-grey-400">Click here to know the details</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 md:ml-0 644:ml-[430px] 500:ml-[65vw]">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FreelancerNotification;