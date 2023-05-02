import React from 'react';

const TimeViewer = ({date, attendees}) => {
  const attendeeCount=attendees.length;

  function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12; //will convert 13 -> 1 ie
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes; //will add 0 before 10 ie 10 -> 010
    return `${hours}:${minutes} ${ampm}`;
  }
  const datesEqual = (dte1,dte2) =>{
    if(!(dte1<dte2)){
        if(!(dte1>dte2)){
            return true
        }
    }
    return false;
  }

  const betweenTimes = (time,startTime,endTime) =>{
    return (time>=startTime && time<=endTime);
  }


  function generateTimeSlots() {
    const slots = [];
    while (startTime <= endTime) {
      const formattedTime = formatAMPM(startTime);
      const insertedStartTime = new Date(startTime);
      let attendeesAvailable=0;
      for(attendee in attendees){
        for (day in attendee.availability){
          let available=false;
          if(datesEqual(day.date,date)){
            for (time in day.times){
              if(betweenTimes(insertedStartTime,time.startTime,time.endTime)){
                available=true;
              }
            }
          }
          if (available) attendeesAvailable++;
      }
      const color = `${}rgb(255, 140, 0, ${attendeesAvailable/attendeeCount})`;
      slots.push({ time: formattedTime, comparableTime: insertedStartTime, color: color});
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    console.log(slots);
    return slots;
  }
  useEffect(()=>{
    async function formData(){
      setAnchors(value);
      console.log(value);
    }formData()
  },[value])
  useEffect(() => { //initialize time slots useEffect
    async function formData(){
    setTimeSlots(generateTimeSlots());
    }formData()
  }, [startTime, endTime]);



  return (
    <div className="time-selector">
      <ul className="time-range">
          {timeSlots.map((slot, index) => (
            <li className="row" key={slot.time}>
            <div className="time-label">{slot.time}</div>
            <div
              className={`time-slot`}
              style={{color:{``}}}
            />
        </li>
        ))}        
      </ul>
    </div>
  );
};

export default TimeViewer;