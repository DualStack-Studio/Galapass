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
import TourEditingPage from "./pages/owner/TourEditingPage.jsx";
import TourBookingManagementPage from "./pages/owner/TourBookingManagementPage.jsx";
import CompanyEditingPage from "./pages/owner/CompanyEditingPage.jsx";
import TourDetailPage from "./pages/tourist/TourDetailPage.jsx";
import TourDateCreation from "./pages/owner/TourDateCreationPage.jsx";
import BookingReviewPage from "./pages/tourist/TourBookingReviewPage.jsx";
import BookingConfirmationPage from "./pages/tourist/TourBookingConfirmedPage.jsx";
import BecomeOperatorForm from "./pages/owner/BecomeOwnerPage.jsx";
import BecomeGuideForm from "./pages/guide/BecomeGuidePage.jsx";
import UserProfilePage from "./pages/tourist/ProfilePage.jsx";
import EditProfilePage from "./pages/tourist/EditProfilePage.jsx";
import BookingDetailPage from "./pages/tourist/BookingDetailPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import GalapassLanding from "./pages/LandingPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Global Layout with Header & Footer
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/landing", element: <GalapassLanding /> },
      { path: "/profile", element: <UserProfilePage />},
      { path: "/edit-profile", element: <EditProfilePage />},

      // Owner Routes
      { path: "/owner/dashboard", element: <OwnerDashboardPage /> },
      { path: "/owner/add-tour", element: <TourCreationPage /> },
      { path: "/owner/add-company", element: <CompanyCreationPage /> },
      { path: "/owner/add-guide", element: <GuideInvitationPage /> },
      { path: "/owner/edit-tour/:tourId", element: <TourEditingPage /> },
      { path: "/owner/manage-bookings", element: <TourBookingManagementPage /> },
      { path: "/owner/edit-company/:companyId", element: <CompanyEditingPage /> },
      { path: "/owner/add-tour-date/:tourId", element: <TourDateCreation /> },
      { path: "/become-owner", element: <BecomeOperatorForm /> },

      // Tourist Routes
      { path: "/tourist/dashboard", element: <TouristDashboardPage /> },
      { path: "/tourist/tour/:tourId", element: <TourDetailPage /> },
      { path: "/tourist/booking-review", element: <BookingReviewPage /> },
      { path: "/tourist/booking-confirmed", element: <BookingConfirmationPage /> },
      { path: "/tourist/booking-detail", element: <BookingDetailPage />},

      // Guide Routes
      { path: "/guide/dashboard", element: <GuideDashboardPage /> },
      { path: "/become-guide", element: <BecomeGuideForm /> },
    ],
  },
]);

export default router;
