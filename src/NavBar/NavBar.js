import { Link, useLocation } from "react-router-dom";
import Connect from "../Components/Connect";
import logoImage from "../assets/logo.png"; // Assuming the PNG file is named "logo.png"


const Navbar = () => {
  return (
    <nav className="bg-slate-50 shadow-lg fixed w-full">
      <div className="p-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-end h-16">
          {/* <div className="flex items-center justify-center text-2xl font-bold sm:items-stretch sm:justify-start text-primary-green">
          <img
              src={logoImage}
              alt="Logo"
              className="w-auto h-8 text-primary-green"
            />
          </div>
          <div className="flex items-center pr-2 mx-auto sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <li className="list-none">
              <Link
                className={`${
                  useLocation().pathname === "/"
                    ? "text-primary-green"
                    : "text-gray-500"
                } "no-underline p-3 text-sm font-bold "`}
                aria-current="page"
                to={"/"}
              >
                Swap
              </Link>
            </li>
            <li className="list-none">
              <Link
                className={`${
                  useLocation().pathname === "/liquidity"
                    ? "text-primary-green"
                    : "text-gray-500"
                } "no-underline p-3 text-sm font-bold "`}
                aria-current="page"
                to={"/liquidity"}
              >
                Liquidity
              </Link>
              
            </li>
            <li className="list-none">
              
              
            </li>
          </div> */}
          <Connect></Connect>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
