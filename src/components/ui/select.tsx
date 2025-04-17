import React from 'react';
import { SelectField } from '@aws-amplify/ui-react';

interface CustomSelectProps {
  label: string;
  placeholder?: string;
  descriptiveText?: string;
  isDisabled?: boolean;
  errorMessage?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  [key: string]: any; // Allow additional props to be passed
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, placeholder, descriptiveText, options, ...props }) => {
  return (
    <SelectField 
      descriptiveText={descriptiveText}
      label={label}
      isDisabled={props.isDisabled}
      placeholder={placeholder}
      errorMessage={props.errorMessage}
      onChange={props.onChange} 
      {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectField>
  );
};

export default CustomSelect;