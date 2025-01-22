import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppLogo2 from "../app_logo/app_logo2";

function ClientDashboardNavbarWithoutToken() {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-purple-50 flex w-full h-[90px] items-center justify-between pl-10 pr-10 fixed top-0 z-50">
                <AppLogo2 onClick={() => navigate("/client-dashboard")} />

                <div className="flex gap-5">
                    <div className="relative">
                        <input
                            type="text"
                            className={`border border-grey-500 bg-purple-50 p-2 w-[260px] rounded-xl`} />
                        <button className="absolute w-[29px] h-[29px] right-2 top-1.5" onClick={() => navigate("/search-freelancer")}>
                            <MagnifyingGlassIcon />
                        </button>
                    </div>

                    <button className="bg-purple-50 w-[90px] text-purple-700 font-caprasimo" onClick={() => navigate("/login")}>Log In</button>

                    <button className="bg-purple-700 w-[150px] rounded-xl text-purple-50 font-caprasimo" onClick={() => navigate("/join-client-freelancer")}>Sign Up</button>
                </div>
            </div>
        </>
    )
}

export default ClientDashboardNavbarWithoutToken;