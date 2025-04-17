import { CheckboxField } from '@aws-amplify/ui-react';

interface CheckboxProps {
  label: string;
  name: string;
  value: boolean;
  onChange: (checked: boolean) => void;  
  isDisabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, name, value, onChange, isDisabled = false }) => {
  return (
    <CheckboxField
      label={label}
      name={name}
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      isDisabled={isDisabled}
    />
  );
};

export default Checkbox;