import PropTypes from "prop-types";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

StakeField.propTypes = {
  onClick: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  activeField: PropTypes.bool.isRequired,
};

export function RemoveLiquidityField1(props) {
  // This component is used to selecting a coin and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick1, onClick2, symbol1, symbol2 } = props;

  return (
    <div className="flex flex-row items-center justify-around w-full h-20 min-w-full p-4 sm:p-8 rounded-2xl">
      <button
        onClick={onClick1}
        className="flex flex-row items-center justify-around px-4 py-2 font-medium text-white bg-secondary-gray rounded-xl font-poppins"
      >
        <span>{symbol1}</span>
        <ChevronDownIcon className="w-5 h-5 ml-2 text-white transition duration-150 ease-in-out group-hover:text-opacity-80"></ChevronDownIcon>
      </button>
      <button
        onClick={onClick2}
        className="flex flex-row items-center justify-around px-4 py-2 font-medium text-white bg-secondary-gray rounded-xl font-poppins"
      >
        <span>{symbol2}</span>
        <ChevronDownIcon className="w-5 h-5 ml-2 text-white transition duration-150 ease-in-out group-hover:text-opacity-80"></ChevronDownIcon>
      </button>
    </div>
  );
}

export function UnstakeField(props) {
  // This component is used to selecting a coin and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { value, onChange, activeField } = props;
  return (
    <div className="flex flex-row items-center justify-between w-full h-20 min-w-full p-4 bg-primary-black sm:p-8 rounded-2xl">
      <input
        placeholder="0.0"
        type="number"
        value={value}
        disabled={!activeField}
        onChange={onChange}
        className="flex-1 w-full font-medium text-white bg-transparent outline-none font-poppins text-md"
      />
    </div>
  );
}

export default function StakeField(props) {
  // This component is used to selecting a token and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick, symbol, value, onChange, activeField } = props;

  return (
    <div className="flex flex-row items-center justify-between w-full h-20 min-w-full p-4 bg-primary-black sm:p-8 rounded-2xl">
      <input
        placeholder="0.0"
        type="number"
        value={value}
        disabled={!activeField}
        onChange={onChange}
        className="flex-1 w-full font-medium text-white bg-transparent outline-none font-poppins text-md"
      />
      <div className="relative" onClick={onClick}>
        <button className="flex flex-row items-center justify-around px-4 py-2 font-medium text-white bg-secondary-gray rounded-xl font-poppins">
          <span>{symbol}</span>
          <ChevronDownIcon className="w-5 h-5 ml-2 text-white transition duration-150 ease-in-out group-hover:text-opacity-80"></ChevronDownIcon>
        </button>
      </div>
    </div>
  );
}
