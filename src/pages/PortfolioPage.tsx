import { Link } from "react-router-dom";

const PortfolioPage = () => {
  return (
    <div>
      <p className="text-xl text-amber-900">Under Construction</p>
      <Link to={"/terminal"} className="text-blue-500 underline">
        Check out the (<i>in browser</i>) portfolio CLI
      </Link>
      <p>
        {"Also check out "}
        <Link to="/games/minesweeper" className="text-blue-500 underline">
          Minesweeper
        </Link>
        !
      </p>
    </div>
  );
};

export default PortfolioPage;
