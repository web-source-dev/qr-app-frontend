import React from "react";
import "../themes/businessthemes.css";

const getCurrentDay = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  return daysOfWeek[currentDay];
};

// Helper function to format time into AM/PM
const formatTime = (time24) => {
  if (!time24) return "Invalid Time"; // Handle undefined or invalid time
  const [hours, minutes] = time24.split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format, treating 0 as 12
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};

const Timeschedule = ({ business_schedule, business_display_theme }) => {
  const currentDay = getCurrentDay(); // Get the current day

  return (
    business_schedule &&
    business_schedule.length > 0 && (
      <div className={`${business_display_theme}-section-box`}>
        <h3>Schedule</h3>
        <ul className={`${business_display_theme}-schedule-list`}>
          {business_schedule.map(({ day, time_slots }, index) => (
            <li
              key={index}
              className={`${business_display_theme}-schedule-day ${
                day === currentDay ? "current-day" : ""
              }`}
            >
              <strong className={`${business_display_theme}-day-name`}>
                {day}:
              </strong>
              {time_slots && time_slots.length > 0 ? (
                // Only render time slots if they exist
                <ul className={`${business_display_theme}-time-slots`}>
                  {time_slots.map(({ start_time, end_time }, slotIndex) => (
                    <li key={slotIndex} className={`${business_display_theme}-time-slot`}>
                      <span className={`${business_display_theme}-time`}>
                        {start_time && end_time
                          ? `${formatTime(start_time)} - ${formatTime(end_time)}`
                          : "Invalid Time Slot"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                // Display "Closed" message if no time slots exist
                <p>Closed</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default Timeschedule;
