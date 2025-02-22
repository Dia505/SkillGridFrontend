import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import StarRating from "../../../components/client_review/start_rating";
import ClientDashboardNavbarWithToken from "../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../components/navigation_bar/client_dashboard_navbar_without_token";
import { useAuth } from "../../../context/auth_context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const reviewSchema = yup.object().shape({
    review: yup.string().required("*required")
});

function ClientReview() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(reviewSchema),
        mode: "all"
    });

    const { authToken, role, userId } = useAuth();
    const location = useLocation();
    const { contractId, freelancerId } = location.state || {};
    const [contract, setContract] = useState({});
    const [freelancer, setFreelancer] = useState({});
    const [rating, setRating] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchContract() {
            try {
                const response = await fetch(`http://localhost:3000/api/appointment/${contractId}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });

                if (!response.ok) throw new Error("Contract not found");

                const data = await response.json();
                setContract(data);
                console.log("Fetched contract data:", data);
            } catch (error) {
                console.error("Error fetching contract:", error);
            }
        }

        fetchContract();

        async function fetchFreelancer() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer/${freelancerId}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });

                if (!response.ok) throw new Error("Freelancer not found");

                const data = await response.json();
                setFreelancer(data);
                console.log("Fetched Freelancer Data:", data);
            } catch (error) {
                console.error("Error fetching freelancer:", error);
            }
        }

        fetchFreelancer();
    }, [authToken, contractId, freelancerId]);

    const onSubmit = async (data) => {
        const reviewData = {
            review: data.review,
            rating: rating,
            client_id: userId,
            freelancer_id: freelancer._id,
            appointment_id: contract._id
        };

        try {
            const response = await fetch("http://localhost:3000/api/review", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) throw new Error("Failed to submit review");

            toast.success("Review sent successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            navigate("/client-contracts");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {authToken && role == "client" ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] px-32 pt-10 pb-20 gap-10 justify-center items-center">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col items-center justify-center bg-purple-400 py-8 rounded-3xl gap-8 w-[800px]">
                            <p className="font-extrabold text-2xl text-purple-50">Write a review</p>

                            <div className="flex flex-col gap-4 items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                                        <img src={`${freelancer.profile_picture}`} className="w-full h-full object-cover" alt="Freelancer" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-white text-xl font-bold">{freelancer.first_name} {freelancer.last_name}</p>
                                        <p className="text-white text-lg">{freelancer.profession}</p>
                                    </div>
                                </div>

                                <span className="text-white text-xl font-bold">Project:
                                    <span className="font-light"> {contract.appointment_purpose}</span>
                                </span>

                                <div className="flex gap-2 items-center">
                                    <p className="text-xl text-white">Rating:</p>
                                    <StarRating onRate={(value) => setRating(value)} />
                                </div>

                                <div className="flex flex-col w-[435px]">
                                    <textarea
                                        type="review"
                                        placeholder="Share your thoughts....."
                                        {...register("review")}
                                        className={`border ${errors.review ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full h-40 rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.review ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                                    />
                                    {errors.review && <p className="mt-1 text-sm text-red-500">{errors?.review?.message}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-purple-50 font-caprasimo text-purple-700 rounded-xl py-3 px-20">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ClientReview;