import React, { useState } from "react";
import ToggleSwitch from "../ToggleSwitch";

type Props = {
  text: string;
  type: string;
  name: string;
  handleSearch: (key: string, value: string | boolean | null) => void;
};

const Dropdown = ({ text, type, name, handleSearch }: Props) => {
  const [dropdownValue, setDropdownValue] = useState(false);
  const [enableOption, setEnableOption] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  let dropdownField = null;

  if (enableOption) {
    dropdownField = (
      <ToggleSwitch
        checked={dropdownValue}
        onChange={(e) => {
          setDropdownValue(e);
          handleSearch(name, e);
        }}
        label={`${dropdownValue ? 'CON' : 'SIN'}`}
        disabled={false}
        id={`${text} ${name}`}
        className="pt-4"
        textClassName={dropdownValue ? 'text-white' : ''}
      />
    );
  }

  return (
    <div className={`relative flex-1`}>
      <button
        onClick={toggleDropdown}
        style={{ fontWeight: 700 }}
        className={`px-4 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none w-full ${
          enableOption ? "bg-blue-700" : "bg-blue-500"
        }`}
      >
        {text}
      </button>

      {isOpen && (
        <div className="z-10 absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="toggle-container">
              <ToggleSwitch
                checked={enableOption}
                onChange={(e) => {
                  setEnableOption(e);
                  const searchValue = e ? dropdownValue : null;
                  handleSearch(name, searchValue);
                }}
                label={enableOption ? "Activado" : "Activar Filtro"}
                disabled={false}
                id=""
                className=""
                textClassName={enableOption ? 'text-white' : ''}
              />
              {dropdownField}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
