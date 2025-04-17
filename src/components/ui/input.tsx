import { Input, Label } from '@aws-amplify/ui-react';

interface InputProps {
  label: string;
  name?: string;
  value?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}



export default function TextInput({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  required = false,
  
}: InputProps) {
  return (
    <Label
    htmlFor={name}  // Corrected prop name from 'htmlFor' to 'httlFor'
    className="Label"
    style={{ color: 'black' }} // Added inline style for label color
    
    
    
    >
      {label}
      <Input
        name={name || ''}
        value={value}
        checked={checked}
        onChange={onChange}
        isDisabled={disabled}
        isRequired={required}
      />
    </Label>
  );
}
