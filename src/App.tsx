import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import WelcomeIntro from "./components/WelcomeIntro";
import Dashboard from "./components/Dashboard";
import MealPlanning from "./components/MealPlanning";
import ExercisePlanning from "./components/ExercisePlanning";
import FoodSearch from "./components/FoodSearch";
import Progress from "./components/Progress";
import Profile from "./components/Profile";
import ProfileSetup from "./components/ProfileSetup";
import { MealProvider } from "./context/MealContext";
import { UIProvider } from "./context/UIContext";


const isUserOnboarded = () => {
  const userData = localStorage.getItem("user");
  if (!userData) return false;
  try {
    
    JSON.parse(userData);
    return true;
  } catch (e) {
    
    localStorage.removeItem("user");
    return false;
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return isUserOnboarded() ? (
    <>{children}</>
  ) : (
    <Navigate to="/onboarding" replace />
  );
};

function App() {
  return (
    <Router>
      <UIProvider>
        <MealProvider>
          <Routes>
            {}
            <Route
              path="/"
              element={
                <Layout showNavigation={false}>
                  <LandingPage />
                </Layout>
              }
            />
            <Route
              path="/onboarding"
              element={
                <Layout showNavigation={false}>
                  <Onboarding />
                </Layout>
              }
            />
            <Route
              path="/welcome"
              element={
                <Layout showNavigation={false}>
                  <WelcomeIntro />
                </Layout>
              }
            />

            {}
            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <Layout showNavigation={false}>
                    <ProfileSetup />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/meals"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MealPlanning />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExercisePlanning />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FoodSearch />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Progress />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MealProvider>
      </UIProvider>
    </Router>
  );
}

export default App;
