import { FolderIcon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/auth_context';
import { useNavigate } from 'react-router-dom';

function ClientSideBar({ isSideBarOpen, setIsSideBarOpe }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <div className="flex flex-col bg-white rounded-xl gap-5">
                <div className="flex flex-col">
                    <button className="cursor-pointer hover:bg-grey-50">
                        <div className='flex items-center gap-5 py-5 px-10'>
                            <UserIcon className='h-7' />
                            <p className='font-inter'>Profile</p>
                        </div>
                    </button>

                    <button className="cursor-pointer hover:bg-grey-50" onClick={() => navigate("/client-contracts")}>
                        <div className='flex items-center gap-5 py-5 px-10'>
                            <FolderIcon className='h-7' />
                            <p className='font-inter'>Contracts</p>
                        </div>
                    </button>
                </div>

                <button className="cursor-pointer rounded-b-xl hover:bg-purple-700 hover:text-purple-50" onClick={handleLogout}>
                    <div className='flex items-center gap-2 py-5 px-10'>
                        <ArrowLeftOnRectangleIcon className='h-7' />
                        <p className='font-inter hover:underline'>Log out</p>
                    </div>
                </button>
            </div>
        </>
    )
}

export default ClientSideBar;