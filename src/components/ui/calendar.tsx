import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export function MyDatePicker() {
  const [selected, setSelected] = useState<Date>();

  return (
    <DayPicker
      animate
      mode="single"
      fixedWeeks showWeekNumber
      selected={selected}
      onSelect={setSelected}
      captionLayout="dropdown"
      footer={
        selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
      }
      showOutsideDays
      
    />
  );
}