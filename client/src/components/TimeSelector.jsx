import React, { useState, useEffect } from "react";

const TimeSelector = (props) => {
  const {startTime, endTime, onChange} = props;

  const [timeSlots, setTimeSlots] = useState([]);
  const [anchors, setAnchors] = useState(null);

  function formatAMPM(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "PM" : "AM";
      hours %= 12; //will convert 13 -> 1 ie
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes; //will add 0 before 10 ie 10 -> 010
      return `${hours}:${minutes} ${ampm}`;
  }

  function generateTimeSlots() {
    const slots = [];
    while (startTime <= endTime) {
      const formattedTime = formatAMPM(startTime);
      slots.push({ time: formattedTime, comparableTime: startTime, selected: false });
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    return slots;
  }

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, [startTime, endTime]);

return (
    <div className="time-selector">
      <ul className="time-range">
          {timeSlots.map((slot, index) => (
            <li className="row" key={slot.time}>
            <div className="time-label">{slot.time}</div>
            <div
              className={`time-slot ${slot.selected ? "selected" : ""} ${
                index % 2 === 1 ? "time-gray" : ""
              } ${index === 0 ? "time-first" : ""}`}
            />
        </li>
        ))}        
      </ul>
    </div>
  );
};

export default TimeSelector; 