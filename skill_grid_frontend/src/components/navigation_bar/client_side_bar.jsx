import { ArrowLeftOnRectangleIcon, FolderIcon, UserIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';

function ClientSideBar({ isSideBarOpen, setIsSideBarOpe }) {
    const { logout, userId, authToken } = useAuth();
    const navigate = useNavigate();
    const [client, setClient] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/client/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setClient(data);
            })
            .catch(err => console.error("Error fetching client:", err));
    }, [authToken, userId]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <div className="flex flex-col bg-white rounded-xl gap-5">
                <div className="flex flex-col">
                    {client && (
                        <div className='flex items-center gap-5 py-5 px-10'>
                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden border">
                                <img src={client.profile_picture} alt="User Profile" className="w-full h-full object-cover" />
                            </div>
                            <p className='font-inter'>{client.first_name} {client.last_name}</p>
                        </div>
                    )}

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