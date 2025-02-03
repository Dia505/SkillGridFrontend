import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { InfoProvider } from "./context/info_context";
import AuthRoute from './components/auth_route';
import { AuthProvider } from './context/auth_context';

const ClientRegistration = lazy(() => import("./core/public/pages/client/client_registration"));
const AdminDashboard = lazy(() => import("./core/private/admin/admin_dashboard"));
const FreelancerRegistration = lazy(() => import("./core/public/pages/freelancer/freelancer_registration"));
const Login = lazy(() => import("./core/public/pages/login"));
const JoinClientFreelancer = lazy(() => import("./core/public/pages/join_client_freelancer"));
const ClientDashboard = lazy(() => import("./core/public/pages/client/client_dashboard"));
const FreelancerDashboard = lazy(() => import("./core/private/freelancer/freelancer_dashboard"));
const BuildYourProfile = lazy(() => import("./core/private/freelancer/build_your_profile_pages/build_your_profile"));
const SearchPage = lazy(() => import("./core/public/pages/client/search_page"));
const FreelancerProfileClientView = lazy(() => import("./core/public/pages/freelancer/freelancer_profile_client_view"));

const queryClient = new QueryClient();

function App() {
  // Dynamically check if token exists in localStorage
  const token = localStorage.getItem("authToken");

  const routes = [
    // Public Routes
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
      path: "/",
      element: (
        <Suspense>
          <ClientDashboard />
        </Suspense>
      ),
      errorElement: <>error</>
    },
    {
      path: "/freelancer-dashboard",
      element: (
        <AuthRoute requiredRole="freelancer" element={<Suspense><FreelancerDashboard /></Suspense>} />
      )
    },
    // Private Routes (with AuthRoute)
    {
      path: "/admin-dashboard",
      element: (
        <AuthRoute requiredRole="admin" element={<Suspense><AdminDashboard /></Suspense>} />
      )
    },
    {
      path: "/build-your-profile",
      element: (
        // <AuthRoute requiredRole="freelancer" element={<Suspense><BuildYourProfile /></Suspense>} />
        <Suspense><BuildYourProfile/></Suspense>
      )
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
      path: "/freelancer-profile/:_id",
      element: (
        <Suspense>
          <FreelancerProfileClientView />
        </Suspense>
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
