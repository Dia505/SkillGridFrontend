import React from "react";
import * as yup from "yup";

const jobDetailsSchema = yup.object().shape({
    profession: yup.string().required("*required"),
    skills: yup.string().required("*required"),
    years_of_experience: yup.number().required("*required"),
});

function JobDetails() {
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">JOB DETAILS</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title of your profession: </label>
                    <input className="border p-2 rounded mb-4" {...register("profession")} />

                    <p style={{ color: "red" }}>{errors?.profesion?.message}</p>

                </div>

                <div>
                    <label>Skills: </label>
                    <input className="border p-2 rounded mb-4" {...register("skills")} />

                    <p style={{ color: "red" }}>{errors?.skills?.message}</p>

                </div>

                <label className="mb-2">
                    Years of experience:
                    <select
                        className="border p-2 rounded mb-4"
                        {...register("years_of_experience")}
                    >
                        <option value="">Select a value</option>
                        {Array.from({ length: 40 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                    <p style={{ color: "red" }}>{errors?.years_of_experience?.message}</p>
                </label>

                {/* <div className="flex justify-between">
                    {onPrevious && (
                        <button
                            type="button"
                            onClick={onPrevious}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300"
                        >
                            Previous
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
                    >
                        Next
                    </button>
                </div> */}
            </form>
        </>
    )
}

export default JobDetails