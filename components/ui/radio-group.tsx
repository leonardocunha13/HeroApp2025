import React from "react";
import { RadioGroupField, Radio } from "@aws-amplify/ui-react";

interface RadioOption {
  value: string;
  label: string;
}

interface ReusableRadioGroupProps {
  legend: string;
  name: string;
  options: RadioOption[];
  onChange?: (value: string) => void;
}

const ReusableRadioGroup: React.FC<ReusableRadioGroupProps> = ({
  legend,
  name,
  options,
  onChange,
}) => {
  return (
    <RadioGroupField
      legend={legend}
      name={name}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {options.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </RadioGroupField>
  );
};

export default ReusableRadioGroup;
