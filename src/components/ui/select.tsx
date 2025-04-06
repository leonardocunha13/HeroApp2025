interface SelectProps {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
  }
  
  const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <select value={value} onChange={onChange} className="select">
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
export default Select;  