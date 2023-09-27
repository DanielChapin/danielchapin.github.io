import Resume from "elements/resume/Resume";
import { ReactElement } from "react";

const ResumePage = (): ReactElement => {
  return (
    <div className="flex items-center content-center min-h-screen min-w-screen">
      <Resume />
    </div>
  );
};

export default ResumePage;
