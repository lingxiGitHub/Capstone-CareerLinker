import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useGetSessionQuery } from "./api";
import Nav from "./components/Nav/Nav";
import Toaster from "./components/Toaster";
import Landing from "./features/auth/Landing";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import FeedPage from "./features/feed/FeedPage";
import ProfilePage from "./features/profile/ProfilePage";
import NetworkPage from "./features/network/NetworkPage";
import ConnectionsPage from "./features/network/ConnectionsPage";
import MessagingPage from "./features/messaging/MessagingPage";
import JobsPage from "./features/jobs/JobsPage";
import NotificationsPage from "./features/notifications/NotificationsPage";
import SearchPage from "./features/search/SearchPage";
import NotFound from "./features/NotFound";
import { LogoMark } from "./components/Logo";

function Splash() {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 24 }}>
        <LogoMark size={56} />
        <div style={{ width: 160, height: 2, background: "#e0dfdc", borderRadius: 2, overflow: "hidden" }}>
          <div className="skeleton" style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, var(--brand), transparent)", backgroundSize: "200% 100%" }} />
        </div>
      </div>
    </div>
  );
}

function SignedInLayout() {
  const { data } = useGetSessionQuery();
  const location = useLocation();
  if (!data?.user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

function SignedOutOnly({ children }) {
  const { data } = useGetSessionQuery();
  return data?.user ? <Navigate to="/feed" replace /> : children;
}

export default function App() {
  const { isLoading } = useGetSessionQuery();
  if (isLoading) return <Splash />;

  return (
    <>
      <Routes>
        <Route path="/" element={<SignedOutOnly><Landing /></SignedOutOnly>} />
        <Route path="/login" element={<SignedOutOnly><Login /></SignedOutOnly>} />
        <Route path="/signup" element={<SignedOutOnly><Signup /></SignedOutOnly>} />
        <Route element={<SignedInLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/in/:userId" element={<ProfilePage />} />
          <Route path="/mynetwork" element={<NetworkPage />} />
          <Route path="/mynetwork/connections" element={<ConnectionsPage />} />
          <Route path="/messaging" element={<MessagingPage />} />
          <Route path="/messaging/:conversationId" element={<MessagingPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/home" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
