import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { InfoProvider } from "./context/info_context";
import AuthRoute from './components/auth_route';

const ClientRegistration = lazy(() => import("./core/public/pages/client/client_registration"));
const AdminDashboard = lazy(() => import("./core/private/admin/admin_dashboard"));
const FreelancerRegistration = lazy(() => import("./core/public/pages/freelancer/freelancer_registration"));
const Login = lazy(() => import("./core/public/pages/login"));
const ClientDashboard = lazy(() => import("./core/public/pages/client/client_dashboard"));
const FreelancerDashboard = lazy(() => import("./core/private/freelancer/freelancer_dashboard"));
const BuildYourProfile = lazy(() => import("./core/private/freelancer/build_your_profile_pages/build_your_profile"))

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
      path: "/client-dashboard",
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
        <AuthRoute requiredRole="freelancer" element={<Suspense><BuildYourProfile /></Suspense>} />
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
          <RouterProvider router={router} />
        </InfoProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
