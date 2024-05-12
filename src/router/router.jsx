import { createBrowserRouter, RouterProvider } from "react-router-dom";



import WelcomePage from "../pages/WelcomePage";
import LoginPage from "../pages/LoginPage";
import CodePage from "../pages/CodePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  

  {
    path: "/welcomePage",
    element: <WelcomePage />,
  },
  {
    path: "/codePage",
    element: <CodePage />,
  },

]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
