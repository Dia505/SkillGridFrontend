import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Footer from "../../../components/footer";
import ClientDashboardNavbarWithToken from "../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../components/navigation_bar/client_dashboard_navbar_without_token";

const appointmentSchema = yup.object().shape({
    service_name: yup.string().required("*required"),
    appointment_purpose: yup.string().required("*required"),
    appointment_date: yup
        .string()
        .required("*required")
        .test("is-future-date", "*Appointment date must be today or later", (value) => {
            return new Date(value) >= new Date().setHours(0, 0, 0, 0);
        }),
    project_duration: yup.object().shape({
        value: yup
            .number()
            .typeError("*Value must be a number")
            .required("*required")
            .min(1, "*Duration must be at least 1"),

        unit: yup
            .string()
            .required("*required")
    }),
    terms: yup
        .boolean()
        .oneOf([true])
});

function SendAnOffer() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

    let isTokenValid = false;

    const {
        register,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(appointmentSchema),
        mode: "all"
    });

    const location = useLocation();
    const { freelancerId } = location.state || {};
    const [freelancer, setFreelancer] = useState(null);
    const [service, setService] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const navigate = useNavigate();

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

        async function fetchFreelancerService() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer-service/freelancer/${freelancerId}`);
                const data = await response.json();
                setService(data);
            } catch (error) {
                console.error("Error fetching freelancer service:", error);
            }
        }

        fetchFreelancerService();
    }, [freelancerId]);

    const handleServiceChange = (event) => {
        const selectedServiceId = event.target.value;
        const serviceData = service.find((s) => s.hourly_rate.toString() === selectedServiceId);
        setSelectedService(serviceData);
    };

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                {freelancer && (
                    <div className="flex flex-col mt-[90px] px-60 pt-10 pb-20 gap-10 items-center">
                        <p className="font-extrabold text-3xl text-purple-700">Send an Offer</p>

                        <div className="flex pl-20 gap-10">
                            <div className="w-[370px] flex flex-col items-center bg-purple-200 pl-5 pr-5 pt-8 rounded-xl gap-5">
                                <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
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

                                    <div className="flex flex-wrap gap-3">
                                        {freelancer?.skills && (
                                            <div className="flex flex-wrap gap-2">
                                                {freelancer.skills.split(",").map((skill, index) => (
                                                    <span key={index} className="bg-purple-100 px-4 py-2 rounded-full text-sm">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <form>
                                <div className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-4">
                                        <span className="font-inter text-xl font-medium ml-2">Select a service
                                            <span className="text-red-500">*</span>
                                        </span>
                                        <select
                                            className={`border ${errors.service_name ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.service_name ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                            {...register("service_name")}
                                            onChange={handleServiceChange}
                                        >
                                            <option value="">Select a service</option>
                                            {service && service.map((s, index) => (
                                                <option key={index} value={s.hourly_rate}>
                                                    {s.service_id.service_name}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedService && (
                                            <span className="text-lg">Charge:
                                                <span className="font-bold text-purple-400">{` Rs. ${selectedService.hourly_rate}/hr`}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <span className="font-inter text-xl font-medium ml-2">Reason for appointment
                                            <span className="text-red-500">*</span>
                                        </span>
                                        <input
                                            type="appointment_purpose"
                                            className={`border ${errors.appointment_purpose ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.appointment_purpose ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                        />
                                        {errors.appointment_purpose && <p className="mt-1 text-sm text-red-500">{errors?.appointment_purpose?.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <span className="font-inter text-xl font-medium ml-2">Appointment date
                                            <span className="text-red-500">*</span>
                                        </span>
                                        <input type="date" className={`border ${errors.appointment_date ? "border-red-500" : "border-purple-700"} 
                                        bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                        ${errors.appointment_date ? "focus:ring-red-500" : "focus:ring-purple-700"}`} />

                                        <p className="mt-1 text-sm text-red-500">{errors?.appointment_date?.message}</p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <span className="font-inter text-xl font-medium ml-2">Project duration
                                            <span className="text-red-500">*</span>
                                        </span>

                                        <div className="flex gap-4">
                                            <div>
                                                <input
                                                    placeholder="Enter a number"
                                                    className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                                />
                                            </div>

                                            <div>
                                                <select
                                                    className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                                >
                                                    <option value="">Select a duration</option>
                                                    <option value="hour">hour</option>
                                                    <option value="day">day</option>
                                                    <option value="week">week</option>
                                                    <option value="month">month</option>
                                                    <option value="year">year</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <p className="font-inter text-xl font-medium ml-2">Appointment time</p>
                                        <input
                                            type="time"
                                            className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>


                        <div className="w-full h-0.5 bg-grey-500"></div>

                        <label className="flex items-center gap-2 ml-20">
                            <input
                                type="checkbox"
                                className={`h-7 w-7 appearance-none bg-purple-50 border ${errors.terms ? "border-red-500" : "border-purple-700"
                                    } rounded focus:outline-none checked:bg-purple-700 checked:border-purple-700 shrink-0`}
                            />
                            <span className="text-grey-700 font-inter text-base leading-tight">
                                Yes, I understand and agree to the
                                <span className="text-purple-700 underline"> SkillGrid Terms of Service</span>, including the
                                <span className="text-purple-700 underline"> User Agreement</span> and
                                <span className="text-purple-700 underline"> Privacy Policy</span>.
                            </span>
                        </label>

                        <div className="flex gap-4">
                            <button className="border-2 border-purple-400 rounded-3xl px-20 py-2 font-semibold text-purple-400" 
                                onClick={() => navigate(`/freelancer-profile/${freelancer._id}`)}>Cancel</button>
                            <button 
                                type="submit" 
                                onClick={() => {
                                    navigate("/billing-and-payment", { state: { freelancerId: freelancer._id } });
                                  }}
                                className="border-2 border-purple-400 bg-purple-400 rounded-3xl px-20 py-2 font-semibold text-white">Continue</button>
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </>
    )
}

export default SendAnOffer;