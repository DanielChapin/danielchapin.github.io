import { ReactElement } from "react";

type Props = {
  children: any;
  name?: string;
  onClose?: () => void;
};

const SettingsWindow = ({
  children,
  name = "",
  onClose,
}: Props): ReactElement => {
  return (
    <div className="h-min border border-black">
      <div className="bg-slate-500 w-full flex flex-row justify-between px-1">
        <p>{name}</p>
        <button onClick={() => onClose?.()}>X</button>
      </div>
      <div className="bg-slate-200 w-full px-1">{children}</div>
    </div>
  );
};

export default SettingsWindow;
