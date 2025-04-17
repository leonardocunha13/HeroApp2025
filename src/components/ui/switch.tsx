import { SwitchField } from '@aws-amplify/ui-react';
import { useState } from 'react';

interface SwitchProps {
  label: string;
  name: string;
  value: boolean;
  onChange: (checked: boolean) => void;  
  isDisabled?: boolean;
}
const Switch: React.FC<SwitchProps> = ({ label, name, value, onChange, isDisabled = false }) => {
  const [checked, setChecked] = useState(value);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    onChange(checked);
  };

  return (
    <SwitchField
      label={label}
      name={name}
      checked={checked}
      onChange={(e) => handleChange(e.target.checked)}
      isDisabled={isDisabled}
    />
  );
}
export default Switch;
