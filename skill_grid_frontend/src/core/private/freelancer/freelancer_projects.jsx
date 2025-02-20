import { useState, useEffect } from "react";
import FreelancerSideBar from "../../../components/navigation_bar/freelancer_side_bar";
import { useAuth } from "../../../context/auth_context";
import ActiveProjectsTable from "../../../components/react_table/active_projects_table";

function FreelancerProjects() {
    const { authToken, userId } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [projects, setProjects] = useState([]);
    const [ongoingProjects, setOngoingProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState({});

    useEffect(() => {
        async function fetchContracts() {
            try {
                const response = await fetch(`http://localhost:3000/api/appointment/freelancer/${userId}`, {
                    headers: { "Authorization": `Bearer ${authToken}` }
                });
                if (!response.ok) throw new Error("Freelancer appointments not found");

                const data = await response.json();
                const projects = data.filter(project => project.status === true);
                setProjects(projects);

                const today = new Date();

                const ongoingProjects = projects.filter(project => {
                    if (!project.appointment_time) {
                        return new Date(project.project_end_date) > today;
                    }

                    const { unit, value } = project.project_duration || {};
                    if (!unit || value == null) return false;

                    let endDateTime = new Date(project.appointment_date);

                    const [hours, minutes] = project.appointment_time.split(":").map(Number);
                    endDateTime.setHours(hours, minutes, 0, 0);

                    if (unit === "hour") {
                        endDateTime.setHours(endDateTime.getHours() + value);
                    } else if (unit === "day") {
                        endDateTime.setDate(endDateTime.getDate() + value);
                    } else if (unit === "week") {
                        endDateTime.setDate(endDateTime.getDate() + value * 7);
                    } else if (unit === "month") {
                        endDateTime.setMonth(endDateTime.getMonth() + value);
                    }

                    return endDateTime > today;
                });
                setOngoingProjects(ongoingProjects);

                const completedProjects = data.filter(project => {
                    if (!project.appointment_time) {
                        return new Date(project.project_end_date) < today;
                    }

                    const { unit, value } = project.project_duration || {};
                    if (!unit || value == null) return false;

                    let endDateTime = new Date(project.appointment_date);

                    const [hours, minutes] = project.appointment_time.split(":").map(Number);
                    endDateTime.setHours(hours, minutes, 0, 0);

                    if (unit === "hour") {
                        endDateTime.setHours(endDateTime.getHours() + value);
                    } else if (unit === "day") {
                        endDateTime.setDate(endDateTime.getDate() + value);
                    } else if (unit === "week") {
                        endDateTime.setDate(endDateTime.getDate() + value * 7);
                    } else if (unit === "month") {
                        endDateTime.setMonth(endDateTime.getMonth() + value);
                    }

                    return endDateTime < today;
                });
                setCompletedProjects(completedProjects);

                const paymentFetches = projects.map(async (project) => {
                    const paymentResponse = await fetch(`http://localhost:3000/api/payment/appointment/${project._id}`, {
                        headers: { "Authorization": `Bearer ${authToken}` }
                    });

                    if (paymentResponse.ok) {
                        const paymentData = await paymentResponse.json();
                        return { projectId: project._id, paymentData };
                    }
                    return null;
                });

                // Wait for all payment fetches to complete
                const paymentResults = await Promise.all(paymentFetches);

                // Update the payment details state only after all fetches are done
                const paymentDetails = {};
                paymentResults.forEach(result => {
                    if (result) {
                        paymentDetails[result.projectId] = result.paymentData;
                    }
                });
                setPaymentDetails(paymentDetails);

            }
            catch (error) {
                console.error("Error fetching appointments:", error);
            }
        }
        fetchContracts();
    }, [userId, authToken]);

    const getFilteredProjects = () => {
        if (selectedFilter === "Ongoing") return ongoingProjects;
        if (selectedFilter === "Completed") return completedProjects;
        return projects; 
    };

    return (
        <>
            <div className="flex bg-purple-50">
                <FreelancerSideBar />

                <div className="h-screen bg-purple-50 py-10 pl-80">
                    <div className="flex flex-col gap-6">
                        <p className="text-2xl font-inter font-bold">Projects</p>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-8">
                                {["All", "Ongoing", "Completed"].map(filter => (
                                    <p
                                        key={filter}
                                        className={`cursor-pointer hover:text-purple-400 hover:font-medium ${selectedFilter === filter ? "text-purple-400 underline font-bold" : "text-grey-500"
                                            }`}
                                        onClick={() => setSelectedFilter(filter)}
                                    >
                                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </p>
                                ))}
                            </div>
                            <div className="bg-grey-500 w-full h-0.5"></div>
                        </div>

                        <ActiveProjectsTable activeProjects={getFilteredProjects()} paymentDetails={paymentDetails} />

                    </div>
                </div>
            </div>
        </>
    )
}

export default FreelancerProjects;