import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth_context";

function PaymentStatusForm({ projectId, onClose }) {
    const [isPaid, setIsPaid] = useState(false);
    const [project, setProject] = useState({});
    const { authToken } = useAuth();

    useEffect(() => {
        setIsPaid(false);  // Replace with real payment status data
    }, [projectId]);

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
                setProject(data);
            })
            .catch(err => console.error("Error fetching project:", err));
    }, [authToken, projectId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Payment status updated to: ${isPaid ? "Paid" : "Pending"}`);
    };

    return (
        <div className="bg-purple-400 p-6 rounded-lg">
            <h2 className="text-xl font-caprasimo mb-4 text-white">Update Payment Status</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    <p className="text-white font-medium text-lg">{project.appointment_purpose}</p>

                    {project.client_id && (
                        <div className="flex gap-2 items-center">
                            <img
                                    className="h-16 rounded-full"
                                    src={`http://localhost:3000/client_images/${project.client_id.profile_picture}`}
                                    alt="client_profile_picture"
                            />
                            <p className="text-white">{project.client_id.first_name} {project.client_id.last_name}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <label className="text-purple-500 text-sm font-medium">Payment Status</label>
                        <button
                            type="button"
                            onClick={() => setIsPaid(!isPaid)}
                            className={`w-16 h-8 flex items-center rounded-full p-1 transition ${isPaid ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div
                                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${isPaid ? "translate-x-8" : "translate-x-0"}`}
                            ></div>
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Status
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PaymentStatusForm;
