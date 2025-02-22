import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth_context";

function EditEducationForm({ closeForm, educationId }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset
    } = useForm({
        mode: "all"
    });

    const { authToken } = useAuth();
    const [education, setEducation] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/education/${educationId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setEducation(data);
                setValue("degree_title", data.degree_title);
                setValue("institution_name", data.institution_name);
                const formattedStartDate = new Date(data.start_date).toISOString().split('T')[0];
                setValue("start_date", formattedStartDate)
                const formattedEndDate = new Date(data.end_date).toISOString().split('T')[0];
                setValue("end_date", formattedEndDate)
            })
            .catch(err => console.error("Error fetching education:", err));
    }, [authToken, educationId]);

    const onSubmit = async (data) => {
        const updatedData = {
            degree_title: data.degree_title,
            institution_name: data.institution_name,
            start_date: data.start_date,
            end_date: data.end_date
        };

        await fetch(`http://localhost:3000/api/education/${educationId}`, {
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
            .catch((err) => console.error("Error updating education data:", err));
    };

    const handleCancel = () => {
        reset(education);
        closeForm();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col pt-5 pb-10 px-16 relative bg-purple-50 rounded-2xl gap-2">
                    <h2 className="text-2xl font-inter font-bold text-purple-700 mt-14">Add education</h2>

                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Degree title</label>
                            <input
                                type="degree_title"
                                {...register("degree_title")}
                                className="border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Institution name</label>
                            <input
                                type="institution_name"
                                {...register("institution_name")}
                                className="border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Start date</label>
                            <input type="date" 
                            className="border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700" 
                            {...register("start_date")} />
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">End date</label>
                            <input type="date" 
                            className="border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                            {...register("end_date")} />
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
            </form>
        </>
    )
}

export default EditEducationForm;