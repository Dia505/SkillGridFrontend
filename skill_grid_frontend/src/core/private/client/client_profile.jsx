import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import ClientDashboardNavbarWithToken from "../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../components/navigation_bar/client_dashboard_navbar_without_token";
import { useAuth } from "../../../context/auth_context";

function ClientProfile() {
    const { authToken, role, userId } = useAuth();
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

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {authToken && role == "client" ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] px-32 pt-10 pb-20 gap-10 items-center">
                    <p className="font-extrabold text-3xl text-purple-700">Client Profile</p>

                    <div className="flex border-2 border-grey-300 rounded-xl items-center pr-16 pl-10 py-5">
                        <img src={client.profile_picture} className="w-72 h-72" />

                        <div className="bg-grey-300 w-0.5"></div>

                        <div className="flex flex-col pl-10 py-6 gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-inter font-bold text-purple-700">Account information</p>
                                <div className="flex border-2 border-purple-400 rounded-full px-3 py-3">
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
                </div>
            </div>
        </>
    )
}

export default ClientProfile;