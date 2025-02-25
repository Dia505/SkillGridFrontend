import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import AppLogo from "../../../components/app_logo/app_logo";

const emailForOtpSchema = yup.object().shape({
    email: yup.string().required("*required")
});

function EmailForOtpScreen() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(emailForOtpSchema),
        mode: "all",
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:3000/api/reset/send-otp", data);
            console.log("Email: ", data.email);
            navigate('/otp-verification', { state: { email: data.email } });
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("There was an error sending OTP. Please try again.");
        }
    };

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col pt-10 pl-16 bg-purple-700">
                <AppLogo />

                <div className="flex justify-center 1300:gap-60 1175:gap-20 1080:gap-10 items-center pt-8">
                    <div className="w-[500px] hidden 1080:block">
                        <img src="forgot_password.png" />
                        <p className='font-caprasimo text-purple-50 text-xl text-center'>Your Account's Security Starts with a Strong Password</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="575:w-[456px] 500:w-[430px] pb-72 flex gap-7 bg-purple-50 rounded-[22px] pt-16 pl-12 pr-16 700:mr-0 500:mr-16">
                            <ArrowLeftIcon className= "h-6 text-purple-700 cursor-pointer" onClick={() => navigate("/login")} />

                            <div className='flex flex-col gap-8 mt-7'>
                                <div>
                                    <p className="font-caprasimo text-purple-700 text-[28px]">Forgot password?</p>
                                    <p className="font-inter text-purple-700">Enter your email to receive an OTP</p>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="email"
                                        {...register("email")}
                                        className={`border ${errors.email ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 -ml-3 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.email ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors?.email?.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-[295px] h-[43px] text-purple-50 font-caprasimo text-lg bg-purple-700 rounded-xl border-2 border-transparent hover:bg-purple-50 hover:text-purple-700 hover:border-purple-700 -ml-5"
                                >
                                    Get OTP
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EmailForOtpScreen;