import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import TimeSelector from '../components/TimeSelector';
import React, {useState, useEffect} from 'react';
import Calendar from 'react-calendar';
import axios from 'axios'
import {Link, useParams} from 'react-router-dom';


const ResponseToInvite = () => {
    let {id} = useParams(); 
const [eventData,setEventData]=useState(null);
const [curDate,setCurDate] = useState(new Date());


useEffect(()=>{
    async function formData(){
        try{
        let data=await axios.get(`http://localhost:3001/api/yourpage/events/${id}`);
        console.log(data)
        setEventData(data);
        }
        catch(e){
            console.log(e);
        }
    }formData()
},[id])
console.log(eventData)
const arrayIncludes = (arr,element) =>{
    for(let x=0;x<arr.length;x++){
      if(datesEqual(arr[x],element)){
        return true;
      }
    }
    return false;
  }
  const datesEqual = (dte1,dte2) =>{
    if(!(dte1<dte2)){
        if(!(dte1>dte2)){
            return true
        }
    }
    return false;
}

const setClass = ({date})=>{
    for(let x=0;x<eventData.domainDates.length;x++){
        if(datesEqual(eventData.domainDates[x].date,date)){
            return 'workpls'
        }
        else{
            return ''
        }
    }
}
const disableDates = ({date})=>{
    for(let x=0;x<eventData.domainDates.length;x++){
        if(datesEqual(eventData.domainDates[x].date,date)){
            return false
        }
        else{
            return true
        }
    }
}
return(
    <div>
         <Calendar className='smallCal' value = {new Date()} onChange={setCurDate} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
    </div>
)
}
export default ResponseToInvite;