import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth_context";

function EditClientContract({ projectId, onClose }) {
    const [project, setProject] = useState({});
    const [payment, setPayment] = useState({});
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const { authToken } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: "all",
        defaultValues: {
            appointment_purpose: "",
            payment_method: "",
        }
    });

    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedPaymentMethod(value);
        setValue("payment_method", value);
        clearErrors("payment_method");
    };

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
                setValue("appointment_purpose", data.appointment_purpose || "");
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
                setPayment(paymentData);
                setSelectedPaymentMethod(paymentData.payment_method || "");
                setValue("payment_method", paymentData.payment_method || "");
            })
            .catch(err => console.error("Error fetching payment status:", err));
    }, [authToken, projectId, setValue]);

    const onSubmit = async (data) => {
        try {
            if (data.appointment_purpose !== project.appointment_purpose) {
                // Update appointment purpose
                await fetch(`http://localhost:3000/api/appointment/${projectId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ appointment_purpose: data.appointment_purpose }),
                });
            }

            if (data.payment_method !== payment.payment_method) {
                await fetch(`http://localhost:3000/api/payment/${payment._id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ payment_method: data.payment_method }),
                });
            }

            toast.success("Contract updated!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            onClose();
        } catch (error) {
            console.error("Error updating contract:", error);
            alert("Failed to update contract. Please try again.");
        }
    };

    return (
        <div className="bg-purple-400 p-6 rounded-lg w-[400px]">
            <div className="flex justify-between">
                <h2 className="text-xl font-caprasimo mb-4 text-white">Update the Contract</h2>
                <button onClick={onClose} className="text-blue-100 font-bold text-2xl mb-2">X</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="font-inter text-purple-50 text-lg font-medium ml-2">Reason for appointment</p>
                    <input
                        type="text"
                        name="appointment_purpose"
                        {...register("appointment_purpose")}
                        className={"border border-purple-700 bg-purple-50 text-sm p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <p className="font-inter text-purple-50 text-lg font-medium ml-2">Select a payment method</p>

                    {[
                        { method: "Cash", image: null },
                        { method: "Credit/Debit card", images: ["/pngwing.com.png", "/pngwing.com (1).png"] },
                        { method: "eSewa", images: ["/esewa-seeklogo[1].png"], noText: true }
                    ].map(({ method, images, noText }) => (
                        <label key={method} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="payment_method"
                                value={method}
                                checked={selectedPaymentMethod === method}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition ${selectedPaymentMethod === method ? "border-purple-50" : "border-grey-300"
                                }`}>
                                {selectedPaymentMethod === method && (
                                    <div className="w-3 h-3 bg-purple-50 rounded-full"></div>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {!noText && <span>{method}</span>}
                                {images && images.map((src, index) => (
                                    <img key={index} className="h-5" src={src} alt={`${method} logo`} />
                                ))}
                            </div>
                        </label>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-50 text-purple-700 font-semibold py-2 rounded-xl mt-2"
                >
                    Update Contract
                </button>
            </form>
        </div>
    );
}

export default EditClientContract;
