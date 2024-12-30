import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Define Yup validation schema
const userSchema = yup.object().shape({
    first_name: yup.string().required("*required"),
    last_name: yup.string().required("*required"),
    mobile_no: yup.string().matches(/^9[678]\d{8}$/, "Invalid mobile number").required("*required"),
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

function App() {
    // Use React Hook Form with Yup resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userSchema),
        mode: "all"
    });

    console.log(errors)

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Client Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>First Name: </label>
                    <input className="border p-2 rounded mb-4" {...register("first_name")} />

                    <p style={{ color: "red" }}>{errors?.first_name?.message}</p>

                </div>

                <div>
                    <label>Last Name: </label>
                    <input className="border p-2 rounded mb-4" {...register("last_name")} />

                    <p style={{ color: "red" }}>{errors?.last_name?.message}</p>

                </div>

                <div>
                    <label>Mobile number: </label>
                    <input className="border p-2 rounded mb-4" {...register("mobile_no")} />

                    <p style={{ color: "red" }}>{errors?.mobile_no?.message}</p>

                </div>

                <div>
                    <label>Email: </label>
                    <input className="border p-2 rounded mb-4" {...register("email")} />
                 
                    <p style={{ color: "red" }}>{errors?.email?.message}</p>
                   
                </div>

                <div>
                    <label>Password: </label>
                    <input className="border p-2 rounded mb-4" {...register("password")} />
              
                    <p style={{ color: "red" }}>{errors?.password?.message}</p>
              
                </div>

                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default App;
