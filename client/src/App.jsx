
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Login,
  Register,
  DashboardLayout,
  Error,
  Landing,
  AddJob,
  AllJobs,
  Stats,
  Profile,
  RegisterRecruiter,
  About,
  Contact
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <DashboardLayout /> },
      { path: "landing", element: <Landing /> },
      { path: "AddJob", element: <AddJob /> },
      { path: "AllJobs", element: <AllJobs /> },
      { path: "Stats", element: <Stats /> },
      { path: "Profile", element: <Profile /> },
      { path: "registerRecruiter", element: <RegisterRecruiter /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
