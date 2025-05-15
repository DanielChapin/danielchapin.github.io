import { createHashRouter } from "react-router-dom";

import TestPage from "./pages/TestPage";
import PortfolioPage from "./pages/PortfolioPage";
import TerminalPage from "./pages/TerminalPage";
import MinesweeperPage from "pages/games/MinesweeperPage";

const router = createHashRouter([
  {
    path: "/",
    // element: <PortfolioPage />,
    element: <TerminalPage />,
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
    path: "/games/minesweeper",
    element: <MinesweeperPage />,
  },
]);

export default router;
