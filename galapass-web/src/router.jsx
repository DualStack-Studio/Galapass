import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage.jsx";
import AddTourPage from "./pages/owner/TourCreationPage";
import TouristDashboardPage from "./pages/tourist/TouristDashboardPage.jsx";
import GuideDashboardPage from "./pages/guide/GuideDashboardPage.jsx";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout.jsx";
import TourCreationPage from "./pages/owner/TourCreationPage";
import CompanyCreationPage from "./pages/owner/CompanyCreationPage.jsx";
import GuideInvitationPage from "./pages/owner/GuideInvitationPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Global Layout with Header & Footer
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },


      // Owner Routes
      { path: "/owner/dashboard", element: <OwnerDashboardPage /> },
      { path: "/owner/add-tour", element: <TourCreationPage /> },
      { path: "/owner/add-company", element: <CompanyCreationPage /> },
      { path: "/owner/add-guide", element: <GuideInvitationPage /> },

      // Tourist Routes
      { path: "/tourist/dashboard", element: <TouristDashboardPage /> },

      // Guide Routes
      { path: "/guide/dashboard", element: <GuideDashboardPage /> },
    ],
  },
]);

export default router;
