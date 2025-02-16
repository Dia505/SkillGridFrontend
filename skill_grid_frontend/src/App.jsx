import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthRoute from './components/auth_route';
import { AuthProvider } from './context/auth_context';
import { InfoProvider } from "./context/info_context";

const ClientRegistration = lazy(() => import("./core/public/pages/client/client_registration"));
const AdminDashboard = lazy(() => import("./core/private/admin/admin_dashboard"));
const FreelancerRegistration = lazy(() => import("./core/public/pages/freelancer/freelancer_registration"));
const Login = lazy(() => import("./core/public/pages/login"));
const JoinClientFreelancer = lazy(() => import("./core/public/pages/join_client_freelancer"));
const ClientDashboard = lazy(() => import("./core/public/pages/client/client_dashboard"));
const FreelancerDashboard = lazy(() => import("./core/private/freelancer/freelancer_dashboard"));
const BuildYourProfile = lazy(() => import("./core/private/freelancer/build_your_profile_pages/build_your_profile"));
const SearchPage = lazy(() => import("./core/public/pages/client/search_page"));
const FreelancerProfileClientView = lazy(() => import("./core/private/client/freelancer_profile_client_view"));
const SendAnOffer = lazy(() => import("./core/private/appointment/send_an_offer"));
const BillingAndPayment = lazy(() => import("./core/private/appointment/billing_and_payment"));
const FreelancerNotification = lazy(() => import("./core/private/freelancer/notification/freelancer_notification"));
const FreelancerOfferView = lazy(() => import("./core/private/freelancer/notification/freelancer_offer_view"));
const ClientContracts = lazy(() => import("./core/private/client/client_contracts"));

const queryClient = new QueryClient();

function App() {
  // Dynamically check if token exists in localStorage
  const token = localStorage.getItem("authToken");

  const routes = [
    //-----------------------Public Routes-------------------------
    {
      path: "/client-registration",
      element: (
        <Suspense>
          <ClientRegistration />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/freelancer-registration",
      element: (
        <Suspense>
          <FreelancerRegistration />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/login",
      element: (
        <Suspense>
          <Login />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/join-client-freelancer",
      element: (
        <Suspense>
          <JoinClientFreelancer />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/search-freelancer/:searchQuery",
      element: (
        <Suspense>
          <SearchPage />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/",
      element: (
        <Suspense>
          <ClientDashboard />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    //-----------------------Private Routes (with AuthRoute)------------------------
    {
      path: "/freelancer-dashboard",
      element: (
        <AuthRoute requiredRole="freelancer" element={<Suspense><FreelancerDashboard /></Suspense>} />
      )
    },
    {
      path: "/admin-dashboard",
      element: (
        <AuthRoute requiredRole="admin" element={<Suspense><AdminDashboard /></Suspense>} />
      )
    },
    {
      path: "/build-your-profile",
      element: (
        <AuthRoute requiredRole="freelancer" element={<Suspense><BuildYourProfile /></Suspense>} />
      )
    },
    {
      path: "/freelancer-profile/:_id",
      element: (
        <AuthRoute requiredRole="client"
          element={<Suspense>
            <FreelancerProfileClientView />
          </Suspense>} />
      )
    },
    {
      path: "/send-an-offer",
      element: (
        <AuthRoute requiredRole={"client"} element={<Suspense><SendAnOffer /></Suspense>} />
      )
    },
    {
      path: "/billing-and-payment",
      element: (
        <AuthRoute requiredRole={"client"} element={<Suspense><BillingAndPayment /></Suspense>} />
      )
    },
    {
      path: "/freelancer-notification",
      element: (
        <AuthRoute requiredRole={"freelancer"} element={<Suspense><FreelancerNotification /></Suspense>} />
      )
    },
    {
      path: "/freelancer-offer-view/:appointment_id",
      element: (
        <AuthRoute requiredRole={"freelancer"} element={<Suspense><FreelancerOfferView /></Suspense>} />
      )
    },
    {
      path: "/client-contracts",
      element: (
        <AuthRoute requiredRole={"client"} element={<Suspense><ClientContracts /></Suspense>} />
      )
    },
    // Fallback route for unauthorized access
    {
      path: "*",
      element: <Suspense>Unauthorized</Suspense>,
      errorElement: <>error</>
    }
  ];

  const router = createBrowserRouter(routes);

  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <InfoProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </InfoProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
