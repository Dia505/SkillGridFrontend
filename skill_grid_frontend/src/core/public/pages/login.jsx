import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className={`border ${errors.email ? "border-red-500" : "border-gray-300"
                                } p-2 w-full rounded-md focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                                }`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors?.email?.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className={`border ${errors.password ? "border-red-500" : "border-gray-300"
                                } p-2 w-full rounded-md focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
                                }`}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors?.password?.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={login.isLoading}
                    >
                        {login.isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
