import React,{useEffect,useState} from 'react';

const TimeViewer = (props) => {
  const {startTime,endTime,date,attendees} = props;
  const attendeeCount=attendees.length;
  const [timeSlots, setTimeSlots] = useState([]);
  //console.log(date)
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

    return ((time>=startTime) && (time<=endTime));
  }


  function generateTimeSlots() {
    const slots = [];
   // console.log('im in the generate function')
    while (startTime <= endTime) {
     // console.log('im in the loop')
     console.log(startTime)
      const formattedTime = formatAMPM(startTime);
      const insertedStartTime = new Date(startTime);
      let attendeesAvailable=0;
      for(let indx in attendees){
        let attendee=attendees[indx]
        //console.log(attendee)
        for (let day of attendee.availability){
          let available=false;
          //console.log(day.date)
          if(datesEqual(new Date(day.date),date)){
            for (let time of day.time){
            //  console.log(time)
              if(betweenTimes(insertedStartTime,new Date(time.start),new Date(time.end))){
                available=true;
                //console.log('hi')
              }
            }
          }
          if (available){
             attendeesAvailable++;
            // console.log('i should work');
          }
      }}

      const color = `rgb(255, 140, 0, ${attendeesAvailable/attendeeCount})`;
      slots.push({ time: formattedTime, comparableTime: insertedStartTime, attendeesAvailable: attendeesAvailable});
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



  return (

    <div className="time-selector">
      <ul className="time-range">
          {timeSlots.map((slot, index) => { 
            let color = `rgb(255, 140, 0, ${slot.attendeesAvailable/attendeeCount})`;
            if((slot.attendeesAvailable/attendeeCount)===1){
              color='rgb(124,252,0)'
            }
            if(slot.attendeesAvailable===0){
              return (
                <li className="row" key={slot.time}>
                <div className="time-label">{slot.time}</div>
                <div
                  className={`time-slot`}
                />
            </li>
            )
            }
            else{
            return (
            <li className="row" key={slot.time}>
            <div className="time-label">{slot.time}</div>
            <div
              className={`time-slot`}
              style={{"backgroundColor":color}}
            />
        </li>
        )}})}        
      </ul>
    </div>
  );
};

export default TimeViewer;