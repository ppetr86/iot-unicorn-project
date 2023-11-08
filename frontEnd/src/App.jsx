import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import NavBar from "./components/navBar/navBar";
import MainPage from "./pages/mainPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />}>
      <Route index element={<MainPage />} />
    </Route>
  )
);

let App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
