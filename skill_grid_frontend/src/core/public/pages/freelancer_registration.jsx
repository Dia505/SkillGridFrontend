import React, { useState } from "react";

function FreelancerRegistration() {
    const [formData, setFormData] = useState({
            first_name: "",
            last_name: "",
            date_of_birth: "",
            mobile_no: "",
            address: "",
            city: "",
            email: "",
            password: "",
        });
    
        const [responseMessage, setResponseMessage] = useState("");
        const [errors, setErrors] = useState({});
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
            validateFields(name, value);
        };
    
        const validateField = (name, value) => {
            let error = "";
    
            switch (name) {
                case "mobile_no":
                    if (!/^\d{10}$/.test(value)) {
                        error = "Enter a valid 10-digit mobile number.";
                    }
                    break;
    
                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        error = "Enter a valid email address.";
                    }
                    break;
    
                case "password":
                    if (value.length < 6) {
                        error = "Password must be at least 6 characters.";
                    }
                    break;
    
                default:
                    break;
            }
    
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: error,
            }));
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
    
            // Validate all fields before submitting
            const newErrors = {};
            for (const field in formData) {
                validateField(field, formData[field]);
                if (!formData[field]) {
                    newErrors[field] = "*required";
                }
            }
    
            setErrors(newErrors);
    
            // Check if there are any validation errors
            if (Object.keys(newErrors).length > 0) {
                setResponseMessage("Please fix the errors above.");
                return;
            }
            
            setResponseMessage("Sending...");
    
            try {
                const response = await fetch("http://localhost:3000/api/freelancer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
    
                const result = await response.json();
                if (response.ok) {
                    setResponseMessage("Registration successful!");
                } else {
                    setResponseMessage(`Error: ${result.message || "Something went wrong."}`);
                }
            } catch (error) {
                setResponseMessage(`Error: ${error.message}`);
            }
        };

    return(
        <div className="m-5">
            <h2 className="text-2xl font-bold mb-4">Freelancer Registration</h2>
            <form onSubmit={handleSubmit} className="flex flex-col max-w-md">
                <label className="mb-2">
                    First name:
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded mb-4"
                    />
                    {errors.first_name && <span className="text-red-500">{errors.first_name}</span>}
                </label>
                <label className="mb-2">
                    Last name:
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded mb-4"
                    />
                    {errors.last_name && <span className="text-red-500">{errors.last_name}</span>}
                </label>
                <label className="mb-2">
                    Date of birth:
                    <input
                        type="text"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded mb-4"
                    />
                    {errors.date_of_birth && <span className="text-red-500">{errors.date_of_birth}</span>}
                </label>
                <label className="mb-2">
                    Mobile number:
                    <input
                        type="text"
                        name="mobile_no"
                        value={formData.mobile_no}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded mb-4"
                    />
                    {errors.mobile_no && <span className="text-red-500">{errors.mobile_no}</span>}
                </label>
                <label className="mb-2">
                    Mobile number:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded mb-4"
                    />
                    {errors.address && <span className="text-red-500">{errors.address}</span>}
                </label>
                <label className="mb-2">
                    City:
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange} // Handle selection changes
                        required
                        className="border p-2 rounded mb-4"
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
                    {errors.city && <span className="text-red-500">{errors.city}</span>}
                </label>
                <label className="mb-2">
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded mb-4"
                    />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                </label>
                <label className="mb-2">
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded mb-4"
                    />
                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                </label>
                <button type="submit" className="bg-blue-500 text-white py-2 rounded">
                    Register
                </button>
            </form>
            {responseMessage && <p className="mt-4 text-green-500">{responseMessage}</p>}
        </div>
    );
}

export default FreelancerRegistration;