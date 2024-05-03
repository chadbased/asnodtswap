import { useRef } from "react";
import { ethers } from "ethers";
import {
  getAccount,
  getFactory,
  getRouter,
  getNetwork,
  getWeth,
} from "./ethereumFunctions";
import COINS from "./constants/coins";
import * as chains from "./constants/chains";
import { InjectedConnector } from "@web3-react/injected-connector";

const { ethereum } = window;

export const switchNetwork = async () => {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x5" }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x5",
              chainName: "Goerli Testnet",
              nativeCurrency: {
                name: "Goerli ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://goerli.infura.io/v3/27345b7aeb16430bbd8c838ea8dacc91"],
              blockExplorerUrls: ["https://goerli.etherscan.io"],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    console.log(switchError);
  }
};

export const formatAddress = (value, length = 4) => {
  return `${value.substring(0, length + 2)}...${value.substring(
    value.length - length
  )}`;
};

export const injected = new InjectedConnector({
  supportedChainIds: [5],
});

const Web3ProviderCore = (props) => {
  let network = Object.create({});
  network.provider = useRef(null);
  network.signer = useRef(null);
  network.account = useRef(null);
  network.coins = [];
  network.chainID = useRef(null);
  network.router = useRef(null);
  network.factory = useRef(null);
  network.weth = useRef(null);
  async function setupConnection() {
    try {
      network.provider = new ethers.providers.Web3Provider(window.ethereum);
      network.signer = await network.provider.getSigner();
      await getAccount().then(async (result) => {
        network.account = result;
      });

      await getNetwork(network.provider).then(async (chainId) => {
        // Set chainID
        network.chainID = chainId;
        if (chains.networks.includes(chainId)) {
          // Get the router using the chainID
          network.router = await getRouter(
            chains.routerAddress.get(chainId),
            network.signer
          );
          // Get default coins for network
          network.coins = COINS.get(chainId);
          // Get Weth address from router
          await network.router.WETH().then((wethAddress) => {
            network.weth = getWeth(wethAddress, network.signer);
            // Set the value of the weth address in the default coins array
            network.coins[0].address = wethAddress;
          });
          // Get the factory address from the router
          await network.router.factory().then((factory_address) => {
            network.factory = getFactory(factory_address, network.signer);
          });
        } else {
          console.log("Wrong network mate.");
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  return <>{props.render(network, setupConnection)}</>;
};

export default Web3ProviderCore;
