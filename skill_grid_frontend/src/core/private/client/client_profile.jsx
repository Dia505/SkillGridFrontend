import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import ClientEditProfileForm from "../../../components/client_profile/client_edit_profile_form";
import ClientDashboardNavbarWithToken from "../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../components/navigation_bar/client_dashboard_navbar_without_token";
import { useAuth } from "../../../context/auth_context";

function ClientProfile() {
    const { authToken, role, userId } = useAuth();
    const [client, setClient] = useState({});
    const [showEditClientForm, setShowEditClienttForm] = useState(false);

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

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {authToken && role == "client" ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] px-32 pt-10 pb-20 gap-10 items-center">
                    <p className="font-extrabold text-3xl text-purple-700">Client Profile</p>

                    {showEditClientForm ? (
                        <ClientEditProfileForm closeForm={() => setShowEditClienttForm(false)} />
                    ) : (
                        <div className="flex 900:flex-row 500:flex-col border-2 border-grey-300 rounded-xl items-center 900:pr-16 500:pr-3 900:pl-10 py-5">
                            <div className="900:w-72 900:h-72 500:w-[32vw] 500:h-[32vw] rounded-full overflow-hidden">
                                <img src={client.profile_picture} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex flex-col pl-10 py-6 gap-3">
                                <div className="flex items-center 900:justify-between 500:gap-[14vw]">
                                    <p className="text-xl font-inter font-bold text-purple-700">Account information</p>
                                    <div className="flex border-2 border-purple-400 rounded-full px-3 py-3 cursor-pointer" onClick={() => setShowEditClienttForm(true)}>
                                        <button className="text-purple-400">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-8">
                                    <div className="flex flex-col">
                                        <p className="text-grey-500">First name</p>
                                        <p className="font-medium">{client.first_name}</p>
                                    </div>

                                    <div className="flex flex-col">
                                        <p className="text-grey-500">Last name</p>
                                        <p className="font-medium">{client.last_name}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-grey-500">Mobile number</p>
                                    <p className="font-medium">{client.mobile_no}</p>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-grey-500">City</p>
                                    <p className="font-medium">{client.city}</p>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-grey-500">Email address</p>
                                    <p className="font-medium">{client.email}</p>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-grey-500">Password</p>
                                    <p className="font-medium">{client.password ? "•".repeat(client.password.length) : ""}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ClientProfile;