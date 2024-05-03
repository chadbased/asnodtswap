import { useState } from "react";

export default function SwitchButton(props) {
  const { setDeploy } = props;

  const [deployPage, setDeployPage] = useState(true);

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`"bg-primary-black text-primary-green border border-fuchsia-900 rounded-l-lg px-8 py-2 text-md font-medium " ${
          deployPage ? "bg-fuchsia-900 text-slate-50" : ""
        }`}
        onClick={() => {
          setDeployPage(true);
          setDeploy(true);
        }}
      >
        Stake
      </button>
      <button
        type="button"
        className={`"bg-primary-black text-primary-green border border-fuchsia-900 rounded-r-lg px-8 py-2 text-md font-medium " ${
          !deployPage ? "bg-fuchsia-900 text-slate-50" : ""
        }`}
        onClick={() => {
          setDeployPage(false);
          setDeploy(false);
        }}
      >
        Unstake
      </button>
    </div>
  );
}
