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
const [loading,setLoading] = useState(true);
const [error,setError]= useState(false);
const [output, setOutput] = useState({domainDates:[]});
const [tSelect,setTSelect]= useState(null);
const [datesAndTimes,setDatesAndTimes] = useState([]);
const [arrIndex,setArrIndex] = useState(0);
const [curTimes,setCurTimes] = useState({date:new Date(),time:[]});
useEffect(()=>{
    async function formData(){
        try{
        let {data}=await axios.get(`http://localhost:3001/api/yourpage/events/${id}`);
        console.log(data)
        setEventData(data);
        setLoading(false)
        setError(false)
        setCurDate(new Date(data.domainDates[0].date))
        let temparr=[];
        for(let x=0;x<data.domainDates.length;x++){
            temparr=[...temparr,{date:new Date(data.domainDates[x].date),time:[]}]
        }
        setDatesAndTimes(temparr);


        }
        catch(e){
            setLoading(false)
            setError(true)
            console.log(e);
        }
    }formData()
},[id])

useEffect(()=>{
    async function formData(){
        let times;
        if(datesAndTimes[arrIndex].time.length===0){
            times=[];
        }
        else{
            times=datesAndTimes[arrIndex].time;
        }
        setTSelect(<TimeSelector className='centered' value={times} startTime={new Date(eventData.domainDates[arrIndex].time[0])} endTime={new Date(eventData.domainDates[arrIndex].time[1])} date={curDate} change={setCurTimes} />)
    }formData()
},[curDate,eventData])

useEffect(()=>{
    async function formData(){
        let tempArr=[...datesAndTimes];
        tempArr[arrIndex]=curTimes;
        setDatesAndTimes(tempArr);
    }formData()
},[curTimes])
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
    
        if(datesEqual(curDate,date)){

            return 'workpls'
        }
        else{
            return ''
        }
    
}
const disableDates = ({date})=>{
    for(let x=0;x<eventData.domainDates.length;x++){
        if(!datesEqual(new Date(eventData.domainDates[x].date),date)){
            return true
        }
    }
    return false
}
if(loading){
    return(
        <div>
            <p>
                Loading
            </p>
        </div>
    )
}
else{
    if(eventData.domainDates.length===1){
return(
    <div>
         <Calendar className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         {console.log(curDate)}
         {tSelect}
    </div>
)
}
else{
    if(arrIndex===0){
        return(
    <div>

         <Calendar className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         {console.log(curDate)}
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))
        }}>Next</button>
         {console.log(curDate)}
         {tSelect}
    </div>)
    }
    else if((arrIndex+1)===eventData.domainDates.length){
        return(
            <div>
        
         <Calendar className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex-1)
        setCurDate(new Date(eventData.domainDates[arrIndex-1].date))
        }}>Previous</button>
         {console.log(curDate)}
         {tSelect}
    </div>
        )
    }
    else{
        return(
            <div>
        
         <Calendar className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex-1)
        setCurDate(new Date(eventData.domainDates[arrIndex-1].date))
        }}>Previous</button>
        <button onClick={()=>{setArrIndex(arrIndex+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))}}>Next</button>
         {console.log(curDate)}
         {tSelect}
    </div>
        )
    }
}
}
}
export default ResponseToInvite;