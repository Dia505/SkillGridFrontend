import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";

function ClientDashboard() {
    // Retrieve authData and parse it safely
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

    return (
        <>
            {token ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}
        </>
    );
}

export default ClientDashboard;
