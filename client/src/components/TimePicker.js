import React, { useEffect, useState } from "react";

const CustomTimeRangePicker = ({ value = ["", ""], onChange }) => {
  const [timeRange, setTimeRange] = useState(value);

  useEffect(() => {
    setTimeRange(value); // Sync with initial values
  }, [value]);

  const handleChange = (index, newValue) => {
    const updatedTimeRange = [...timeRange];
    updatedTimeRange[index] = newValue;
    setTimeRange(updatedTimeRange);
    if (onChange) {
      onChange(updatedTimeRange); // Notify parent form
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <input
        type="time"
        value={timeRange[0] || ""}
        onChange={(e) => handleChange(0, e.target.value)}
        required
      />
      <input
        type="time"
        value={timeRange[1] || ""}
        onChange={(e) => handleChange(1, e.target.value)}
        required
      />
    </div>
  );
};

export default CustomTimeRangePicker;
