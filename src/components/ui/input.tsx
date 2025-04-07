interface InputProps {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: "text" | "number" | "password" | "email";
  }
  
  const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="input"
        placeholder={placeholder}
      />
    </div>
  );

  export default Input;