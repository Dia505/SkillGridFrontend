import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import AppLogo from "../../../components/app_logo";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "all",
    });

    const navigate = useNavigate();

    const login = useMutation({
        mutationKey: "LOGIN",
        mutationFn: async (data) => {
            const response = await axios.post("http://localhost:3000/api/auth/login", data);
            return response.data;
        },
        onSuccess: (response) => {
            alert(`Login successful!`);
            console.log(response);
            localStorage.setItem("authToken", response.token);
            localStorage.setItem("role", response.role);

            if (response.role == "client") {
                navigate("/client-dashboard");
            }
            else if (response.role == "freelancer") {
                navigate("/freelancer-dashboard");
            }
            else if (response.role == "admin") {
                navigate("/admin-dashboard");
            }
        },
        onError: (error) => {
            console.log(error.response?.data)

            if (error.response?.status === 403) {
                if (error.response?.data == "Incorrect email address") {
                    setError("email", { type: "manual", message: "Incorrect email address" });
                }
                if (error.response?.data == "Incorrect password") {
                    setError("password", { type: "manual", message: "Incorrect password" });
                }
            }

            alert(error.response?.data?.message || "Login failed!");
        },
    });

    const onSubmit = (values) => {
        login.mutate(values);
    };

    return (
        <div className="min-h-screen flex flex-col pt-10 pl-16 bg-purple-700">
            <AppLogo />

            <div className="flex justify-center items-center gap-60 pt-8">
                <div className="flex flex-col items-center gap-4">
                    <img src="src/assets/login_carousel_img1.png" />
                    <p className="font-caprasimo text-purple-50 text-3xl">Where Skills Find Purpose</p>
                    <div className="w-[365px]">
                        <p className="font-inter text-purple-50 text-lg font-light text-center">Connecting clients and freelancers for impactful projects</p>
                    </div>
                </div>

                <div className="w-[456px] h-[621px] flex flex-col gap-8 bg-purple-50 rounded-[22px] pt-16 pl-12 pr-16">
                    <div>
                        <p className="font-caprasimo text-purple-700 text-[28px]">Welcome Back!</p>
                        <p className="font-inter text-purple-700">Log in to your account</p>
                    </div>

                    <div className="flex flex-col gap-6">
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

                        <div className="flex gap-20">
                            <label class="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 appearance-none bg-purple-50 border border-purple-700 rounded focus:outline-none checked:bg-purple-700 checked:border-purple-700 checked:before:content-['✔'] checked:before:text-purple-50 checked:before:flex checked:before:items-center checked:before:justify-center"
                                />
                                <span class="text-purple-700 font-inter">Remember me</span>
                            </label>

                            <p className="text-purple-700 font-inter hover:underline cursor-pointer">Forgot password</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mt-8">
                        <button
                            type="submit"
                            className="w-[295px] h-[43px] text-purple-50 font-caprasimo text-lg bg-purple-700 rounded-xl border-2 border-transparent hover:bg-purple-50 hover:text-purple-700 hover:border-purple-700"
                        >
                            Log In
                        </button>


                        <div className="flex gap-2">
                            <p className="font-inter text-purple-700">New to SkillGrid?</p>
                            <p className="font-caprasimo text-purple-700 hover:underline cursor-pointer">Sign Up</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
