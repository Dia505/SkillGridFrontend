import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";

function FreelancerProfileClientView() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

    const { _id } = useParams();  // ✅ Corrected `useParams()`
    console.log("Freelancer _ID:", _id);

    const [freelancer, setFreelancer] = useState(null);
    let isTokenValid = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                isTokenValid = true;
            } else {
                localStorage.removeItem("authData");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("authData"); // Remove invalid token
        }
    }

    useEffect(() => {
        if (!_id) return; // ✅ Prevents API call if ID is undefined

        async function fetchFreelancer() {
            try {
                const response = await fetch(`http://localhost:3000/api/freelancer/${_id}`);
                if (!response.ok) throw new Error("Freelancer not found");

                const data = await response.json();
                setFreelancer(data);
                console.log("Fetched Freelancer Data:", data); // ✅ Log fetched data
            } catch (error) {
                console.error("Error fetching freelancer:", error);
            }
        }

        fetchFreelancer();
    }, [_id]); // ✅ Dependency fix

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                {freelancer && (
                    <div className="flex flex-col mt-[90px] pl-40 pr-40 pt-10 pb-20">
                        <div className="flex flex-col border-2 border-grey-500 rounded-xl">
                            <div className="w-full h-[180px] overflow-hidden rounded-t-xl relative">
                                <img
                                    src={`http://localhost:3000/freelancer_images/${freelancer.background_picture}`}
                                    className="w-full h-full object-cover"
                                    alt="Freelancer Background"
                                />
                            </div>

                            <div className="flex bg-purple-50 pl-16 pr-16 pt-5 pb-10 justify-between items-center">
                                <div className='flex gap-6'>
                                    <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
                                        <img
                                            src={`${freelancer.profile_picture}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="text-[22px] font-bold">{`${freelancer.first_name} ${freelancer.last_name}`}</p>
                                        <p className="text-xl">{`${freelancer.profession}`}</p>

                                        <div className="flex gap-2">
                                            <PhoneIcon className="h-5 text-grey-400" />
                                            <p className="text-sm text-grey-500">{`${freelancer.mobile_no}`}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <MapPinIcon className="h-5 text-grey-400" />
                                            <p className="text-sm text-grey-500">{`${freelancer.address}, ${freelancer.city}`}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className='w-[240px] h-[46px] bg-purple-300 rounded-xl text-white font-bold'>Book an Appointment</button>
                            </div>

                            <div className="w-full h-0.5 bg-grey-500 mt-9"></div>

                            <div className="flex">
                                <div className='flex flex-col pt-5'>
                                    <div className='flex gap-6 pb-5 pl-8 pr-14'>
                                        <div className='flex items-center gap-2'>
                                            <img className='h-10' src="/freelancer_profile_bookings.png" />
                                            <div className='flex flex-col items-center'>
                                                <p className='text-xl'>total appointments</p>
                                                <p className='text-grey-500'>bookings</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <img className='h-11' src="/freelancer_profile_experience.png" />
                                            <div className='flex flex-col items-center'>
                                                <p className='text-xl'>{`${freelancer.years_of_experience} years`}</p>
                                                <p className='text-grey-500'>experience</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>

                                    <div className='flex flex-col pt-5 pb-5 pl-8 pr-8 gap-2'>
                                        <p className='text-[22px] font-bold'>Education</p>

                                        <div className='flex flex-col'>
                                            <p className="text-lg">degree_title</p>
                                            <p className="text-sm text-grey-500">institution_name</p>
                                            <p className="text-sm text-grey-500">start_date - end_date</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>

                                    <div className='flex flex-col pt-5 pb-5 pl-8 pr-8 gap-2'>
                                        <p className='text-[22px] font-bold'>Employment</p>

                                        <div className='flex flex-col'>
                                            <p className="text-lg">job_title | company_name</p>
                                            <p className="text-sm text-grey-500">start_date - end_date</p>
                                            <p className="text-sm text-grey-500">description</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-0.5 h-full bg-grey-500"></div>

                                <div className='flex flex-col'>
                                    <div className='pl-8 pr-8 pt-8 pb-8'>
                                        <p>{`${freelancer.bio}`}</p>
                                    </div>

                                    <div className="w-full h-0.5 bg-grey-500"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default FreelancerProfileClientView;
