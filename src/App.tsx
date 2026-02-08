import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Dashboard from "./pages/Admin/Dashboard";
import Home from "./pages/Dashboard/Home";
import { ToastProvider } from "./context/ToastContext";
import AccountSettings from "./pages/AccounSettings";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
      <ToastProvider>
        <>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Admin Layout */}
              <Route element={<AppLayout />}>
                {/* ADMIN ONLY */}
                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/admin" element={<Dashboard />} />
                </Route>

                {/* NORMAL USERS ONLY */}
                <Route element={<ProtectedRoute normalOnly />}>
                  <Route path="/home" element={<Home />} />
                </Route>

                {/* Others Page */}
                {/* BOTH */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<UserProfiles />} />
                  <Route path="/account" element={<AccountSettings />} />
                </Route>

                {/* <Route path="/calendar" element={<Calendar />} />
                <Route path="/blank" element={<Blank />} /> */}

                {/* Forms */}
                {/* <Route path="/form-elements" element={<FormElements />} /> */}

                {/* Tables */}
                {/* <Route path="/basic-tables" element={<BasicTables />} /> */}

                {/* Ui Elements */}
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/badge" element={<Badges />} />
                <Route path="/buttons" element={<Buttons />} />
                <Route path="/images" element={<Images />} />
                <Route path="/videos" element={<Videos />} />

                {/* Charts */}
                {/* <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} /> */}
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/signin" replace />} />

              {/* Auth Layout */}
              <Route index path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />


            </Routes>
          </Router>
        </>
      {/* rest of your app */}
    </ToastProvider>
  );
}
