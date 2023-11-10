import React from "react";
import ReactDOM from "react-dom/client";

import LoginProvider from "./context/loginContext";
import "./index.css";
// Import our custom CSS
import "./scss/styles.scss";

// Import all of Bootstrap's JS
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/js/bootstrap.js";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import NavBar from "./components/navBar/navBar";
import MainPage from "./pages/mainPage";

import UserPage from "./pages/userPage";
import ErrorPage from "./pages/errorPage";
import { ProtectedRoute } from "./components/protectedRoute/protectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<MainPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<UserPage />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
  </React.StrictMode>
);
