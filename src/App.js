import React from "react";
import Web3ProviderCore from "./network";
import NarBar from "./NavBar/NavBar";
import Sidebar from "./SideBar/SideBar";
import CoinSwapper from "./CoinSwapper/CoinSwapper";
import Farming from "./Farming/Farming";
import Staking from "./Staking/Staking";
import { Route } from "react-router-dom";
import Liquidity from "./Liquidity/Liquidity";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  return library;
};

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderCore
        render={(network, setupConnection) => (
          <div>
            <NarBar />
            <Sidebar />

            <Route exact path="/">
              <CoinSwapper
                network={network}
                setupConnection={setupConnection}
              />
            </Route>
            <Route exact path="/liquidity">
              <Liquidity network={network} setupConnection={setupConnection} />
            </Route>

          </div>
        )}
      ></Web3ProviderCore>
    </Web3ReactProvider>
  );
};

export default App;
