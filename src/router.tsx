import { createBrowserRouter } from "react-router-dom";

import TestPage from "./pages/TestPage";
import PortfolioPage from "./pages/PortfolioPage";
import TerminalPage from "./pages/TerminalPage";

// TODO Update to use HashRouter (to permit page refreshes on gh-pages deployment)
const router = createBrowserRouter([
  {
    path: "/",
    element: <PortfolioPage />,
  },
  {
    path: "/terminal",
    element: <TerminalPage />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
]);

export default router;
