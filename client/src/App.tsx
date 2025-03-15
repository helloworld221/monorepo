import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./components/Auth/Login"));
const MediaGrid = lazy(() => import("./components/Media/MediaGrid"));

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MediaGrid />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

export default App;
