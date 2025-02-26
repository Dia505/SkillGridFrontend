import { ArrowLeftOnRectangleIcon, BellIcon, FolderIcon, Squares2X2Icon, UserIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';

function FreelancerSideBar() {
    const { authToken, userId } = useAuth();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (authToken) {
            console.log("User is logged in");
        } else {
            console.log("User is not logged in");
        }

        fetch(`http://localhost:3000/api/notification/freelancer/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setNotifications(data);
            })
            .catch(err => console.error("Error fetching notifications:", err));
    }, [authToken, userId]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;
    return (
        <>
            <div className="h-screen fixed top-0 left-0 flex flex-col bg-black-400 hidden 1200:block">
                <div className="flex items-center gap-2 bg-black-700 px-10 py-8">
                    <img className="h-[65px]" src="/footer_app_logo.png" />
                    <p className="font-caprasimo text-white text-2xl">SkillGrid.</p>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-col gap-5">
                        <p className="text-grey-200 pl-10 pt-8">Main Menu</p>
                        <div className="bg-grey-500 h-0.5"></div>
                    </div>

                    <div className="flex flex-col">
                        <button className="cursor-pointer hover:bg-black-50" onClick={() => navigate("/freelancer-dashboard")}>
                            <div className='flex items-center gap-2 py-5 pl-10'>
                                <Squares2X2Icon className='text-white h-7' />
                                <p className='text-white font-inter'>Dashboard</p>
                            </div>
                        </button>
                        <button className="cursor-pointer hover:bg-black-50" onClick={() => navigate("/freelancer-projects")}>
                            <div className='flex items-center gap-2 py-5 pl-10'>
                                <FolderIcon className='text-white h-7' />
                                <p className='text-white font-inter'>Projects</p>
                            </div>
                        </button>
                        <button className="cursor-pointer hover:bg-black-50" onClick={() => navigate("/freelancer-notification")}>
                            <div className='flex items-center gap-2 py-5 pl-10'>
                                <BellIcon className='text-white h-7' />
                                <p className='text-white font-inter'>Notification</p>

                                {unreadNotificationsCount > 0 && (
                                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </div>
                        </button>
                        <button className="cursor-pointer hover:bg-black-50" onClick={() => navigate("/freelancer-profile")}>
                            <div className='flex items-center gap-2 py-5 pl-10'>
                                <UserIcon className='text-white h-7' />
                                <p className='text-white font-inter'>Profile</p>
                            </div>
                        </button>
                    </div>
                </div>

                <button className="fixed bottom-0 cursor-pointer" onClick={handleLogout}>
                    <div className='flex items-center gap-2 py-7 px-10'>
                        <ArrowLeftOnRectangleIcon className='text-white h-7' />
                        <p className='text-white font-inter hover:underline'>Log out</p>
                    </div>
                </button>
            </div>
        </>
    )
}

export default FreelancerSideBar;