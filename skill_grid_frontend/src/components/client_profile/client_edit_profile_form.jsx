import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth_context";

function ClientEditProfileForm({ closeForm }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        mode: "all"
    });

    const { authToken, userId } = useAuth();
    const [client, setClient] = useState({});
    const [image, setImage] = useState("");
    const [updatedProfilePicture, setUpdatedProfilePicture] = useState();

    useEffect(() => {
        fetch(`http://localhost:3000/api/client/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setClient(data);
                setValue("first_name", data.first_name);
                setValue("last_name", data.last_name);
                setValue("mobile_no", data.mobile_no);
                setValue("city", data.city);
                setValue("password", data.password);
                setImage(data.profile_picture);
            })
            .catch(err => console.error("Error fetching client:", err));
    }, [authToken, userId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setUpdatedProfilePicture(file);
        }
    };

    const onSubmit = async (data) => {
        const updatedData = {
            first_name: data.first_name,
            last_name: data.last_name,
            mobile_no: data.mobile_no,
            city: data.city,
        };

        if (data.password && data.password !== client.password) {
            updatedData.password = data.password;
        }

        if (image !== client.profile_picture) {
            const formData = new FormData();
            formData.append("profile_picture", updatedProfilePicture);
            await fetch(`http://localhost:3000/api/client/${userId}/profile-picture`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                },
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Profile picture updated:", data);
                })
                .catch((err) => console.error("Error updating profile picture:", err));
        }

        await fetch(`http://localhost:3000/api/client/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
            .then((res) => res.json())
            .then((data) => {
                toast.success("Profile updated!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "colored",
                });
                closeForm();
            })
            .catch((err) => console.error("Error updating client data:", err));
    };

    const handleCancel = () => {
        reset(client);
        setImage(client.profile_picture);
        closeForm();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex 1002:flex-row 500:flex-col border-2 border-grey-300 rounded-xl items-center 900:pr-16 500:pr-6 900:pl-10 py-5">
                    <div className="flex flex-col gap-4">
                        <div className="1002:w-72 1002:h-72 500:w-[32vw] 500:h-[32vw] rounded-full overflow-hidden">
                            <img src={image} className="w-full h-full object-cover" />
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        <button
                            className="border-2 border-purple-400 rounded-3xl py-2 font-semibold text-purple-400 hover:text-purple-50 hover:bg-purple-400"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent the default behavior
                                document.getElementById('fileInput').click();
                            }}
                        >
                            Update picture
                        </button>
                    </div>

                    <div className="flex flex-col pl-10 py-6 gap-3">
                        <p className="text-xl font-inter font-bold text-purple-700">Update profile</p>

                        <div className="flex gap-8">
                            <div className="flex flex-col gap-2">
                                <p className="text-grey-500">First name</p>
                                <input
                                    name="first_name"
                                    {...register("first_name")}
                                    className={"border border-purple-700 bg-purple-50 p-2 589:w-full 500:w-[34vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-grey-500">Last name</p>
                                <input
                                    name="last_name"
                                    {...register("last_name")}
                                    className={"border border-purple-700 bg-purple-50 p-2 589:w-full 500:w-[34vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-grey-500">Mobile number</p>
                            <input
                                name="mobile_no"
                                {...register("mobile_no")}
                                className={"border border-purple-700 bg-purple-50 p-2 589:w-full 500:w-[73vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-grey-500">City</p>
                            <select
                                className={"border border-purple-700 bg-purple-50 p-2 589:w-full 500:w-[73vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
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
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-grey-500">Password</p>
                            <input
                                type="password"
                                {...register("password")}
                                className={"border border-purple-700 bg-purple-50 p-2 589:w-full 500:w-[73vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                            />
                        </div>

                        <div className="flex gap-4 mt-5 flex-col sm:flex-row sm:justify-center">
                            <button
                                className="border-2 border-purple-400 rounded-3xl px-14 py-2 font-semibold text-purple-400 w-full sm:w-auto"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="border-2 border-purple-400 bg-purple-400 rounded-3xl px-14 py-2 font-semibold text-white w-full sm:w-auto"
                            >
                                Update
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </>
    )
}

export default ClientEditProfileForm;