import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const bioDetailsSchema = yup.object().shape({
    bio: yup.string().required("*required")
});

function BioDetails({ data, updateData }) {
    const {
        register,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: data || {},
        resolver: yupResolver(bioDetailsSchema),
    });

    // Watch all form fields for changes
    const formData = watch();

    // Update the parent whenever the form data changes
    useEffect(() => {
        updateData({
            bio: formData.bio,
        });
    }, [formData, updateData]);

    return (
        <>
            <div className="ml-24 mr-40 mt-4">
                <h2 className="text-2xl font-caprasimo text-purple-700">Great! Now write a bio about yourself</h2>
                <p className="text-purple-700 text-lg mt-2">Help potential clients get to know you at a glance. Share your expertise, experience, and what sets you apart.</p>

                <form>
                    <div className="w-[435px] mt-7">
                        <label className="font-inter text-purple-700 text-[15px] ml-2">Bio</label>
                        <textarea
                            type="bio"
                            {...register("bio")}
                            className={`border ${errors.bio ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.bio ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                        />
                        {errors.bio && <p className="mt-1 text-sm text-red-500">{errors?.bio?.message}</p>}
                    </div>
                    <button type="submit" className="hidden" /> {/* To allow submission without actual button */}
                </form>

            </div>
        </>
    );
}

export default BioDetails;
