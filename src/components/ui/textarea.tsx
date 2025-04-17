import React from 'react';
import { TextAreaField, TextAreaFieldProps } from '@aws-amplify/ui-react';

interface TextFieldProps extends TextAreaFieldProps {
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  descriptiveText?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: () => void;
  [key: string]: any; // Allow additional props to be passed  
  
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder = '',
  isRequired = false,
  descriptiveText = '',
  errorMessage = '',
  isDisabled = false,
  onChange,
  onBlur,
  ...props
}) => {
  return (
    <TextAreaField
      label={label}
      placeholder={placeholder}
      isRequired={isRequired}
      descriptiveText={descriptiveText}
      errorMessage={errorMessage}
      isDisabled={isDisabled}
      onChange={onChange}
      onBlur={onBlur}

      {...props}
    />
  );
};

export default TextField;