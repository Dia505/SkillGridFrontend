import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { InfoProvider } from "./context/info_context";

const ClientRegistration = lazy(() => import("./core/public/pages/client/client_registration"))
const AdminDashboard = lazy(() => import("./core/private/admin/admin_dashboard"))
const FreelancerRegistration = lazy(() => import("./core/public/pages/freelancer/freelancer_registration"))
const Login = lazy(() => import("./core/public/pages/login"))
const ClientDashboard = lazy(() => import("./core/public/pages/client/client_dashboard"))

const queryClient = new QueryClient();

function App() {
  const token = false;

  const privateRouter = [
    {
      path: "/admin-dashboard",
      element: (
        <Suspense>
          <AdminDashboard />
        </Suspense>
      )
    }
  ]

  const publicRouter = [
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
    //fallback UI for unauthorized access
    {
      path: "*",
      element: <Suspense>Unauthorized</Suspense>,
      errorElement: <>error</>,
    },
  ];
  const router = token ? privateRouter : publicRouter;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <InfoProvider>
          <RouterProvider router={createBrowserRouter(router)} />
        </InfoProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;