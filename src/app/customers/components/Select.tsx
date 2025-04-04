"use client";
import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";
import { Icons } from "@/../../src/components/icons/Icon";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  value?: string | string[];
  className?: string;
  name?: string;
  children?: ReactNode;
  disabled?: boolean;
  minified?: boolean;
}

interface IconElement extends ReactElement {
  $$typeof: symbol;
  props: {
    position?: "left" | "right";
    [key: string]: unknown;
  };
}

const separateIcons = (children: ReactNode) => {
  const leftIcons: ReactElement[] = [];
  const rightIcons: ReactElement[] = [];
  const otherChildren: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const iconElement = child as IconElement;
      if (iconElement.$$typeof === Symbol.for("react.transitional.element")) {
        const position = iconElement.props.position || "left";
        if (position === "left") {
          leftIcons.push(iconElement);
        } else {
          rightIcons.push(iconElement);
        }
      } else {
        otherChildren.push(child);
      }
    }
  });
  return { leftIcons, rightIcons, otherChildren };
};

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  placeholder = "Select...",
  required = false,
  multiple = false,
  onChange,
  value,
  className,
  name,
  children,
  disabled = false,
  minified = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    multiple
      ? Array.isArray(value)
        ? value
        : []
      : value
      ? [value as string]
      : []
  );
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const { leftIcons, rightIcons, otherChildren } = children
    ? separateIcons(children)
    : { leftIcons: [], rightIcons: [], otherChildren: [] };

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setFilteredOptions(options);
    }
  }, [isOpen, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      const dropdownHeight = 250;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const updatedSelection = selectedOptions.includes(optionValue)
        ? selectedOptions.filter((value) => value !== optionValue)
        : [...selectedOptions, optionValue];

      setSelectedOptions(updatedSelection);
      onChange?.(updatedSelection);
    } else {
      setSelectedOptions([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayText = (): string => {
    if (selectedOptions.length === 0) return "";

    const selectedLabels = selectedOptions
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean) as string[];

    return selectedLabels.join(", ");
  };

  return (
    <div className={`${className} relative`} ref={dropdownRef}>
      <input
        type="hidden"
        name={name}
        value={multiple ? selectedOptions.join(",") : selectedOptions[0] || ""}
        required={required}
      />
      {label && (
        <label
          className={`text-white font-bold text-base mb-4 block relative
            ${
              required
                ? 'after:content-["*"] after:text-red-500 after:ml-1'
                : ""
            }`}
        >
          {label}
        </label>
      )}

      <div
        ref={inputRef}
        className={`text-white flex-1 flex items-center justify-between min-h-[60px] max-h-[60px] w-full rounded-[8px] border bg-transparent px-6 py-1 text-base transition-colors placeholder:text-neutral-30 focus-visible:outline-none focus-visible:ring-1 focus:border-accent-10 disabled:cursor-not-allowed disabled:opacity-50
          ${isOpen ? "border-accent-primary" : "border-neutral-90"}
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-accent-primary transition-colors"
          }`}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
      >
        <div className="truncate leading-[19.07px] text-white text-base flex items-center gap-[10px]">
          {leftIcons}
          {getDisplayText() || (
            <span
              className={`text-base flex-1  !text-white ${
                minified ? "text-xs" : ""
              }`}
            >
              {placeholder}
            </span>
          )}
          {rightIcons}
          {otherChildren}
        </div>
        <Icons.ChevronDownGray
          className={`transition-transform duration-300 *:!fill-white flex-shrink-0 ml-4 ${
            isOpen ? "rotate-180" : ""
          } ${minified ? "w-[7.58px] h-[4.61px]" : ""}`}
        />
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            dropdownPosition === "top" ? "bottom-full mb-1" : "mt-1"
          } w-full bg-white border border-[#E9EAF0] rounded-lg shadow-2xl z-50`}
        >
          <div className="sticky top-0 p-2 bg-white border-b border-white rounded-lg">
            <div className="flex items-center px-3 py-2 bg-[#F5F5F7] rounded-md shadow-sm">
              <Icons.Search className="w-4 h-4 text-neutral-50 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              {searchTerm && (
                <button
                  className="text-white hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");
                    setFilteredOptions(options);
                  }}
                >
                  <Icons.LightCancel className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <ul className="max-h-[200px] overflow-y-auto">
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((option) => (
                <li
                  key={option.value}
                  className={`group px-4 py-3 flex items-center justify-between cursor-pointer
                    hover:bg-accent-95 hover:rounded-bl-lg hover:rounded-br-lg transition-colors
                    ${
                      selectedOptions.includes(option.value)
                        ? "bg-accent-90"
                        : ""
                    }`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  <span className="body-medium-400 text-accent-20 font-medium group-hover:font-bold">
                    {option.label}
                  </span>
                  {selectedOptions.includes(option.value) && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-black"
                    >
                      <path
                        d="M13.3332 4L5.99984 11.3333L2.6665 8"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-white text-center">
                No options found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectInput;
