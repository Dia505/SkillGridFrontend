import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import Footer from "../../../components/footer";
import ClientDashboardNavbarWithToken from "../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../components/navigation_bar/client_dashboard_navbar_without_token";

const billingAndPaymentSchema = yup.object().shape({
    payment_method: yup.string().required("*required"),
    address: yup.string().required("*required"),
    city: yup.string().required("*required"),
});

function BillingAndPayment() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

    let isTokenValid = false;

    const location = useLocation();
    const formData = location.state?.formData;
    const { freelancerId } = location.state || {};
    const [freelancer, setFreelancer] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    console.log("Form data: ", formData);

    const {
        register,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(billingAndPaymentSchema),
        mode: "all"
    });

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                isTokenValid = true;
            } else {
                localStorage.removeItem("authData");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("authData");
        }
    }

    useEffect(() => {
        async function fetchFreelancer() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer/${freelancerId}`);
                if (!response.ok) throw new Error("Freelancer not found");

                const data = await response.json();
                setFreelancer(data);
            } catch (error) {
                console.error("Error fetching freelancer:", error);
            }
        }

        fetchFreelancer();
    }, [freelancerId]);

    const handleChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] px-60 pt-10 pb-20 gap-10 items-center">
                    <p className="font-extrabold text-3xl text-purple-700">Billing and Payment</p>

                    {freelancer && (
                        <div className="flex pl-20 gap-10">
                            <div className="w-[380px] flex flex-col bg-gradient-to-b from-purple-200 to-purple-50 border-2 border-purple-200 pl-5 pr-5 py-8 rounded-xl gap-5">
                                <div className="w-[110px] h-[110px] rounded-full overflow-hidden ml-28">
                                    <img
                                        src={`${freelancer.profile_picture}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col ml-5">
                                        <p className="text-xl font-inter font-bold text-white">{`${freelancer.first_name} ${freelancer.last_name}`}</p>
                                        <p className="text-lg text-white font-light">{`${freelancer.profession}`}</p>
                                        <p className="text-base text-purple-500 font-medium">{`${freelancer.address}, ${freelancer.city}`}</p>
                                        <p className="text-base text-purple-500 font-medium">{`${freelancer.mobile_no}`}</p>
                                    </div>

                                    <div className="w-full h-0.5 bg-white"></div>

                                    {formData && (
                                        <div className="flex flex-col ml-5 mr-5 gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-inter">Service:
                                                    <span className="font-bold"> {`${formData.selectedService.service_id.service_name}`}</span>
                                                </span>

                                                <p className="font-bold text-purple-500">Rs. {`${formData.selectedService.hourly_rate}`}/hr</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-inter">Reason for appointment:</p>
                                                <p className="font-bold break-words">{`${formData.appointment_purpose}`}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-inter">Appointment date:</p>
                                                <p className="font-bold">{`${formData.appointment_date}`}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-inter">Project duration:</p>
                                                <p className="font-bold">{`${formData.project_duration.value}`} {`${formData.project_duration.unit}`}</p>
                                            </div>
                                            {formData.appointment_time != "" && (<div className="flex items-center gap-2">
                                                <p className="font-inter">Appointment time:</p>
                                                <p className="font-bold">{`${formData.appointment_time}`}</p>
                                            </div>)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <form>
                                <div className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-4">
                                        <span className="font-inter text-xl font-medium ml-2">Select a payment method
                                            <span className="text-red-500">*</span>
                                        </span>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="Cash"
                                                checked={selectedPaymentMethod === "Cash"}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition ${selectedPaymentMethod === "Cash" ? "border-purple-200" : "border-grey-400"
                                                }`}>
                                                {selectedPaymentMethod === "Cash" && (
                                                    <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                                                )}
                                            </div>
                                            <span>Cash</span>
                                        </label>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="Credit/Debit card"
                                                checked={selectedPaymentMethod === "Credit/Debit card"}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition ${selectedPaymentMethod === "Credit/Debit card" ? "border-purple-200" : "border-grey-400"
                                                }`}>
                                                {selectedPaymentMethod === "Credit/Debit card" && (
                                                    <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span>Credit/Debit card</span>
                                                <img className="h-6" src="/pngwing.com.png" />
                                                <img className="h-4" src="/pngwing.com (1).png" />
                                            </div>
                                        </label>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="eSewa"
                                                checked={selectedPaymentMethod === "eSewa"}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition ${selectedPaymentMethod === "eSewa" ? "border-purple-200" : "border-grey-400"
                                                }`}>
                                                {selectedPaymentMethod === "eSewa" && (
                                                    <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                                                )}
                                            </div>
                                            <img className="h-5" src="/esewa-seeklogo[1].png" />
                                        </label>

                                        {errors.payment_method && <p style={{ color: "red" }}>{errors.payment_method.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <span className="font-inter text-xl font-medium ml-2">Billing address
                                            <span className="text-red-500">*</span>
                                        </span>
                                        <input
                                            type="address"
                                            className={`border ${errors.address ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.address ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                        />
                                        {errors.address && <p className="mt-1 text-sm text-red-500">{errors?.address?.message}</p>}

                                        <select
                                            className={`border ${errors.city ? "border-red-500" : "border-purple-700"} 
                                        bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                        ${errors.city ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                            {...register("city")}
                                        >
                                            <option value="">Select a city</option>
                                            <option value="Kathmandu">Kathmandu</option>
                                            <option value="Lalitpur">Lalitpur</option>
                                            <option value="Bhaktapur">Bhaktapur</option>
                                            <option value="Pokhara">Pokhara</option>
                                            <option value="Chitwan">Chitwan</option>
                                            <option value="Lumbini">Lumbini</option>
                                            <option value="Janakpur">Janakpur</option>
                                            <option value="Biratnagar">Biratnagar</option>
                                            <option value="Dharan">Dharan</option>
                                            <option value="Butwal">Butwal</option>
                                        </select>

                                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors?.city?.message}</p>}
                                    </div>

                                    <button className="bg-grey-50 rounded-xl px-20 py-2 font-semibold text-grey-500">Send an offer</button>

                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}

export default BillingAndPayment;