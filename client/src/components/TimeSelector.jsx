import React, { useState, useEffect } from "react";

const TimeSelector = (props) => {
  const {startTime, endTime, onChange} = props;

  const [timeSlots, setTimeSlots] = useState([]);
  const [anchors, setAnchors] = useState([]);

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
      slots.push({ time: formattedTime, comparableTime: insertedStartTime, selected: false });
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    console.log(slots);
    return slots;
  }
// useEffect(()=>{
//   console.log(anchors)
//   async function formData(){
//   if(anchors.length%2===0){
//     let y=0;
//     let open=false;
// for(let x=0;x<timeSlots.length;x++){
//   if(open===false){
// if(anchors.indexOf(timeSlots[x].time)!==-1){
//   open=true;
//   y++;
//   timeSlots[x].selected=true;
// }
// else{
//   timeSlots[x].selected=false;

// }
//   }
// else{
//   if(anchors.indexOf(timeSlots[x].time)!==-1){
//     open=false;
//     y++
//   }
//   timeSlots[x].selected=true;
// }
// }
//   }
//   else{
//     console.log("hi")
//   }}formData()
// },[anchors,timeSlots])

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
              className={`time-slot ${slot.selected ? "anchorTime" : ""} ${
                index % 2 === 1 ? "time-gray" : ""
              } ${index === 0 ? "time-first" : ""}
              ${isBetweenAnchors(slot.comparableTime)? "selected" : ""  }`}
              onClick={()=>{
                let newAnchors =[...anchors,slot.comparableTime];
                // newAnchors.sort((a,b)=>a-b)
                slot.selected=true;
                setAnchors(newAnchors)
              console.log(anchors)}}
            />
        </li>
        ))}        
      </ul>
    </div>
  );
}; 

export default TimeSelector; 