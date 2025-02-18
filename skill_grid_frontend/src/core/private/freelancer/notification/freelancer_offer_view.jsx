import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FreelancerSideBar from "../../../../components/navigation_bar/freelancer_side_bar";
import { useAuth } from "../../../../context/auth_context";

function FreelancerOfferView() {
    const { authToken } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [payment, setPayment] = useState(null);

    const { appointment_id } = useParams();

    useEffect(() => {
        if (authToken) {
            console.log("User is logged in");
        } else {
            console.log("User is not logged in");
        }
    }, [authToken]);

    useEffect(() => {
        if (!appointment_id || !authToken) return;

        async function fetchAppointment() {
            try {
                const response = await fetch(`http://localhost:3000/api/appointment/${appointment_id}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });

                if (!response.ok) throw new Error("Appointment not found");

                const data = await response.json();
                setAppointment(data);
                console.log("Fetched Appointment Data:", data);
            } catch (error) {
                console.error("Error fetching Appointment:", error);
            }
        }

        fetchAppointment();

        async function fetchPayment() {
            try {
                const response = await fetch(`http://localhost:3000/api/payment/appointment/${appointment_id}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });

                if (!response.ok) throw new Error("Payment not found");

                const data = await response.json();
                setPayment(data);
                console.log("Fetched Payment Data:", data);
            }
            catch (error) {
                console.error("Error fetching Payment:", error);
            }
        }

        fetchPayment();
    }, [appointment_id, authToken]);

    const handleAcceptAppointment = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/appointment/accept/${appointment_id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Error accepting appointment");

            toast.success("Offer accepted!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
        }
        catch (error) {
            console.error("Error accepting Appointment:", error);
        }
    };

    const handleDeleteAppointment = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/appointment/${appointment_id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Error deleting appointment");

            console.log("Appointment Deleted");
        } catch (error) {
            console.error("Error deleting Appointment:", error);
        }
    };

    return (
        <>
            <div className="flex bg-purple-50">
                <FreelancerSideBar />

                <div className="h-screen flex flex-col bg-purple-50 py-16 pl-20 gap-10">
                    <p className="text-3xl font-inter font-bold">Offered project</p>

                    {appointment && (
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-6">
                                <img
                                    className="h-28 w-28 rounded-full"
                                    src={`http://localhost:3000/client_images/${appointment.client_id.profile_picture}`}
                                    alt="client_profile_picture"
                                />

                                <div className="flex flex-col gap-0.5">
                                    <p className="text-xl font-bold">{`${appointment.client_id.first_name} ${appointment.client_id.last_name}`}</p>
                                    <p>{appointment.client_id.city}</p>
                                    <p className="text-purple-500 ">{appointment.client_id.mobile_no}</p>
                                    <p className="text-purple-500 ">{appointment.client_id.email}</p>
                                </div>
                            </div>

                            <div className="bg-grey-400 h-0.5"></div>

                            <p className="font-caprasimo text-2xl text-purple-700">Project details</p>

                            <div className="flex flex-col gap-2">
                                <span className="text-purple-700 font-inter text-lg">Project:
                                    <span className="text-black-700"> {appointment.appointment_purpose}</span>
                                </span>
                                <span className="text-purple-700 font-inter text-lg">Appointment date:
                                    <span className="text-black-700"> {new Date(appointment.appointment_date).toLocaleDateString()}</span>
                                </span>
                                <span className="text-purple-700 font-inter text-lg">Project duration:
                                    <span className="text-black-700"> {`${appointment.project_duration.value} ${appointment.project_duration.unit}`}</span>
                                </span>
                                <span className="text-purple-700 font-inter text-lg">Amount:
                                    <span className="text-black-700"> Rs. {payment ? payment.amount : "Loading..."}</span>
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button className="border-2 border-red-500 rounded-3xl px-20 py-2 font-semibold text-red-500" onClick={handleDeleteAppointment}>Decline</button>
                        <button className="border-2 border-purple-400 bg-purple-400 rounded-3xl px-20 py-2 font-semibold text-white" onClick={handleAcceptAppointment}>Accept</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FreelancerOfferView;