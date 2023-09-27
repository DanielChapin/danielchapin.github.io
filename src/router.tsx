import { createHashRouter } from "react-router-dom";

import TestPage from "./pages/TestPage";
import PortfolioPage from "./pages/PortfolioPage";
import TerminalPage from "./pages/TerminalPage";
import ResumePage from "pages/ResumePage";

const router = createHashRouter([
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
  {
    path: "/resume",
    element: <ResumePage />,
  },
]);

export default router;
