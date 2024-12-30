import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

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

    console.log(errors)

    const saveFreelancerData = useMutation({
        mutationKey: "SAVEDATA",
        mutationFn: (requestData) => {
            console.log(requestData)
            return axios.post("http://localhost:3000/api/freelancer", requestData)
        }
    })

    const onSubmit = (values) => {
        saveFreelancerData.mutate(values)
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
            <h2 className="text-2xl font-bold mb-4">Freelancer Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>First name: </label>
                    <input className="border p-2 rounded mb-4" {...register("first_name")} />

                    <p style={{ color: "red" }}>{errors?.first_name?.message}</p>

                </div>

                <div>
                    <label>Last name: </label>
                    <input className="border p-2 rounded mb-4" {...register("last_name")} />

                    <p style={{ color: "red" }}>{errors?.last_name?.message}</p>

                </div>

                <div>
                    <label>Date of birth: </label>
                    <input type="date" className="border p-2 rounded mb-4" {...register("date_of_birth")}/>

                    <p style={{ color: "red" }}>{errors?.date_of_birth?.message}</p>
                </div>

                <div>
                    <label>Mobile number: </label>
                    <input className="border p-2 rounded mb-4" {...register("mobile_no")} />

                    <p style={{ color: "red" }}>{errors?.mobile_no?.message}</p>

                </div>

                <div>
                    <label>Address: </label>
                    <input className="border p-2 rounded mb-4" {...register("address")} />

                    <p style={{ color: "red" }}>{errors?.address?.message}</p>

                </div>

                <label className="mb-2">
                    City:
                    <select
                        className="border p-2 rounded mb-4"
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
                    <p style={{ color: "red" }}>{errors?.city?.message}</p>
                </label>

                <div>
                    <label>Email: </label>
                    <input className="border p-2 rounded mb-4" {...register("email")} />

                    <p style={{ color: "red" }}>{errors?.email?.message}</p>

                </div>

                <div>
                    <label>Password: </label>
                    <input type="password" className="border p-2 rounded mb-4" {...register("password")} />

                    <p style={{ color: "red" }}>{errors?.password?.message}</p>

                </div>

                <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">Submit</button>
            </form>
        </>
    );
}

export default FreelancerRegistration;