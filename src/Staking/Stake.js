import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";

import { getBalanceAndSymbol, getReserves } from "../ethereumFunctions";
import { addLiquidity, quoteAddLiquidity, stakeEther } from "./StakeFunctions";

import CoinField from "../CoinSwapper/CoinField";
import CoinDialog from "../CoinSwapper/CoinDialog";
import Balance from "../Components/Balance";
import Reserve from "../Components/Reserve";
import LoadingButton from "../Components/LoadingButton";
import WrongNetwork from "../Components/WrongNetwork";
import Loader from "../Components/Loader";

import toast, { Toaster } from "react-hot-toast";
import { ethStakeAddress } from "../constants/chains";

function Stake(props) {
  const { account, chainId } = useWeb3React();

  const notify = () => toast("Transaction Pending...");
  const notifyError = () =>
    toast("Transaction Failed...", {
      className: "border border-red-500",
    });

  // Stores a record of whether their respective dialog window is open
  const [dialog1Open, setDialog1Open] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);
  const [wrongNetworkOpen, setwrongNetworkOpen] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  // Stores data about their respective coin
  const [coin1, setCoin1] = useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });
  const [coin2, setCoin2] = useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });

  const [duration, setDuration] = useState({
    lockTime: undefined,

  });

  // Stores the current reserves in the liquidity pool between coin1 and coin2
  const [reserves, setReserves] = useState(["0.0", "0.0"]);

  // Stores the current value of their respective text box
  const [field1Value, setField1Value] = useState("");
  const [field2Value, setField2Value] = useState("");
  const [fieldDuration, setFieldDuration] = useState("");

  // Controls the loading button
  const [loading, setLoading] = useState(false);
  const [showReserveLoader, setShowReserveLoader] = useState(false);
  const [showLiquidityLoader, setShowLiquidityLoader] = useState(false);

  // Stores the user's balance of liquidity tokens for the current pair
  const [liquidityTokens, setLiquidityTokens] = useState("");

  // Used when getting a quote of liquidity
  const [liquidityOut, setLiquidityOut] = useState([0, 0, 0]);

  // Switches the top and bottom coins, this is called when users hit the swap button or select the opposite
  // token in the dialog (e.g. if coin1 is TokenA and the user selects TokenB when choosing coin2)
  const switchFields = () => {
    let oldField1Value = field1Value;
    let oldField2Value = field2Value;

    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(oldField2Value);
    setField2Value(oldField1Value);
    setReserves(reserves.reverse());
  };

  // These functions take an HTML event, pull the data out and puts it into a state variable.
  const handleChange = {
    field1: (e) => {
      setField1Value(e.target.value);
    },
    field2: (e) => {
      setField2Value(e.target.value);
    },
    fieldDuration: (e) => {
      setDuration(e.target.value);
    }
  };

  // Turns the account's balance into something nice and readable
  const formatBalance = (balance, symbol) => {
    if (balance && symbol)
      return parseFloat(balance).toPrecision(8) + " " + symbol;
    else return "";
  };

  // Turns the coin's reserves into something nice and readable
  const formatReserve = (reserve, symbol) => {
    if (reserve && symbol) return reserve + " " + symbol;
    else return "";
  };

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {
    // If both coins have been selected, and a valid float has been entered for both, which are less than the user's balances, then return true
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);
    return (
      coin1.address &&
      coin2.address &&
      // eslint-disable-next-line use-isnan
      parsedInput1 !== NaN &&
      0 < parsedInput1 &&
      // eslint-disable-next-line use-isnan
      parsedInput2 !== NaN &&
      0 < parsedInput2 &&
      parsedInput1 <= coin1.balance &&
      parsedInput2 <= coin2.balance
    );
  };

  const deploy = () => {
    console.log("Attempting to deploy liquidity...");
    setLoading(true);
  
    // Call the addLiquidity function
    addLiquidity(
      coin1.address,
      coin2.address,
      field1Value, //days
      field2Value, //amount
      fieldDuration,
      "0",
      "0",
      "0",
      props.network.router,
      props.network.account,
      props.network.signer
    )
      .then(() => {
        setLoading(false);
  
        // If the transaction was successful, stake Ether
        stakeEther(fieldDuration, ethStakeAddress, field1Value, props.network.account, props.network.signer)
          .then(() => {
            // If the staking transaction was successful, clear the input
            setField1Value("");
            setField2Value("");
            setFieldDuration("");
            notify();
          })
          .catch((e) => {
            notifyError();
          });
      })
      .catch((e) => {
        setLoading(false);
        notifyError();
      });
  };

  // Called when the dialog window for coin1 exits
  const onToken1Selected = (address) => {
    // Close the dialog window
    setDialog1Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin2.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
      ).then((data) => {
        setCoin1({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  // Called when the dialog window for coin2 exits
  const onToken2Selected = (address) => {
    // Close the dialog window
    setDialog2Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin1.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
      ).then((data) => {
        setCoin2({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  useEffect(() => {
    setShowTransition(true);
  }, []);

  useEffect(() => {
    if (account && chainId === 5) {
      props.setupConnection();
      setwrongNetworkOpen(false);
    } else {
      setwrongNetworkOpen(true);
    }
  }, [account, chainId]);

  // This hook is called when either of the state variables `coin1.address` or `coin2.address` change.
  // This means that when the user selects a different coin to convert between, or the coins are swapped,
  // the new reserves will be calculated.
  useEffect(() => {
    if (coin1.address && coin2.address && props.network.account) {
      setShowReserveLoader(true);
      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account
      ).then((data) => {
        setReserves([data[0], data[1]]);
        setLiquidityTokens(data[2]);
        setShowReserveLoader(false);
      });
    }
  }, [
    coin1.address,
    coin2.address,
    props.network.account,
    props.network.factory,
    props.network.signer,
  ]);

  // This hook is called when either of the state variables `field1Value`, `field2Value`, `coin1.address` or `coin2.address` change.
  // It will give a preview of the liquidity deployment.
  useEffect(() => {
    if (isButtonEnabled()) {
      setShowLiquidityLoader(true);
      quoteAddLiquidity(
        coin1.address,
        coin2.address,
        field1Value,
        field2Value,
        props.network.factory,
        props.network.signer
      ).then((data) => {
        setLiquidityOut([data[0], data[1], data[2]]);
        setShowLiquidityLoader(false);
      });
    }
  }, [coin1.address, coin2.address, field1Value, field2Value, isButtonEnabled, props.network.factory, props.network.signer]);

  // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
  // updated has changed. This allows them to see when a transaction completes by looking at the balance output.
  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      console.log("Checking balances & Getting reserves...");

      if (coin1.address && coin2.address && props.network.account) {
        setShowReserveLoader(true);
        getReserves(
          coin1.address,
          coin2.address,
          props.network.factory,
          props.network.signer,
          props.network.account
        ).then((data) => {
          setReserves([data[0], data[1]]);
          setLiquidityTokens(data[2]);
          setShowReserveLoader(false);
        });
      }

      if (coin1.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin1.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => {
          setCoin1({
            ...coin1,
            balance: data.balance,
          });
        });
      }
      if (coin2.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => {
          setCoin2({
            ...coin2,
            balance: data.balance,
          });
        });
      }
    }, 10000);

    return () => clearTimeout(coinTimeout);
  });

  return (
    <div>
      {/* Dialog Windows */}
      <CoinDialog
        open={dialog1Open}
        onClose={onToken1Selected}
        closeModal={() => setDialog1Open(false)}
        accountAddress={props.network.account}
        provider={props.network.provider}
        signer={props.network.signer}
        weth_address={props.network.weth.address}
        coins={props.network.coins}
      />
      <CoinDialog
        open={dialog2Open}
        onClose={onToken2Selected}
        closeModal={() => setDialog2Open(false)}
        accountAddress={props.network.account}
        provider={props.network.provider}
        signer={props.network.signer}
        weth_address={props.network.weth.address}
        coins={props.network.coins}
      />
      <div className="flex flex-col items-center justify-start flex-1 w-full">
        <div className="flex justify-center w-full mt-10">
          <div className="relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full p-[2px] rounded-3xl">
            <div className="w-full min-h-[400px] bg-slate-50 backdrop-blur-[4px] border border-black rounded-3xl shadow-card flex flex-col p-10">
              {wrongNetworkOpen ? (
                <WrongNetwork></WrongNetwork>
              ) : (
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
                  <div>
                    <div className="mb-4">
                      <CoinField
                        activeField={true}
                        value={field1Value}
                        onClick={() => setDialog1Open(true)}
                        onChange={handleChange.field1}
                        symbol={
                          coin1.symbol !== undefined ? coin1.symbol : "Select"
                        }
                      />
                      <Balance
                        balance={coin1.balance}
                        symbol={coin1.symbol}
                        format={formatBalance}
                      />
                    </div>

                    <div className="mb-2 w-[100%]">
                      <CoinField
                        activeField={true}
                        value={field2Value}
                        onClick={() => setDialog2Open(true)}
                        onChange={handleChange.field2}
                        symbol={
                          coin2.symbol !== undefined ? coin2.symbol : "Select"
                        }
                      />
                      <Balance
                        balance={coin2.balance}
                        symbol={coin2.symbol}
                        format={formatBalance}
                      />

                        <CoinField
                        activeField={true}
                        value={fieldDuration}
                        onClick={() => setDialog2Open(true)}
                        onChange={handleChange.duration}
                        symbol={
                          duration.lockTime !== undefined ? duration.lockTime : "Select"
                        }
                      />
                    </div>

                    <div className="mt-4 mb-6">
                      <h3 className="mb-2 text-xl font-semibold text-center text-black">
                        Reserves
                      </h3>
                      <div className="flex flex-col">
                        {showReserveLoader ? (
                          <div className="mx-auto">
                            <Loader></Loader>
                          </div>
                        ) : (
                          <>
                            <Reserve
                              reserve={reserves[0]}
                              symbol={coin1.symbol}
                              format={formatReserve}
                            />
                            <Reserve
                              reserve={reserves[1]}
                              symbol={coin2.symbol}
                              format={formatReserve}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="relative min-w-full max-w-full p-[2px] rounded-3xl mb-4">
                      <div className="w-full bg-primary-black backdrop-blur-[4px] rounded-3xl shadow-card flex flex-row justify-around p-4 text-white">
                        <div className="flex flex-col">
                          <h6 className="mb-2 text-lg font-bold text-center">
                            Tokens In
                          </h6>
                          <div className="mx-auto">
                            {showLiquidityLoader ? (
                              <Loader></Loader>
                            ) : (
                              <>
                                <div className="text-sm">
                                  {formatBalance(liquidityOut[0], coin1.symbol)}
                                </div>
                                <div className="text-sm">
                                  {formatBalance(liquidityOut[1], coin2.symbol)}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h6 className="mb-2 text-lg font-bold text-center">
                            Tokens Out
                          </h6>
                          <div className="mx-auto">
                            {showLiquidityLoader ? (
                              <Loader></Loader>
                            ) : (
                              <span className="text-sm">
                                {formatBalance(liquidityOut[2], "Asnodt-LP")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <LoadingButton
                      loading={loading}
                      valid={isButtonEnabled()}
                      success={false}
                      fail={false}
                      onClick={deploy}
                    >
                      Deploy
                    </LoadingButton>
                  </div>
                </Transition>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "border border-fuchsia-900",
          duration: 5000,
          style: {
            background: "#15171A",
            color: "#65B3AD",
          },
        }}
      />
    </div>
  );
}

export default Stake;
