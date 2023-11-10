import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import NavBar from "./components/navBar/navBar";
import MainPage from "./pages/mainPage";
import LoginProvider from "./context/loginContext";
import UserPage from "./pages/userPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />}>
      <Route index element={<MainPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="*" element={<h2>There is nothing here: 404!</h2>} />
    </Route>
  )
);

let App = () => {
  return (
    <>
      <LoginProvider>
        <RouterProvider router={router} />
      </LoginProvider>
    </>
  );
};

export default App;
