import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";

const TimeSelector = (props) => {
  const {startTime, endTime, onChange} = props;

  const [timeSlots, setTimeSlots] = useState([]);
  const [anchors, setAnchors] = useState([]);
  const [draggedAnchor, setDraggedAnchor] = useState(null);

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
      const insertedStartTime = new Date(startTime);
      slots.push({ time: formattedTime, comparableTime: insertedStartTime});
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    console.log(slots);
    return slots;
  }

  useEffect(() => { //initialize time slots useEffect
    async function formData(){
    setTimeSlots(generateTimeSlots());
    }formData()
  }, [startTime, endTime]);

  const isBetweenAnchors = (time) => {
    if (anchors.length<2) return false;

    for(let i=0; i<anchors.length-1; i+=2){
      if (time > anchors[i] && time < anchors[i+1]) return true;
    }
    return false;
  }

return (
    <div className="time-selector">
      <ul className="time-range">
          {timeSlots.map((slot, index) => (
            <li className="row" key={slot.time}>
            <div className="time-label">{slot.time}</div>
            <div
              className={`time-slot   
              ${index % 2 === 1 ? "time-gray" : ""}
              ${isBetweenAnchors(slot.comparableTime)? "selected" : ""  }
              ${index === 0 ? "top-slot" : ""}
              ${(anchors.findIndex((element)=>(element==slot.comparableTime))==anchors.length-1 &&
                anchors.length%2==1) ? "warning-slot" : 
              (anchors.includes(slot.comparableTime) ? 
                ((anchors.findIndex((element)=>(element==slot.comparableTime))%2==0) ? "topAnchorTime" : "bottomAnchorTime"):
              "")}
              `}
              
              onClick={() => {
                if (anchors.includes(slot.comparableTime)) {
                  let newAnchors = anchors.filter((anchor) => anchor !== slot.comparableTime);
                  setAnchors(newAnchors);
                } else {
                  let newAnchors = [...anchors, slot.comparableTime];
                  newAnchors.sort((a, b) => a - b);
                  setAnchors(newAnchors);
                }
              }}
            />
            {anchors.includes(slot.comparableTime) && (
                <div className={`${(anchors.findIndex((element)=>(element==slot.comparableTime))==anchors.length-1 &&
                  anchors.length%2==1) ? "warningAnchor" :
                `anchor ${(anchors.findIndex((element)=>(element==slot.comparableTime))%2==0) ? "topAnchor" : "bottomAnchor" }`}`}/>  
                // anchor ${(anchors.findIndex((element)=>(element==slot.comparableTime))%2==0 ? "topAnchor ": "bottomAnchor")}`    />
              )}
        </li>
        ))}        
      </ul>
    </div>
  );
}; 

export default TimeSelector; 