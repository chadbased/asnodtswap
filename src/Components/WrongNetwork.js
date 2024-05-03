import { useEffect, useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { mantleBackground } from "../assets";
import { switchNetwork } from "../network";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { injected } from "../network";

const WrongNetwork = () => {
  const { active, account, activate, setError } = useWeb3React();
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    setShowTransition(true);
  }, []);

  const onClickConnect = () => {
    activate(
      injected,
      (error) => {
        if (error instanceof UserRejectedRequestError) {
          // ignore user rejected error
          console.log("user refused");
        } else {
          setError(error);
        }
      },
      false
    );
  };

  return (
    <>

      <Transition
        appear={true}
        show={showTransition}
        enter="transition ease-out duration-500"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-500"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div className="z-50 flex flex-col justify-end p-8 bg-transparent h-96">
          <p className="my-4 text-lg font-semibold text-center font-poppins text-primary-green">
            {active && typeof account === "string"
              ? "Switch to Goerli Test Network!"
              : "Connect your Wallet!"}
          </p>
          <button
            onClick={
              active && typeof account === "string"
                ? switchNetwork
                : onClickConnect
            }
            className="px-12 py-2 my-4 font-semibold text-white transition-all border-none rounded-lg outline-none bg-fuchsia-900 font-poppins text-md"
          >
            {active && typeof account === "string" ? "Switch" : "Connect"}
          </button>
        </div>
      </Transition>
    </>
  );
};

export default WrongNetwork;
