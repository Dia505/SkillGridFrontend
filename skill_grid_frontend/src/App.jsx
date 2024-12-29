import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { InfoContext, InfoProvider } from "./context/info_context";

const ClientRegistration = lazy(() => import("./core/public/pages/client_registration"))
const AdminDashboard = lazy(() => import("./core/private/admin/admin_dashboard"))

function App() {
  const token = false;

  const privateRouter = [
    {
      path: "/admin-dashboard",
      element: (
        <Suspense>
          <AdminDashboard/>
        </Suspense>
      )
    }
  ]

  const publicRouter = [
    {
      path: "/client-registration",
      element: (
        <Suspense>
          <ClientRegistration/>
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
  const router = token? privateRouter : publicRouter;

  return(
    <>
      <InfoProvider>
        <RouterProvider router = {createBrowserRouter(router)}/>
      </InfoProvider>
    </>
  );
}

export default App;