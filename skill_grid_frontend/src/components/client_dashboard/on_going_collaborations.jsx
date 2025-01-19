import { useEffect, useState } from "react";

function OnGoingCollaborations() {
    const savedAuthData = JSON.parse(localStorage.getItem("authData")) || {};
    const userId = savedAuthData?.userId ?? "";
    const token = savedAuthData?.token ?? "";
    const [collaborations, setCollaborations] = useState([]);
    const [freelancerRatings, setFreelancerRatings] = useState({});

    // Function to calculate remaining time and completion percentage
    const calculateRemainingTimeAndCompletion = (appointmentDate, duration) => {
        const appointment = new Date(appointmentDate);
        const durationInMs = duration.value * 30 * 24 * 60 * 60 * 1000; // assuming 30 days per month
        const remainingTime = appointment.getTime() + durationInMs - new Date().getTime();
        const daysRemaining = Math.ceil(remainingTime / (1000 * 3600 * 24));

        // Calculate completion percentage
        const completedTime = durationInMs - remainingTime;
        const completionPercentage = Math.max(0, (completedTime / durationInMs) * 100);

        return { daysRemaining: daysRemaining > 0 ? `${daysRemaining} days` : "Completed", completionPercentage };
    };

    // Fetch ongoing collaborations for the client
    useEffect(() => {
        if (userId && token) {
            fetch(`http://localhost:3000/api/appointment/client/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    setCollaborations(data);

                    // Fetch freelancer reviews and calculate average rating
                    data.forEach(async (collab) => {
                        const freelancerId = collab.freelancer_service_id.freelancer_id._id;
                        const res = await fetch(`http://localhost:3000/api/review/freelancer/${freelancerId}`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        });
                        const reviews = await res.json();
                        const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
                        setFreelancerRatings((prevRatings) => ({
                            ...prevRatings,
                            [freelancerId]: avgRating
                        }));
                    });
                });
        }
    }, [userId, token]);

    return (
        <div className="flex flex-col gap-8">
            <p className="text-3xl font-inter font-light">Ongoing Collaborations</p>
            <div className="flex flex-wrap gap-4">
                {collaborations.map((collab) => {
                    const freelancer = collab.freelancer_service_id.freelancer_id;
                    const avgRating = freelancerRatings[freelancer._id] || 0;
                    const { daysRemaining, completionPercentage } = calculateRemainingTimeAndCompletion(collab.appointment_date, collab.project_duration);

                    return (
                        <div key={collab._id} className="w-[312px] h-[297px] bg-white rounded-xl flex flex-col pt-10 pl-8 pr-8 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-purple-700">
                                    <img
                                        src={freelancer.profile_picture}
                                        alt={freelancer.first_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-base font-inter">{`${freelancer.first_name} ${freelancer.last_name}`}</p>
                                    <p className="text-base font-inter">Rating: {avgRating.toFixed(1)}</p>
                                </div>
                            </div>

                            <p className="text-xl font-medium">{collab.appointment_purpose}</p>
                            <p className="text-[15px]">Time to complete: {daysRemaining}</p>

                            <div className="flex items-center gap-2">
                                {/* Progress Bar */}
                                <div className="w-full bg-grey-100 rounded-full h-3 mt-2">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full"
                                        style={{ width: `${completionPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-right mt-1">{completionPercentage.toFixed(1)}%</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OnGoingCollaborations;
