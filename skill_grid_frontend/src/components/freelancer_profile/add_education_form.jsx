import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAuth } from "../../context/auth_context";
import { toast } from "react-toastify";

const educationSchema = yup.object().shape({
    degree_title: yup.string().required("*required"),
    institution_name: yup.string().required("*required"),
    start_date: yup.string().required("*required"),
    end_date: yup.string().required("*required"),
});

function AddEducationForm({ closeForm }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(educationSchema),
        mode: "all"
    });

    const { authToken, userId } = useAuth();

    const onSubmit = async (data) => {
        const educationData = {
            degree_title: data.degree_title,
            institution_name: data.institution_name,
            start_date: data.start_date,
            end_date: data.end_date,
            freelancer_id: userId,
        };

        await fetch(`http://localhost:3000/api/education`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(educationData),
        })
            .then((res) => res.json())
            .then((data) => {
                toast.success("Education added!", {
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
            .catch((err) => console.error("Error saving education:", err));
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col pt-5 pb-10 px-16 relative bg-purple-50 rounded-2xl gap-2">
                    <button
                        type="button"
                        onClick={closeForm}
                        className="text-grey-400 font-light text-[40px] absolute right-7">
                        X
                    </button>

                    <h2 className="text-2xl font-inter font-bold text-purple-700 mt-14">Add education</h2>

                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Degree title</label>
                            <input
                                type="text"
                                {...register("degree_title")}
                                className={`border ${errors.degree_title ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.degree_title ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                            />
                            {errors.degree_title && <p className="mt-1 text-sm text-red-500">{errors.degree_title.message}</p>}
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Institution name</label>
                            <input
                                type="text"
                                {...register("institution_name")}
                                className={`border ${errors.institution_name ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.institution_name ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                            />
                            {errors.institution_name && <p className="mt-1 text-sm text-red-500">{errors.institution_name.message}</p>}
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Start date</label>
                            <input type="date" className={`border ${errors.start_date ? "border-red-500" : "border-purple-700"} 
                                        bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                        ${errors.start_date ? "focus:ring-red-500" : "focus:ring-purple-700"}`} {...register("start_date")} />

                            <p className="mt-1 text-sm text-red-500">{errors?.start_date?.message}</p>
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">End date</label>
                            <input type="date" className={`border ${errors.end_date ? "border-red-500" : "border-purple-700"} 
                                        bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                        ${errors.end_date ? "focus:ring-red-500" : "focus:ring-purple-700"}`} {...register("end_date")} />

                            <p className="mt-1 text-sm text-red-500">{errors?.end_date?.message}</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-purple-700 font-caprasimo text-purple-50 rounded-xl py-2 mt-5">
                        Save
                    </button>
                </div>
            </form>
        </>
    )
}

export default AddEducationForm;