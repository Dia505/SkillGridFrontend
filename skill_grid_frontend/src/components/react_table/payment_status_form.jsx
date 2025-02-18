import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth_context";

function PaymentStatusForm({ projectId, onClose }) {
    const [isPaid, setIsPaid] = useState(false);
    const [project, setProject] = useState({});
    const [paymentId, setPaymentId] = useState();
    const { authToken } = useAuth();

    useEffect(() => {
        fetch(`http://localhost:3000/api/appointment/${projectId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Project data: ", data);
                setProject(data);
            })
            .catch(err => console.error("Error fetching project:", err));

        fetch(`http://localhost:3000/api/payment/appointment/${projectId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(paymentData => {
                setPaymentId(paymentData._id);
                setIsPaid(paymentData.payment_status);
            })
            .catch(err => console.error("Error fetching payment status:", err));
    }, [authToken, projectId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:3000/api/payment/${paymentId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ payment_status: isPaid })
        })
            .then(res => res.json())
            .then(() => {
                toast.success("Payment status updated!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "colored",
                });
                onClose(); // Close the form after update
            })
            .catch(err => console.error("Error updating payment status:", err));
    };

    return (
        <div className="bg-purple-400 p-6 rounded-lg w-[400px]">
            <div className="flex justify-between">
                <h2 className="text-xl font-caprasimo mb-4 text-white">Update Payment Status</h2>
                <button onClick={onClose} className="text-blue-100 font-bold text-2xl mb-2">X</button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    <p className="text-white font-medium text-lg text-underline">{project.appointment_purpose}</p>

                    {project.client_id && (
                        <div className="flex gap-2 items-center">
                            <img
                                className="h-16 w-16 rounded-full"
                                src={`http://localhost:3000/client_images/${project.client_id.profile_picture}`}
                                alt="client_profile_picture"
                            />
                            <p className="text-white">{project.client_id.first_name} {project.client_id.last_name}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <label className="text-white font-medium">Payment Status</label>
                        <div className="flex items-center gap-2">
                            <p className={`${isPaid ? "text-green-700" : "text-grey-300"}`}>
                                {isPaid ? "Paid" : "Unpaid"}
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsPaid(!isPaid)}
                                className={`w-16 h-8 flex items-center rounded-full p-1 transition ${isPaid ? "bg-green-700" : "bg-grey-300"}`}
                            >
                                <div
                                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${isPaid ? "translate-x-8" : "translate-x-0"}`}
                                ></div>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-50 text-purple-700 font-semibold py-2 rounded-xl"
                    >
                        Update Status
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PaymentStatusForm;
