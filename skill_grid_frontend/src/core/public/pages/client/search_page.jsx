import { StarIcon } from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";
import SearchFilter from "../../../../components/search_page/search_filter";
import SearchResult from "../../../../components/search_page/search_result";

function SearchPage() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

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
            localStorage.removeItem("authData");
        }
    }

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] pt-8">
                    <p className="text-2xl font-inter font-extrabold text-purple-700 pl-20">Search results for 'search-input'</p>
                    <div className="w-full h-0.5 bg-grey-500 mt-9"></div>

                    <div className="flex">
                        <div className="w-[426px] h-screen flex flex-col pl-20 pr-20 pt-10 gap-8">
                            <select className="border border-grey-600 border-2 text-grey-500 h-[50px] bg-purple-50 p-2 rounded-xl focus:outline-none focus:ring-2">
                                <option value="">Location</option>
                                <option value="Kathmandu">Kathmandu</option>
                                <option value="Lalitpur">Lalitpur</option>
                                <option value="Bhaktapur">Bhaktapur</option>
                                <option value="Pokhara">Pokhara</option>
                                <option value="Chitwan">Chitwan</option>
                                <option value="Lumbini">Lumbini</option>
                                <option value="Janakpur">Janakpur</option>
                                <option value="Biratnagar">Biratnagar</option>
                                <option value="Dharan">Dharan</option>
                                <option value="Butwal">Butwal</option>
                            </select>

                            <div className="flex flex-col gap-4">
                                <p className="text-xl font-medium">Hourly rates</p>

                                <div className="flex flex-col gap-2">
                                    <SearchFilter searchFilter={"Below Rs. 1000"} />
                                    <SearchFilter searchFilter={"Rs. 1000 - Rs. 2000"} />
                                    <SearchFilter searchFilter={"Rs. 2000 - Rs. 3000"} />
                                    <SearchFilter searchFilter={"Rs. 3000 - Rs. 4000"} />
                                    <SearchFilter searchFilter={"Rs. 4000 - Rs. 5000"} />
                                    <SearchFilter searchFilter={"Above Rs. 5000"} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <p className="text-xl font-medium">Ratings</p>

                                <div className="flex flex-col gap-2">
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                </div>
                            </div>
                        </div>

                        <div className="w-0.5 h-screen bg-grey-500"></div>

                        <div className="flex flex-col">
                            <SearchResult/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchPage;