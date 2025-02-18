import Lottie from "lottie-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LottieScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/build-your-profile");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-purple-700">
                <Lottie animationData={animationData} loop={false} />
            </div>
        </>
    )
}

export default LottieScreen;