import { Link } from "react-router-dom";

const PortfolioPage = () => {
  return (
    <div>
      <p className="text-xl text-amber-900">Under Construction</p>
      <Link to={"/terminal"} className="text-blue-500 underline">
        Check out the (<i>in browser</i>) portfolio CLI
      </Link>
    </div>
  );
};

export default PortfolioPage;
