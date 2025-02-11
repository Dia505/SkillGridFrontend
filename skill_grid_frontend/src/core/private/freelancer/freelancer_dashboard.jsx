import FreelancerSideBar from "../../../components/navigation_bar/freelancer_side_bar"

function FreelancerDashboard() {
    return(
        <>
        <div className="flex">
            <FreelancerSideBar/>

            <div className="h-screen overflow-auto flex flex-col bg-purple-50">

            </div>
        </div>
        </>
    )
}

export default FreelancerDashboard