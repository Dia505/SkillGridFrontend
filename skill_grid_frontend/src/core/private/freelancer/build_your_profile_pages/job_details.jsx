import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const jobDetailsSchema = yup.object().shape({
    profession: yup.string().required("*required"),
    skills: yup.string().required("*required"),
    years_of_experience: yup.number().required("*required"),
});

function JobDetails({ data, updateData }) {
    const {
        register,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: data || {}, // Prefill with existing data if available
        resolver: yupResolver(jobDetailsSchema), // Validate with Yup schema
    });

    // Watch all form fields for changes
    const formData = watch(); 

    // Update the parent whenever the form data changes
    useEffect(() => {
        updateData({
            profession: formData.profession,
            skills: formData.skills,
            years_of_experience: formData.years_of_experience,
        });
    }, [formData, updateData]); 

    return (
        <div className="900:ml-24 900:mr-40 500:mr-14 mt-4">
            <h2 className="text-2xl font-caprasimo text-purple-700">Describe your job</h2>
            <p className="text-purple-700 text-lg mt-2">Share the details of your work, skills, and what clients can expect.</p>

            <form>
                <div className="flex flex-col gap-4 900:w-[435px] 500:w-[370px] mt-7">
                    <div>
                        <label className="font-inter text-purple-700 text-[15px] ml-2">Title of your profession</label>
                        <input
                            type="text"
                            {...register("profession")}
                            className={`border ${errors.profession ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.profession ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                        />
                        {errors.profession && <p className="mt-1 text-sm text-red-500">{errors?.profession?.message}</p>}
                    </div>

                    <div>
                        <label className="font-inter text-purple-700 text-[15px] ml-2">Skills</label>
                        <textarea
                            placeholder="Add relevant skills to highlight your expertise"
                            {...register("skills")}
                            className={`border ${errors.skills ? "border-red-500" : "border-purple-700"} 
                                            bg-purple-50 p-2 w-full h-[140px] rounded-xl focus:outline-none focus:ring-2 
                                            ${errors.skills ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                        />
                        {errors.skills && <p className="mt-1 text-sm text-red-500">{errors?.skills?.message}</p>}
                    </div>

                    <div>
                        <label className="font-inter text-purple-700 text-[15px] ml-2">Years of experience</label>
                        <select
                            {...register("years_of_experience")}
                            className={`border ${errors.years_of_experience ? "border-red-500" : "border-purple-700"} 
                        bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                        ${errors.years_of_experience ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                        >
                            <option value=""></option>
                            {Array.from({ length: 51 }, (_, index) => (
                                <option key={index} value={index}>
                                    {index}
                                </option>
                            ))}
                        </select>
                        {errors.years_of_experience && (
                            <p className="mt-1 text-sm text-red-500">{errors?.years_of_experience?.message}</p>
                        )}
                    </div>
                </div>
                <button type="submit" className="hidden" /> {/* To allow submission without actual button */}
            </form>
        </div>
    );
}

export default JobDetails;
