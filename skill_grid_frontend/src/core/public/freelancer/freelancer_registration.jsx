import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import AppLogo from "../../../components/app_logo/app_logo";

const freelancerSchema = yup.object().shape({
    first_name: yup.string().required("*required"),
    last_name: yup.string().required("*required"),

    date_of_birth: yup
        .string()
        .required("*required")
        .test("age", "You must be 18 years or older", function (value) {
            const today = new Date();
            const minDate = new Date(today);
            minDate.setFullYear(today.getFullYear() - 18); // 18 years ago

            const selectedDate = new Date(value);

            // Check if the selected date is within the allowed range (between 18 and 65)
            return selectedDate <= minDate;
        }),

    mobile_no: yup.string().matches(/^9[678]\d{8}$/, "Invalid mobile number").required("*required"),
    address: yup.string().required("*required"),
    city: yup.string().required("*required"),
    email: yup.string().email("Invalid email").required("*required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password cannot exceed 16 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .required("Password is required"),
    terms: yup
        .boolean()
        .oneOf([true])
        .required("You must accept the terms and conditions"),
});

function FreelancerRegistration() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(freelancerSchema),
        mode: "all"
    });
    const navigate = useNavigate();

    console.log(errors)

    const saveFreelancerData = useMutation({
        mutationKey: "SAVEDATA",
        mutationFn: (requestData) => {
            console.log(requestData)
            return axios.post("http://localhost:3000/api/freelancer", requestData)
        },
        onSuccess: (data) => {
            console.log('Navigating to /build-your-profile');
            const token = data.data.token;
            localStorage.setItem("authToken", token);
            navigate("/build-your-profile");
        },
        onError: (error) => {
            console.error("Error saving freelancer data:", error);
            alert("Failed to save freelancer data. Please try again.");
        },
    })

    const onSubmit = (values) => {
        // Remove the 'terms' field from the form data before submitting
        const { terms, ...filteredValues } = values;

        // Pass the modified data to the mutation function
        saveFreelancerData.mutate(filteredValues);
    };

    const today = new Date();

    // Calculate the date 18 years ago
    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - 18);

    // Calculate the date 65 years ago
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - 65);

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col pt-10 pl-16 pb-20 bg-purple-700">
                <AppLogo />

                <div className="flex justify-center 1472:gap-20 1306:gap-10 1306:mr-0 1250:mr-10 1175:mr-20">
                    <img className="w-[416px] h-[299px] self-end hidden 1175:block" src="src/assets/registration_img1.png" />

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="575:w-[456px] 500:w-[380px] h-auto flex flex-col gap-6 bg-purple-50 rounded-[22px] pt-12 pb-12 pl-12 pr-16 800:mt-0 800:mr-0 500:mt-10 500:mr-16">
                            <div>
                                <p className="font-caprasimo text-purple-700 text-[28px]">Sign up</p>
                                <p className="font-inter text-purple-700">Find the work you love</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div>
                                        <label className="font-inter text-purple-700 text-[15px] ml-2">First name</label>
                                        <input
                                            type="first_name"
                                            {...register("first_name")}
                                            className={`border ${errors.first_name ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.first_name ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                        />
                                        {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors?.first_name?.message}</p>}
                                    </div>

                                    <div>
                                        <label className="font-inter text-purple-700 text-[15px] ml-2">Last name</label>
                                        <input
                                            type="last_name"
                                            {...register("last_name")}
                                            className={`border ${errors.last_name ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.last_name ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                        />
                                        {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors?.last_name?.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-inter text-purple-700 text-[15px] ml-2">Date of birth</label>
                                    <input type="date" className={`border ${errors.city ? "border-red-500" : "border-purple-700"} 
                                        bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                        ${errors.city ? "focus:ring-red-500" : "focus:ring-purple-700"}`} {...register("date_of_birth")} />

                                    <p className="mt-1 text-sm text-red-500">{errors?.date_of_birth?.message}</p>
                                </div>

                                <div>
                                    <label className="font-inter text-purple-700 text-[15px] ml-2">Mobile number</label>
                                    <input
                                        type="mobile_no"
                                        {...register("mobile_no")}
                                        className={`border ${errors.mobile_no ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.mobile_no ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                    />
                                    {errors.mobile_no && <p className="mt-1 text-sm text-red-500">{errors?.mobile_no?.message}</p>}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div>
                                            <label className="font-inter text-purple-700 text-[15px] ml-2">Address</label>
                                            <input
                                                type="address"
                                                {...register("address")}
                                                className={`border ${errors.address ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.address ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                            />
                                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors?.address?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="font-inter text-purple-700 text-[15px] ml-2">City</label>
                                            <select
                                                className={`border ${errors.city ? "border-red-500" : "border-purple-700"} 
                                        bg-purple-50 p-2 w-[163px] rounded-xl focus:outline-none focus:ring-2 
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
                                    </div>
                                </div>

                                <div>
                                    <label className="font-inter text-purple-700 text-[15px] ml-2">Email address</label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className={`border ${errors.email ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.email ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors?.email?.message}</p>}
                                </div>

                                <div>
                                    <label className="font-inter text-purple-700 text-[15px] ml-2">Password</label>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className={`border ${errors.password ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.password ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors?.password?.message}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <label className="flex items-start space-x-2">
                                    <input
                                        type="checkbox"
                                        {...register("terms")}
                                        className={`h-5 w-5 appearance-none bg-purple-50 border ${errors.terms ? "border-red-500" : "border-purple-700"
                                            } rounded focus:outline-none checked:bg-purple-700 checked:border-purple-700 shrink-0`}
                                    />
                                    <span className="text-grey-700 font-inter text-[13px] leading-tight">
                                        Yes, I understand and agree to the
                                        <span className="text-purple-700 underline"> SkillGrid Terms of Service</span>, including the
                                        <span className="text-purple-700 underline"> User Agreement</span> and
                                        <span className="text-purple-700 underline"> Privacy Policy</span>.
                                    </span>
                                </label>


                                <button
                                    type="submit"
                                    className="w-[295px] h-[43px] text-purple-50 font-caprasimo text-lg bg-purple-700 rounded-xl border-2 border-transparent hover:bg-purple-50 hover:text-purple-700 hover:border-purple-700"
                                >
                                    Create Account
                                </button>

                                <div className="flex gap-2">
                                    <p className="font-inter font-light text-purple-700">Already have an account?</p>
                                    <p className="font-caprasimo text-purple-700 hover:underline cursor-pointer" onClick={() => navigate("/login")}>Log In</p>
                                </div>
                            </div>
                        </div>
                    </form>

                    <img className="w-[360px] h-[312px] hidden 1175:block" src="src/assets/registration_img2.png" />
                </div>
            </div>
        </>
    );
}

export default FreelancerRegistration;