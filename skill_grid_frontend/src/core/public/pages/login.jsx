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

            <div className="flex justify-center">
                <div className="flex flex-col items-center gap-4">
                    <img src="src/assets/login_carousel_img1.png" />
                    <p className="font-caprasimo text-purple-50 text-3xl">Where Skills Find Purpose</p>
                    <div className="w-[365px]">
                        <p className="font-inter text-purple-50 text-lg font-light text-center">Connecting clients and freelancers for impactful projects</p>
                    </div>
                </div>

                <div className="w-[456px] h-[621px] flex bg-purple-50 rounded-[22px]">

                </div>
            </div>
        </div>
    );
}

export default Login;
