import { Link } from "react-router-dom";
import Terminal from "../elements/terminal/Terminal";

const App = () => {
  return (
    <div className="w-screen h-screen">
      <Link to={"/test"}>Link to test page</Link>
      <Terminal />
    </div>
  );
};

export default App;
