import { BellIcon, CalendarIcon, FolderIcon, Squares2X2Icon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth_context'; 

function FreelancerSideBar() {
    const navigate = useNavigate();
    const { logout } = useAuth();  

    const handleLogout = () => {
        logout();  
        navigate("/login"); 
    };
    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-black-400">
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
                        <button className="cursor-pointer hover:bg-black-50">
                            <div className='flex items-center gap-2 py-5 pl-10'>
                                <FolderIcon className='text-white h-7' />
                                <p className='text-white font-inter'>Projects</p>
                            </div>
                        </button>
                        <button className="cursor-pointer hover:bg-black-50">
                            <div className='flex items-center gap-2 py-5 pl-10'>
                                <CalendarIcon className='text-white h-7' />
                                <p className='text-white font-inter'>Calendar</p>
                            </div>
                        </button>
                        <button className="cursor-pointer hover:bg-black-50" onClick={() => navigate("/freelancer-notification")}>
                            <div className='flex items-center gap-2 py-5 pl-10'>
                                <BellIcon className='text-white h-7' />
                                <p className='text-white font-inter'>Notification</p>
                            </div>
                        </button>
                        <button className="cursor-pointer hover:bg-black-50">
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