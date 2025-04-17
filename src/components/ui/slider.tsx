import React from 'react';
import { SliderField } from '@aws-amplify/ui-react';

interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  isDisabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  label = 'Slider',
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  isDisabled = false,
}) => {
  const handleChange = (value: number) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <SliderField
      label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={defaultValue}
      onChange={(value) => handleChange(Number(value))}
      isDisabled={isDisabled}
    />
  );
};

export default Slider;