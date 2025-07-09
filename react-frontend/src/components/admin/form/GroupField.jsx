import cn from "../../../utils/cn.js";

const GroupField = ({
  label,
  labelFor,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };
  return (
    <div className="flex flex-col gap-2 mt-4 w-full">
      <label htmlFor={labelFor}>{label}</label>
      <input
        type={type}
        id={labelFor}
        name={name}
        placeholder={placeholder}
        className={cn("input-field-1")}
        value={value}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default GroupField;
