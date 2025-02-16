import { useEffect, useState } from "react";

function OnGoingCollaborations() {
    const savedAuthData = JSON.parse(localStorage.getItem("authData")) || {};
    const userId = savedAuthData?.userId ?? "";
    const token = savedAuthData?.token ?? "";

    const [collaborations, setCollaborations] = useState([]);
    const [freelancerRatings, setFreelancerRatings] = useState({});
    const [loading, setLoading] = useState(true); // Loading state

    // Function to render star ratings
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push("⭐");
        }
        return stars;
    };

    // Fetch ongoing collaborations for the client
    useEffect(() => {
        if (userId && token) {
            fetch(`http://localhost:3000/api/appointment/client/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const today = new Date();

                    // Filter ongoing collaborations
                    const ongoingCollaborations = data.filter(collab =>
                        collab.status === true && new Date(collab.project_end_date) > today
                    );

                    setCollaborations(ongoingCollaborations);
                    setLoading(false);

                    // Fetch freelancer reviews and calculate average rating
                    data.forEach(async (collab) => {
                        const freelancerId = collab.freelancer_service_id.freelancer_id._id;
                        const res = await fetch(`http://localhost:3000/api/review/freelancer/${freelancerId}`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        });
                        const reviews = await res.json();
                        const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
                        setFreelancerRatings((prevRatings) => ({
                            ...prevRatings,
                            [freelancerId]: avgRating,
                        }));
                    });
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false); // No user is logged in
        }
    }, [userId, token]);

    const calculateProgress = (collab) => {
        let startTime, endTime, remainingTime;

        if (collab.appointment_time) {
            startTime = new Date(collab.appointment_date);
            const [hours, minutes] = collab.appointment_time.split(":").map(Number);
            startTime.setHours(hours, minutes, 0, 0);

            const { unit, value } = collab.project_duration || {};
            endTime = new Date(startTime);

            if (unit === "hour") endTime.setHours(startTime.getHours() + value);
            else if (unit === "day") endTime.setDate(startTime.getDate() + value);
            else if (unit === "week") endTime.setDate(startTime.getDate() + value * 7);
            else if (unit === "month") endTime.setMonth(startTime.getMonth() + value);

            //calculating remaining times
            const remainingMilliseconds = endTime - new Date();
            remainingTime = Math.max(remainingMilliseconds / (1000 * 60 * 60), 0);
        } else {
            startTime = new Date(collab.appointment_date);
            endTime = new Date(collab.project_end_date);

            //calculating remaining days
            const remainingMilliseconds = endTime - new Date();
            remainingTime = Math.max(remainingMilliseconds / (1000 * 60 * 60 * 24), 0);
        }

        const today = new Date();
        const totalDuration = endTime - startTime;
        const elapsed = today - startTime;
        const progress = totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 0;

        return { remainingTime, progress };
    };

    // Show nothing if user is not logged in
    if (!userId || !token) return null;

    return (
        <div className="flex flex-col gap-8">
            <p className="text-3xl font-inter font-light">Ongoing Collaborations</p>

            {loading ? (
                <p>Loading...</p> // Show loading message while fetching data
            ) : collaborations.length === 0 ? (
                <div className="flex flex-col gap-2 ml-80">
                    <img className="w-[350px] h-[370px]" src="src/assets/client_dashboard_no_collaborations.png" />
                    <div className="w-[350px]">
                        <p className="font-inter font-light text-center">You haven't started any collaborations yet. Start working with top freelancers and bring your ideas to life!</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {collaborations.map((collab) => {
                        const freelancer = collab.freelancer_service_id.freelancer_id;
                        const avgRating = freelancerRatings[freelancer._id] || 0;
                        const { remainingTime, progress } = calculateProgress(collab);
                        const unit = collab.appointment_time ? 'hours' : 'days';

                        return (
                            <div
                                key={collab._id}
                                className="w-[312px] h-[297px] bg-white rounded-xl flex flex-col pt-8 pl-8 pr-8 gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                                        <img
                                            src={`http://localhost:3000/freelancer_images/${freelancer.profile_picture}`}
                                            alt={freelancer.first_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-base font-inter">{`${freelancer.first_name} ${freelancer.last_name}`}</p>
                                        <p className="text-base font-inter">{renderStars(avgRating)}</p>
                                    </div>
                                </div>

                                <p className="text-xl font-medium">{collab.appointment_purpose}</p>
                                <p className="text-[15px]">{Math.round(remainingTime)} {unit} to complete</p>

                                <div className="flex items-center gap-2">
                                    {/* Progress Bar */}
                                    <div className="w-full bg-grey-100 rounded-full h-3 mt-2">
                                        <div
                                            className="bg-blue-500 h-3 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-right mt-1">{Math.round(progress)}%</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default OnGoingCollaborations;
