import { useEffect, useState } from "react";
import FreelancerSideBar from "../../../components/navigation_bar/freelancer_side_bar";

function FreelancerDashboard() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;
    const userId = authData?.userId;

    const [freelancer, setFreelancer] = useState(null);
    const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
    const [totalEarning, setTotalEarning] = useState(0);
    const [avgRatings, setAvgRatings] = useState(0);

    useEffect(() => {
        async function fetchFreelancer() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Freelancer not found");

                const data = await response.json();
                setFreelancer(data);
                console.log("Fetched Freelancer Data:", data);
            } catch (error) {
                console.error("Error fetching freelancer:", error);
            }
        }

        async function fetchCompletedProjects() {
            try {
                const response = await fetch(`http://localhost:3000/api/appointment/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Projects not found");

                const projects = await response.json();

                // Function to count completed projects based on project_end_date
                const countCompleteProjects = (projects) => {
                    const currentDate = new Date();

                    return projects.filter(project => {
                        // Compare the project_end_date with the current date
                        const projectEndDate = new Date(project.project_end_date);
                        return projectEndDate <= currentDate && project.status === true; // Status should also be true
                    }).length;
                };

                const completedProjectCount = countCompleteProjects(projects);

                setCompletedProjectsCount(completedProjectCount);
            } catch (error) {
                console.error("Error fetching completed projects:", error);
            }
        }

        async function fetchTotalEarnings() {
            try {
                const response = await fetch(`http://localhost:3000/api/payment/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                // Check if the response status is OK (200)
                if (!response.ok) {
                    throw new Error("Failed to fetch total earnings");
                }

                const result = await response.json();

                // Check if 'totalPayment' exists in the response
                if (result.totalPayment !== undefined) {
                    setTotalEarning(result.totalPayment);  // Assuming `setTotalEarning` sets the total earnings
                } else {
                    console.error("Total payment not found in the response");
                }

            } catch (error) {
                console.error("Error fetching total earnings:", error);
            }
        }

        async function fetchFreelancerRatings() {
            try {
                const response = await fetch(`http://localhost:3000/api/review/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to fetch reviews");

                const reviews = await response.json();
                console.log("Fetched reviews:", reviews);

                if (!Array.isArray(reviews) || reviews.length === 0) {
                    setAvgRatings(0); // Default rating if no reviews
                    return;
                }

                const avgRating = reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length;
                setAvgRatings(avgRating); // Store directly as a number
            } catch (error) {
                console.error("Error fetching freelancer ratings:", error);
            }
        }


        fetchFreelancer();
        fetchCompletedProjects();
        fetchTotalEarnings();
        fetchFreelancerRatings();
    }, [userId, token]);

    return (
        <div className="flex bg-purple-50">
            <FreelancerSideBar />

            <div className="h-screen flex bg-purple-50 py-10 pl-14">
                <div className="flex flex-col gap-6">
                    <p className="text-xl font-inter">Dashboard</p>

                    {freelancer && (
                        <div className="flex flex-col gap-3">
                            <p className="text-lg font-inter">
                                Welcome back, {freelancer.first_name} 👋
                            </p>

                            <div className="flex gap-3">
                                <div className="flex flex-col bg-purple-100 items-center gap-3 py-8 px-8 rounded-xl shadow-md">
                                    <p className="text-3xl">🚀</p>
                                    <p className="text-3xl font-semibold font-inter">{completedProjectsCount}</p>
                                    <p className="text-grey-500 text-sm">Total projects delivered</p>
                                </div>

                                <div className="flex flex-col bg-purple-100 items-center gap-3 py-8 px-8 rounded-xl shadow-md">
                                    <p className="text-3xl">💰</p>
                                    <p className="text-2xl font-semibold font-inter">Rs. {totalEarning}</p>
                                    <p className="text-grey-500 text-sm">Total earnings</p>
                                </div>

                                <div className="flex flex-col bg-purple-100 items-center gap-3 py-10 px-14 rounded-xl shadow-md">
                                    <p className="text-3xl">⭐</p>
                                    <p className="text-3xl font-semibold font-inter">{avgRatings}</p>
                                    <p className="text-grey-500 text-sm">Average rating</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FreelancerDashboard;
