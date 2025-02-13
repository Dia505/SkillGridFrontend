import { StarIcon } from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import noResultImage from "../../../../assets/no_result_found.png";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";
import SearchFilter from "../../../../components/search_page/search_filter";
import SearchResult from "../../../../components/search_page/search_result";
import Footer from "../../../../components/footer";
import { useAuth } from "../../../../context/auth_context";

function SearchPage() {
    const { authToken, role, userId } = useAuth();

    const { searchQuery } = useParams(); // Get searchQuery from URL

    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [error, setError] = useState(null);
    const [rateFilter, setRateFilter] = useState({
        "Below Rs. 1000": false,
        "Rs. 1000 - Rs. 2000": false,
        "Rs. 2000 - Rs. 3000": false,
        "Rs. 3000 - Rs. 4000": false,
        "Rs. 4000 - Rs. 5000": false,
        "Above Rs. 5000": false,
    });
    const [ratingFilter, setRatingFilter] = useState({
        5: false,
        4: false,
        3: false,
        2: false,
        1: false,
    });

    useEffect(() => {
        if (authToken) {
            console.log("User is logged in");
        } else {
            console.log("User is not logged in");
        }
    }, [authToken]);

    // Function to fetch search results from the backend
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) return;

            try {
                const response = await fetch(
                    `http://localhost:3000/api/freelancer/search/${encodeURIComponent(searchQuery)}`
                );
                if (!response.ok) throw new Error("Failed to fetch search results");

                const data = await response.json();
                setResults(data);
                setFilteredResults(data); // Initialize filtered results with all data
            } catch (error) {
                setError(error.message);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    useEffect(() => {
        console.log(results); // Logs updated results
    }, [results]); 

    // Function to filter by location
    const filterByLocation = (location) => {
        if (location) {
            const filtered = results.filter((freelancer) =>
                freelancer.city && freelancer.city.includes(location)
            );
            setFilteredResults(filtered);
        } else {
            setFilteredResults(results);
        }
    };

    //Filter by hourly rate
    useEffect(() => {
        const selectedRates = Object.keys(rateFilter).filter((rate) => rateFilter[rate]);

        if (selectedRates.length > 0) {
            const filtered = results.filter((freelancer) => {
                const { lowestHourlyRate } = freelancer;

                // Check if the freelancer's hourly rate is within any of the selected ranges
                return selectedRates.some((rate) => {
                    if (rate === "Below Rs. 1000") return lowestHourlyRate < 1000;
                    if (rate === "Rs. 1000 - Rs. 2000")
                        return lowestHourlyRate >= 1000 && lowestHourlyRate <= 2000;
                    if (rate === "Rs. 2000 - Rs. 3000")
                        return lowestHourlyRate >= 2000 && lowestHourlyRate <= 3000;
                    if (rate === "Rs. 3000 - Rs. 4000")
                        return lowestHourlyRate >= 3000 && lowestHourlyRate <= 4000;
                    if (rate === "Rs. 4000 - Rs. 5000")
                        return lowestHourlyRate >= 4000 && lowestHourlyRate <= 5000;
                    if (rate === "Above Rs. 5000") return lowestHourlyRate > 5000;
                    return false;
                });
            });
            setFilteredResults(filtered);
        } else {
            setFilteredResults(results); // Show all results if no rates are selected
        }
    }, [rateFilter, results]);

    //Filter by star ratings
    useEffect(() => {
        const selectedRatings = Object.keys(ratingFilter).filter((rating) => ratingFilter[rating]);

        if (selectedRatings.length > 0) {
            const filteredByRating = results.filter((freelancer) => {
                const { avgRating } = freelancer;

                // Check if the freelancer's average rating is equal to or greater than any of the selected ratings
                return selectedRatings.some((rating) => avgRating == rating);
            });
            setFilteredResults(filteredByRating);
        } else {
            setFilteredResults(results); // Show all results if no ratings are selected
        }
    }, [ratingFilter, results]);

    // Function to filter by hourly rate
    const filterByHourlyRate = (rate) => {
        setRateFilter((prev) => ({
            ...prev,
            [rate]: !prev[rate], // Toggle the selection of the rate
        }));
    };

    // Function to filter by star ratings
    const filterByStarRating = (rating) => {
        setRatingFilter((prev) => ({
            ...prev,
            [rating]: !prev[rating], // Toggle the selection of the rating
        }));
    };

    return (
        <div className="h-screen overflow-auto flex flex-col bg-purple-50">
            {authToken && role == "client" ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

            <div className="flex flex-col mt-[90px] pt-8">
                <p className="text-2xl font-inter font-extrabold text-purple-700 pl-20">
                    Search results for '{searchQuery}'
                </p>
                <div className="w-full h-0.5 bg-grey-500 mt-9"></div>

                <div className="flex">
                    <div className="w-[426px] h-screen flex flex-col pl-20 pr-20 pt-10 gap-8">
                        {/* Location filter */}
                        <select
                            className="border border-grey-600 border-2 text-grey-500 h-[50px] bg-purple-50 p-2 rounded-xl focus:outline-none focus:ring-2"
                            onChange={(e) => filterByLocation(e.target.value)}
                        >
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

                        {/* Hourly rate filters */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xl font-medium">Hourly rates</p>
                            <div className="flex flex-col gap-2">
                                {Object.keys(rateFilter).map((rate) => (
                                    <SearchFilter
                                        key={rate}
                                        searchFilter={rate}
                                        onChange={() => filterByHourlyRate(rate)}
                                        checked={rateFilter[rate]}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ratings filters */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xl font-medium">Ratings</p>
                            <div className="flex flex-col gap-2">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <SearchFilter
                                        key={star}
                                        searchFilter={
                                            <>
                                                {[...Array(star)].map((_, index) => (
                                                    <StarIcon key={index} className="w-6 h-6 text-black" />
                                                ))}
                                            </>
                                        }
                                        onChange={() => filterByStarRating(star)}
                                        checked={ratingFilter[star]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-0.5 h-full bg-grey-500"></div>

                    <div className="flex flex-col pb-20">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((freelancer, index) => (
                                <SearchResult key={index} freelancer={freelancer} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center pt-10 pl-80">
                                <img className="w-[300px]" src={noResultImage} />
                                <div className="w-[450px]">
                                    <p className="text-2xl font-inter font-extrabold text-purple-700 text-center">
                                        Looks like there are no results for that. Keep searching!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default SearchPage;
