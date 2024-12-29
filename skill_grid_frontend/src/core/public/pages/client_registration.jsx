import React, { useState } from "react";

function ClientRegistration() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_no: "",
        city: "",
        email: "",
        password: "",
    });

    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("Sending...");

        try {
            const response = await fetch("http://localhost:3000/api/client", {
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

    return (
        <div className="m-5">
            <h2 className="text-2xl font-bold mb-4">Client Registration</h2>
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
                </label>
                <button type="submit" className="bg-blue-500 text-white py-2 rounded">
                    Register
                </button>
            </form>
            {responseMessage && <p className="mt-4 text-green-500">{responseMessage}</p>}
        </div>
    );
}

export default ClientRegistration;
