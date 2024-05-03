import { useState } from "react";

import SwitchButton from "./SwitchButton";
import Stake from "./Stake";
import Unstake from "./Unstake";

function Staking(props) {
  const [deploy, setDeploy] = useState(true);

  const deploy_or_remove = (deploy) => {
    if (deploy === true) {
      return (
        <Stake
          network={props.network}
          setupConnection={props.setupConnection}
        />
      );
    }
    return (
      <Unstake
        network={props.network}
        setupConnection={props.setupConnection}
      />
    );
  };

  return (
    <div className="flex justify-center min-h-screen px-6 sm:px-16 bg-primary-img">
      <div className="flex items-center flex-col max-w-[1280px] w-full mt-32">
        <SwitchButton setDeploy={setDeploy} />

        {deploy_or_remove(deploy)}
      </div>
    </div>
  );
}

export default Staking;
