import { CheckIcon, StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditClientContract from "../../../components/client_contracts/edit_client_contract";
import ClientDashboardNavbarWithToken from "../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../components/navigation_bar/client_dashboard_navbar_without_token";
import { useAuth } from "../../../context/auth_context";
import { useLocation } from 'react-router-dom';

function ClientContracts() {
    const { authToken, role, userId } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [ongoingContracts, setOngoingContracts] = useState([]);
    const [completedContracts, setCompletedContracts] = useState([]);
    const [requestedOffers, setRequestedOffers] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState({});
    const [showEditContractForm, setShowEditContractForm] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [reviews, setReviews] = useState([]);

    const { state } = useLocation();
    const initialFilter = state?.filter || "All";  

    const [selectedFilter, setSelectedFilter] = useState(initialFilter);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchContracts() {
            try {
                const response = await fetch(`http://localhost:3000/api/appointment/client/${userId}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });
                if (!response.ok) throw new Error("Client appointments not found");

                const data = await response.json();
                const contracts = data.filter(contract => contract.status === true);
                setContracts(contracts);

                const today = new Date();

                const ongoingContracts = contracts.filter(contract => {
                    if (!contract.appointment_time) {
                        return new Date(contract.project_end_date) > today;
                    }

                    const { unit, value } = contract.project_duration || {};
                    if (!unit || value == null) return false;

                    let endDateTime = new Date(contract.appointment_date);

                    const [hours, minutes] = contract.appointment_time.split(":").map(Number);
                    endDateTime.setHours(hours, minutes, 0, 0);

                    if (unit === "hour") {
                        endDateTime.setHours(endDateTime.getHours() + value);
                    } else if (unit === "day") {
                        endDateTime.setDate(endDateTime.getDate() + value);
                    } else if (unit === "week") {
                        endDateTime.setDate(endDateTime.getDate() + value * 7);
                    } else if (unit === "month") {
                        endDateTime.setMonth(endDateTime.getMonth() + value);
                    }

                    return endDateTime > today;
                });
                setOngoingContracts(ongoingContracts);

                const completedContracts = data.filter(contract => {
                    if (!contract.appointment_time) {
                        return new Date(contract.project_end_date) < today;
                    }

                    const { unit, value } = contract.project_duration || {};
                    if (!unit || value == null) return false;

                    let endDateTime = new Date(contract.appointment_date);

                    const [hours, minutes] = contract.appointment_time.split(":").map(Number);
                    endDateTime.setHours(hours, minutes, 0, 0);

                    if (unit === "hour") {
                        endDateTime.setHours(endDateTime.getHours() + value);
                    } else if (unit === "day") {
                        endDateTime.setDate(endDateTime.getDate() + value);
                    } else if (unit === "week") {
                        endDateTime.setDate(endDateTime.getDate() + value * 7);
                    } else if (unit === "month") {
                        endDateTime.setMonth(endDateTime.getMonth() + value);
                    }

                    return endDateTime < today;
                });
                setCompletedContracts(completedContracts);

                const requestedOffers = data.filter(contract => contract.status === false);
                setRequestedOffers(requestedOffers);

                const paymentFetches = contracts.map(async (contract) => {
                    const paymentResponse = await fetch(`http://localhost:3000/api/payment/appointment/${contract._id}`, {
                        headers: { "Authorization": `Bearer ${authToken}` }
                    });

                    if (paymentResponse.ok) {
                        const paymentData = await paymentResponse.json();
                        return { contractId: contract._id, paymentData };
                    }
                    return null;
                });

                // Wait for all payment fetches to complete
                const paymentResults = await Promise.all(paymentFetches);

                // Update the payment details state only after all fetches are done
                const paymentDetails = {};
                paymentResults.forEach(result => {
                    if (result) {
                        paymentDetails[result.contractId] = result.paymentData;
                    }
                });
                setPaymentDetails(paymentDetails);

                const fetchReviews = async () => {
                    try {
                        const response = await fetch("http://localhost:3000/api/review", {
                            headers: { "Authorization": `Bearer ${authToken}` }
                        });
                        const data = await response.json();
                        setReviews(data);
                    } catch (error) {
                        console.error("Error fetching reviews:", error);
                    }
                };

                fetchReviews();

            }
            catch (error) {
                console.error("Error fetching appointments:", error);
            }
        }
        fetchContracts();
    }, [userId, authToken]);

    const handleDeleteContract = async (contractId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this contract?");

        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/payment/appointment/${contractId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (!response.ok) {
                throw new Error("Failed to delete contract");
            }

            // Remove the contract from the state after successful deletion
            setContracts(contracts.filter(contract => contract._id !== contractId));
            setOngoingContracts(ongoingContracts.filter(contract => contract._id !== contractId));
            setCompletedContracts(completedContracts.filter(contract => contract._id !== contractId));
            setRequestedOffers(requestedOffers.filter(contract => contract._id !== contractId));

            setPaymentDetails(prev => {
                const updatedDetails = { ...prev };
                delete updatedDetails[contractId];
                return updatedDetails;
            });

        } catch (error) {
            console.error("Error deleting contract:", error);
        }
    };

    const getFilteredContracts = () => {
        if (selectedFilter === "Ongoing") return ongoingContracts;
        if (selectedFilter === "Completed") return completedContracts;
        if (selectedFilter === "Requested offers") return requestedOffers;
        return contracts; // Default: Show all contracts
    };

    const getProgress = (contract) => {
        const now = new Date();
        let startTime, endTime;

        if (contract.appointment_time) {
            startTime = new Date(contract.appointment_date);
            const [hours, minutes] = contract.appointment_time.split(":").map(Number);
            startTime.setHours(hours, minutes, 0, 0);

            const { unit, value } = contract.project_duration || {};
            endTime = new Date(startTime);

            if (unit === "hour") endTime.setHours(startTime.getHours() + value);
            else if (unit === "day") endTime.setDate(startTime.getDate() + value);
            else if (unit === "week") endTime.setDate(startTime.getDate() + value * 7);
            else if (unit === "month") endTime.setMonth(startTime.getMonth() + value);
        } else {
            startTime = new Date(contract.appointment_date);
            endTime = new Date(contract.project_end_date);
        }

        if (now < startTime) return 0;
        if (now > endTime) return 100;

        return ((now - startTime) / (endTime - startTime)) * 100;
    };

    const handleEditContractClick = (contractId) => {
        setSelectedContractId(contractId);
        setShowEditContractForm(true);
    };

    return (
        <>
            <div className="min-h-screen overflow-auto flex flex-col bg-purple-50">
                {authToken && role == "client" ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] px-5 md:px-16 lg:px-32 pt-10 pb-20 gap-10">
                    <p className="font-extrabold text-3xl text-purple-700">Contracts</p>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-4 md:gap-8">
                            {["All", "Ongoing", "Completed", "Requested offers"].map(filter => (
                                <p
                                    key={filter}
                                    className={`cursor-pointer hover:text-purple-400 hover:font-medium ${selectedFilter === filter ? "text-purple-400 underline font-bold" : "text-grey-500"}`}
                                    onClick={() => setSelectedFilter(filter)}
                                >
                                    {filter}
                                </p>
                            ))}
                        </div>
                        <div className="bg-grey-500 w-full h-0.5"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {getFilteredContracts().map((contract, index) => (
                            <div key={index} className="flex flex-col py-8 px-6 bg-purple-100 rounded-xl">
                                <div className="flex gap-2 justify-end">
                                    <button className="border-2 border-purple-700 w-8 h-8 rounded-full" onClick={() => handleEditContractClick(contract._id)}>✏️</button>
                                    <button className="border-2 border-purple-700 w-8 h-8 rounded-full" onClick={() => handleDeleteContract(contract._id)}>🗑️</button>
                                </div>

                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-24 h-24 rounded-full overflow-hidden">
                                        <img src={`http://localhost:3000/freelancer_images/${contract.freelancer_service_id.freelancer_id.profile_picture}`} className="w-full h-full object-cover" alt="Freelancer" />
                                    </div>
                                    <p className="text-purple-700 text-lg font-bold">{contract.freelancer_service_id.freelancer_id.first_name} {contract.freelancer_service_id.freelancer_id.last_name}</p>
                                    <p className="text-purple-700">{contract.freelancer_service_id.freelancer_id.profession}</p>
                                </div>

                                <div className="border-t border-grey-500 my-4"></div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-purple-700 font-semibold">Project details</p>
                                    <span className="text-purple-700 font-medium">Project: <span className="text-black-700">{contract.appointment_purpose}</span></span>
                                    <span className="text-purple-700 font-medium">Deadline: <span className="text-black-700">{new Date(contract.project_end_date).toLocaleDateString()}</span></span>

                                    {ongoingContracts.includes(contract) && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-grey-100 rounded-full h-2.5">
                                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${getProgress(contract)}%` }}></div>
                                            </div>
                                            <p className="text-sm font-medium">{Math.round(getProgress(contract))}%</p>
                                        </div>
                                    )}

                                    {paymentDetails[contract._id] && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-purple-700 font-medium">Amount: <span className="text-black-700">Rs. {paymentDetails[contract._id].amount}</span></span>
                                            <span className="text-purple-700 font-medium">Payment method: <span className="text-black-700">{paymentDetails[contract._id].payment_method}</span></span>
                                            <span className="text-purple-700 font-medium">Payment status: <span className={paymentDetails[contract._id].payment_status ? "text-green-600" : "text-red-500"}>{paymentDetails[contract._id].payment_status ? " Paid" : " Unpaid"}</span></span>
                                        </div>
                                    )}

                                    {completedContracts.includes(contract) ? (
                                        reviews.some(review => review.appointment_id._id === contract._id) ? (
                                            <div className="flex gap-1 text-purple-700 font-medium">
                                                <p>Review sent</p>
                                                <CheckIcon className="h-5 text-green-700" />
                                            </div>
                                        ) : (
                                            <button
                                                className="bg-purple-700 py-2 px-4 rounded-xl text-white font-semibold mt-5 w-full"
                                                onClick={() => navigate("/review", {
                                                    state: {
                                                        contractId: contract._id,
                                                        freelancerId: contract.freelancer_service_id.freelancer_id._id
                                                    }
                                                })}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Write a review
                                                    <StarIcon className="h-6 hover:text-yellow-700" />
                                                </div>
                                            </button>
                                        )
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showEditContractForm && (
                    <>
                        <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                        <div className="fixed inset-0 flex justify-center items-center z-20">
                            <EditClientContract projectId={selectedContractId} onClose={() => setShowEditContractForm(false)} />
                        </div>
                    </>
                )}
            </div>
        </>

    )
}

export default ClientContracts;