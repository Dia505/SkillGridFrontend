import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as yup from "yup";
import AppLogo from "../../../components/app_logo/app_logo";

const resetPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password cannot exceed 16 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .required("Password is required"),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], "Passwords must match")
        .required("*required"),
});

function ResetPasswordScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {};
    console.log("Email:", email);
    console.log("OTP:", otp);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        mode: "all",
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.put("http://localhost:3000/api/reset/reset-password", {
                email: email,
                otp: otp,
                newPassword: data.password,
            });

            toast.success("Password updated!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            navigate("/login");
        } catch (err) {
            console.log(err.response ? err.response.data.message : 'Something went wrong');
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
                            <ArrowLeftIcon className="h-6 text-purple-700 cursor-pointer" onClick={() => navigate("/login")} />

                            <div className='flex flex-col gap-8 mt-7'>
                                <div>
                                    <p className="font-caprasimo text-purple-700 text-[28px]">Reset password</p>
                                    <p className="font-inter text-purple-700">Create a strong password for your account</p>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div>
                                        <label className="font-inter text-purple-700 text-[15px] ml-2">New password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            {...register("password")}
                                            className={`border ${errors.password ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.password ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors?.password?.message}</p>}
                                    </div>

                                    <div>
                                        <label className="font-inter text-purple-700 text-[15px] ml-2">Confirm password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            {...register("confirmPassword")}
                                            className={`border ${errors.confirmPassword ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.confirmPassword ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                        />
                                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors?.confirmPassword?.message}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-[295px] h-[43px] text-purple-50 font-caprasimo text-lg bg-purple-700 rounded-xl border-2 border-transparent hover:bg-purple-50 hover:text-purple-700 hover:border-purple-700 -ml-5"
                                >
                                    Update password
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPasswordScreen;