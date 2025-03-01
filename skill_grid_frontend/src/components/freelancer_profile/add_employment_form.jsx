import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../context/auth_context";

const employmentSchema = yup.object().shape({
    company_name: yup.string().required("*required"),
    job_title: yup.string().required("*required"),
    start_date: yup.string().required("*required"),
});

function AddEmploymentForm({ closeForm }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(employmentSchema),
        mode: "all"
    });

    const { authToken, userId } = useAuth();

    const onSubmit = async (data) => {
        const employmentData = {
            company_name: data.company_name,
            job_title: data.job_title,
            start_date: data.start_date,
            freelancer_id: userId,
        };

        if (data.end_date) {
            employmentData.end_date = data.end_date;
        }

        if (data.description.trim()) {
            employmentData.description = data.description;
        }

        await fetch(`http://localhost:3000/api/employment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employmentData),
        })
            .then((res) => res.json())
            .then((data) => {
                toast.success("Employment added!", {
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
            .catch((err) => console.error("Error saving employment:", err));
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

                    <h2 className="text-2xl font-inter font-bold text-purple-700 mt-14">Add employment</h2>

                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Company name</label>
                            <input
                                type="text"
                                {...register("company_name")}
                                className={`border ${errors.company_name ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.company_name ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                            />
                            {errors.company_name && <p className="mt-1 text-sm text-red-500">{errors.company_name.message}</p>}
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Job title</label>
                            <input
                                type="text"
                                {...register("job_title")}
                                className={`border ${errors.job_title ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.job_title ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                            />
                            {errors.job_title && <p className="mt-1 text-sm text-red-500">{errors.job_title.message}</p>}
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
                            <input type="date" className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"} {...register("end_date")} />
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Description</label>
                            <input
                                type="text"
                                placeholder="Describe your role in the company"
                                {...register("description")}
                                className={"border border-purple-700 bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"}
                            />
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

export default AddEmploymentForm;