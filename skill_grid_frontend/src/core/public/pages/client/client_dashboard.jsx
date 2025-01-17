import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token"
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token"

function ClientDashboard() {
    return (
        <>
            {localStorage.getItem("token")? <ClientDashboardNavbarWithToken/>:<ClientDashboardNavbarWithoutToken/>}
        </>
    )
}

export default ClientDashboard