import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth_context";

function EditFreelancerServiceForm({ closeForm, freelancerServiceId }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        mode: "all",
    });

    const { authToken } = useAuth();
    const [freelancerService, setFreelancerService] = useState({});
    const [updatedFiles, setUpdatedFiles] = useState([]);
    const [portfolioFiles, setPortfolioFiles] = useState([]);
    const [portfolioId, setPortfolioId] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/freelancer-service/${freelancerServiceId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setFreelancerService(data);
                setValue("service_name", data.service_id.service_name);
                setValue("hourly_rate", data.hourly_rate);

            })
            .catch(err => console.error("Error fetching client:", err));

        fetch(`http://localhost:3000/api/portfolio/freelancer-service/${freelancerServiceId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setPortfolioFiles(data[0].file_path);
                setPortfolioId(data[0]._id);
            })
            .catch(err => console.error("Error fetching portfolio files:", err));
    }, [authToken, freelancerServiceId]);

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (updatedFiles.length + files.length > 4) {
            alert("You can only upload up to 4 pictures.");
            return;
        }

        // Append the actual file objects to updatedFiles
        setUpdatedFiles((prevFiles) => [...prevFiles, ...files]);

        // For preview purposes, create object URLs (blobs) for the file list
        const newPortfolioFiles = files.map((file) => URL.createObjectURL(file));
        setPortfolioFiles((prevUrls) => [...prevUrls, ...newPortfolioFiles]);

        if (errors.skill_portfolio) {
            clearErrors("skill_portfolio");
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    const removeImage = (index) => {
        setUpdatedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

        setPortfolioFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const onSubmit = async (formData) => {
        const { service_name, hourly_rate } = formData;

        try {
            if (service_name !== freelancerService.service_id.service_name) {
                await fetch(`http://localhost:3000/api/service/${freelancerService.service_id._id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ service_name })
                });
            }

            if (hourly_rate !== freelancerService.hourly_rate) {
                await fetch(`http://localhost:3000/api/freelancer-service/${freelancerServiceId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ hourly_rate })
                });
            }

            if (updatedFiles.length > 0) {
                const formData = new FormData();
                updatedFiles.forEach(file => {
                    formData.append("file_path", file);
                });

                await fetch(`http://localhost:3000/api/portfolio/${portfolioId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    },
                    body: formData
                });
            }

            toast.success("Service updated!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            closeForm();
        } catch (error) {
            console.error("Error updating:", error);
        }
    };

    const handleCancel = () => {
        reset(freelancerService);
        setPortfolioFiles(portfolioId.file_path);
        closeForm();
    };

    return (
        <>
            <div className="flex flex-col relative bg-purple-50 rounded-2xl 800:w-[747px] 800:h-[655px] w-[74vw] 800:pb-0 pb-14 pl-16 pt-2">
                <h2 className="text-2xl font-inter font-bold text-purple-700 mt-14">Update the service</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 w-[435px] mt-7 w-[330px]">
                        <div className="flex flex-col">
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Service name</label>
                            <input
                                type="service_name"
                                {...register("service_name")}
                                className="border border-purple-700 bg-purple-50 p-2 745:w-full w-[50vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Hourly rate</label>
                            <input
                                type="hourly_rate"
                                {...register("hourly_rate")}
                                className="border border-purple-700 bg-purple-50 p-2 745:w-full w-[50vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={triggerFileUpload}
                            className={`w-[187px] h-[47px] ${updatedFiles.length >= 4 ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700"} 
                text-purple-50 rounded-xl font-inter mt-6`}
                            disabled={updatedFiles.length >= 4}
                        >
                            🖼️ Upload Pictures
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            style={{ display: "none" }}
                        />

                        {portfolioFiles.length > 0 && (
                            <div className="w-[500px] flex 644:gap-4 gap-2 mt-4">
                                {portfolioFiles.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={file}
                                            alt={`Uploaded Preview ${index + 1}`}
                                            className="745:w-[126px] w-[18vw] h-[18vw] 745:h-[126px] object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 745:right-1 left-3 bg-purple-50 text-[13px] border rounded-full w-5 h-5 flex justify-center"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex 745:flex-row flex-col gap-4 mt-5">
                            <button className="border-2 border-purple-400 rounded-3xl px-20 py-2 font-semibold text-purple-400 745:w-full w-[50vw]"
                                type="button"
                                onClick={handleCancel}>Cancel</button>
                            <button
                                type="submit"
                                className="border-2 border-purple-400 bg-purple-400 rounded-3xl px-20 py-2 font-semibold text-white 745:w-full w-[50vw]">Update</button>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}

export default EditFreelancerServiceForm;