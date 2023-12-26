import LazyImage from "../../components/LazyImage";
import React from "react";
import Select from 'react-select';

export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const colourOptions: readonly ColourOption[] = [
  { value: 'like', label: 'like', color: '#00B8D9'},
  { value: 'follow', label: 'follow', color: '#5243AA' },
  { value: 'comment', label: 'comment', color: '#0052CC' },
];

const SelectInput: React.FC<{
  title?: string
  onChange?: (e: any) => void
}> = ({
  title,
  onChange
}) => {
  return (
    <div className="flex items-center justify-between py-[6px] px-2 bg-[rgba(85,123,241,0.02)] rounded-[8px] cursor-pointer min-w-[120px]">
      {/* <span className="mr-5">{title}</span>
      <LazyImage src="/images/airdrop/arrow-down.svg" /> */}
      <Select
        onChange={e => {
          onChange && onChange(e)
        }}
        className="basic-single"
        classNamePrefix="select"
        defaultValue={colourOptions[0]}
        name="color"
        options={colourOptions}
      />
    </div>
  )
}

export default SelectInput