import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const bioDetailsSchema = yup.object().shape({
    bio: yup.string().required("*required")
});

function BioDetails({ data, updateData }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: data || {}, 
        resolver: yupResolver(bioDetailsSchema), 
    });

    const onSubmit = (formData) => {
        updateData({ bio_details: formData }); 
    };

    return (
        <>
            <div className="ml-24 mr-40 mt-4">
                <h2 className="text-2xl font-caprasimo text-purple-700">Great! Now write a bio about yourself</h2>
                <p className="text-purple-700 text-lg mt-2">Help potential clients get to know you at a glance. Share your expertise, experience, and what sets you apart.</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-[435px] mt-7">
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Bio</label>
                            <textarea
                                type="profession"
                                {...register("profession")}
                                className={`border ${errors.profession ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.profession ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                            />
                            {errors.profession && <p className="mt-1 text-sm text-red-500">{errors?.profession?.message}</p>}
                        </div>
                        <button type="submit" className="hidden" /> {/* To allow submission without actual button */}
                </form>

            </div>
        </>
    );
}

export default BioDetails;
