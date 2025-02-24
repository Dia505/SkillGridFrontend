import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from "../../components/app_logo/app_logo";
import JoinClientFreelancerContainer from "../../components/join_client_freelancer_container";

function JoinClientFreelancer() {
    const [activeContainer, setActiveContainer] = useState(null); // Track which container is active
    const navigate = useNavigate();

    // Handle the click on any container
    const handleContainerClick = (index) => {
        setActiveContainer(index); // Set the active container by its index
    };

    const handleButtonClick = () => {
        if (activeContainer === 0) {
            // Navigate to client registration if "Apply as a Client" is selected
            navigate("/client-registration");
        } else if (activeContainer === 1) {
            // Navigate to freelancer registration if "Apply as a Freelancer" is selected
            navigate("/freelancer-registration");
        }
    };

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col pt-10 pl-16 bg-purple-700">
                <AppLogo />

                <div className="flex flex-col items-center justify-center pt-6 gap-12 700:mr-0 500:mr-14">
                    <p className="font-caprasimo text-purple-50 text-3xl text-center">Join as a client or freelancer</p>

                    <div className="flex flex-col gap-4">
                        <div>
                            <JoinClientFreelancerContainer
                                containerImg="src/assets/join_as_client.png"
                                containerText="I'm a client, hiring for a project"
                                isActive={activeContainer === 0} // Check if this is the active container
                                onClick={() => handleContainerClick(0)} // Set as active on click
                            />
                        </div>

                        <div>
                            <JoinClientFreelancerContainer
                                containerImg="src/assets/join_as_freelancer.png"
                                containerText="I'm a freelancer, looking for work"
                                isActive={activeContainer === 1} // Check if this is the active container
                                onClick={() => handleContainerClick(1)} // Set as active on click
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <button
                            className={`w-[295px] h-[43px] text-purple-700 font-caprasimo text-lg bg-purple-50 rounded-xl ${activeContainer === null ? 'cursor-not-allowed bg-grey-300 text-grey-200' : ''
                                }`}
                            disabled={activeContainer === null} // Disable if no container is selected
                            onClick={handleButtonClick}
                        >
                            {activeContainer === 0
                                ? "Apply as a Client"
                                : activeContainer === 1
                                    ? "Apply as a Freelancer"
                                    : "Create Account"}
                        </button>

                        <div className="flex gap-2">
                            <p className="font-inter font-light text-purple-50">Already have an account?</p>
                            <p className="font-caprasimo text-purple-50 hover:underline cursor-pointer" onClick={() => navigate("/login")}>Log In</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JoinClientFreelancer;