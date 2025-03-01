import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth_context";

function EditFreelancerProfileForm({ closeForm }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset
    } = useForm({
        mode: "all"
    });

    const { authToken, userId } = useAuth();
    const [freelancer, setFreelancer] = useState({});
    const [profilePicture, setProfilePicture] = useState("");
    const [updatedProfilePicture, setUpdatedProfilePicture] = useState();
    const [backgroundPicture, setBackgroundPicture] = useState("");
    const [updatedBackgroundPicture, setUpdatedBackgroundPicture] = useState();

    useEffect(() => {
        fetch(`http://localhost:3000/api/freelancer/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setFreelancer(data);
                setValue("first_name", data.first_name);
                setValue("last_name", data.last_name);
                const formattedDob = new Date(data.date_of_birth).toISOString().split('T')[0];
                setValue("date_of_birth", formattedDob)
                setValue("mobile_no", data.mobile_no);
                setValue("address", data.address);
                setValue("city", data.city);
                setValue("password", data.password);
                setValue("profession", data.profession);
                setValue("years_of_experience", data.years_of_experience);
                setValue("skills", data.skills);
                setValue("bio", data.bio);
                setProfilePicture(data.profile_picture);
                setBackgroundPicture(data.background_picture);
            })
            .catch(err => console.error("Error fetching client:", err));
    }, [authToken, userId]);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfilePicture(imageUrl);
            setUpdatedProfilePicture(file);
        }
    };

    const handleBackgroundPictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setBackgroundPicture(imageUrl);
            setUpdatedBackgroundPicture(file);
        }
    };

    const onSubmit = async (data) => {
        const updatedData = {
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth,
            mobile_no: data.mobile_no,
            address: data.address,
            city: data.city,
            password: data.password,
            profession: data.profession,
            years_of_experience: data.years_of_experience,
            skills: data.skills,
            bio: data.bio,
        };

        if (profilePicture !== freelancer.profile_picture) {
            const formData = new FormData();
            formData.append("profile_picture", updatedProfilePicture);
            await fetch(`http://localhost:3000/api/freelancer/${userId}/profile-picture`, {
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

        if (backgroundPicture !== freelancer.background_picture) {
            const formData = new FormData();
            formData.append("background_picture", updatedBackgroundPicture);
            await fetch(`http://localhost:3000/api/freelancer/${userId}/background-picture`, {
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
                .catch((err) => console.error("Error updating background picture:", err));
        }

        await fetch(`http://localhost:3000/api/freelancer/${userId}`, {
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
            .catch((err) => console.error("Error updating freelancer data:", err));
    };

    const handleCancel = () => {
        reset(freelancer);
        setProfilePicture(freelancer.profile_picture);
        setBackgroundPicture(freelancer.background_picture);
        closeForm();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex border-2 border-grey-300 rounded-xl items-center pr-16 pl-10 py-5 bg-purple-50">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4 items-center">
                            <div className="w-44 h-44 rounded-full overflow-hidden">
                                <img src={profilePicture} className="w-full h-full object-cover" />
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                id="fileInput"
                                className="hidden"
                                onChange={handleProfilePictureChange}
                            />

                            <button
                                className="border-2 border-purple-400 rounded-3xl py-2 px-5 font-semibold text-purple-400 hover:text-purple-50 hover:bg-purple-400"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('fileInput').click();
                                }}
                            >
                                Update profile picture
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="w-80 h-60 overflow-hidden">
                                <img src={backgroundPicture.startsWith("blob:") ? backgroundPicture : `http://localhost:3000/freelancer_images/${backgroundPicture}`} 
                                className="w-full h-full object-cover" />
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                id="fileInput2"
                                className="hidden"
                                onChange={handleBackgroundPictureChange}
                            />

                            <button
                                className="border-2 border-purple-400 rounded-3xl py-2 font-semibold text-purple-400 hover:text-purple-50 hover:bg-purple-400"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('fileInput2').click();
                                }}
                            >
                                Update background picture
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col pl-10 py-6 gap-3">
                        <p className="text-xl font-inter font-bold text-purple-700">Update profile</p>

                        <div className="flex gap-10">
                            <div className="flex flex-col gap-3 flex-1">
                                <div className="flex gap-8">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-grey-500">First name</p>
                                        <input
                                            name="first_name"
                                            {...register("first_name")}
                                            className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="text-grey-500">Last name</p>
                                        <input
                                            name="last_name"
                                            {...register("last_name")}
                                            className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-inter text-purple-700 text-[15px] ml-2">Date of birth</label>
                                    <input type="date" className="border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                                        {...register("date_of_birth")} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-grey-500">Mobile number</p>
                                    <input
                                        name="mobile_no"
                                        {...register("mobile_no")}
                                        className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-grey-500">Address</p>
                                    <input
                                        name="address"
                                        {...register("address")}
                                        className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-grey-500">City</p>
                                    <select
                                        className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
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
                                        className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 flex-1">
                                <div className="flex flex-col gap-2">
                                    <p className="text-grey-500">Profession</p>
                                    <input
                                        name="profession"
                                        {...register("profession")}
                                        className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                    />
                                </div>

                                <div>
                                    <label className="font-inter text-purple-700 text-[15px] ml-2">Years of experience</label>
                                    <select
                                        {...register("years_of_experience")}
                                        className="border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    >
                                        <option value=""></option>
                                        {Array.from({ length: 51 }, (_, index) => (
                                            <option key={index} value={index}>
                                                {index}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-grey-500">Skills</p>
                                    <input
                                        name="skills"
                                        {...register("skills")}
                                        className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-grey-500">Bio</label>
                                    <textarea
                                        name="bio"
                                        {...register("bio")}
                                        className="border border-purple-700 bg-purple-50 p-2 w-full h-40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-5">
                            <button className="border-2 border-purple-400 rounded-3xl px-20 py-2 font-semibold text-purple-400"
                                type="button"
                                onClick={handleCancel}>Cancel</button>
                            <button
                                type="submit"
                                className="border-2 border-purple-400 bg-purple-400 rounded-3xl px-20 py-2 font-semibold text-white">Update</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default EditFreelancerProfileForm;