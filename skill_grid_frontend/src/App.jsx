import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthRoute from './components/auth_route';
import { AuthProvider } from './context/auth_context';
import { InfoProvider } from "./context/info_context";

const ClientRegistration = lazy(() => import("./core/public/client/client_registration"));
const FreelancerRegistration = lazy(() => import("./core/public/freelancer/freelancer_registration"));
const Login = lazy(() => import("./core/public/login"));
const JoinClientFreelancer = lazy(() => import("./core/public/join_client_freelancer"));
const ClientDashboard = lazy(() => import("./core/public/client/client_dashboard"));
const FreelancerDashboard = lazy(() => import("./core/private/freelancer/freelancer_dashboard"));
const BuildYourProfile = lazy(() => import("./core/private/freelancer/build_your_profile_pages/build_your_profile"));
const SearchPage = lazy(() => import("./core/public/client/search_page"));
const FreelancerProfileClientView = lazy(() => import("./core/private/client/freelancer_profile_client_view"));
const SendAnOffer = lazy(() => import("./core/private/appointment/send_an_offer"));
const BillingAndPayment = lazy(() => import("./core/private/appointment/billing_and_payment"));
const FreelancerNotification = lazy(() => import("./core/private/freelancer/notification/freelancer_notification"));
const FreelancerOfferView = lazy(() => import("./core/private/freelancer/notification/freelancer_offer_view"));
const ClientContracts = lazy(() => import("./core/private/client/client_contracts"));
const FreelancerProjects = lazy(() => import("./core/private/freelancer/freelancer_projects"));
const ClientProfile = lazy(() => import("./core/private/client/client_profile"));
const FreelancerProfile = lazy(() => import("./core/private/freelancer/freelancer_profile"));
const ClientReview = lazy(() => import("./core/private/client/client_review"));
const EmailForOtpScreen = lazy(() => import("./core/public/forgot_password/email_for_otp_screen"));
const OtpVerificationScreen = lazy(() => import("./core/public/forgot_password/otp_verification_screen"));
const ResetPasswordScreen = lazy(() => import("./core/public/forgot_password/reset_password_screen"));

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
      path: "/email-for-otp",
      element: (
        <Suspense>
          <EmailForOtpScreen />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/otp-verification",
      element: (
        <Suspense>
          <OtpVerificationScreen />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/reset-password",
      element: (
        <Suspense>
          <ResetPasswordScreen />
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
      path: "/build-your-profile",
      element: (
        <Suspense><BuildYourProfile /></Suspense>
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
    {
      path: "/freelancer-projects",
      element: (
        <AuthRoute requiredRole={"freelancer"} element={<Suspense><FreelancerProjects /></Suspense>} />
      )
    },
    {
      path: "/freelancer-projects",
      element: (
        <AuthRoute requiredRole={"freelancer"} element={<Suspense><FreelancerProjects /></Suspense>} />
      )
    },
    {
      path: "/client-profile",
      element: (
        <AuthRoute requiredRole={"client"} element={<Suspense><ClientProfile /></Suspense>} />
      )
    },
    {
      path: "/freelancer-profile",
      element: (
        <AuthRoute requiredRole={"freelancer"} element={<Suspense><FreelancerProfile /></Suspense>} />
      )
    },
    {
      path: "/review",
      element: (
        <AuthRoute requiredRole={"client"} element={<Suspense><ClientReview /></Suspense>} />
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
