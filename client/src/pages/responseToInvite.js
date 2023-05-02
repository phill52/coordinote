import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import TimeSelector from '../components/TimeSelector';
import React, {useState, useEffect} from 'react';
import Calendar from 'react-calendar';
import axios from 'axios'
import {Link, useParams} from 'react-router-dom';


const ResponseToInvite = (props) => {
    const {id} = useParams(); 

    const uid='6449858e039651db9d8beed4';
const [eventData,setEventData]=useState(null);
const [curDate,setCurDate] = useState(new Date());
const [loading,setLoading] = useState(true);
const [error,setError]= useState(false);
const [output, setOutput] = useState({eventId:'',attendeeId:'',domainDates:[]});
const [tSelect,setTSelect]= useState(null);
const [datesAndTimes,setDatesAndTimes] = useState([]);
const [arrIndex,setArrIndex] = useState(0);
const [curTimes,setCurTimes] = useState({date:new Date(),time:[]});
const [finish,setFinished] = useState(false);
const [daysSet,setDaysSet] = useState(0);
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
        setTSelect(<TimeSelector className='centered' value={[]} startTime={new Date(data.domainDates[0].time["start"])} endTime={new Date(data.domainDates[0].time["end"])} date={new Date(data.domainDates[0].date)} change={setCurTimes} />)
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
        if(!error){
        let times;
        if(datesAndTimes[arrIndex].time.length===0){
            times=[];
        }
        else{
            times=datesAndTimes[arrIndex].time;
        }
        setTSelect(<TimeSelector className='centered' value={times} startTime={new Date(eventData.domainDates[arrIndex].time["start"])} endTime={new Date(eventData.domainDates[arrIndex].time["end"])} date={curDate} change={setCurTimes} />)
    }
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
const buildAnchorObjectArray = (arr) =>{
    let outArr=[];
    if(arr.length===0){
        return [];
    }
    else{
        let y=0;
        for(let x=0;x<arr.length;x=x+2){
            outArr[y]={start:arr[x],end:arr[x+1]};
            y++;
        }
        return outArr;
    }
}
useEffect(()=>{
    async function formData(){
        if(finish){
        let availability = [];
        for(let x=0;x<datesAndTimes.length;x++){
            availability=[...availability,{date:datesAndTimes[x].date,time:buildAnchorObjectArray(datesAndTimes[x].time)}];
        }
        console.log(availability);
        let oput={eventId:id,attendee:{_id:uid,availability:availability}};
        //change the attendee id to uid later 
        console.log(oput)
        try{
            await axios.post('http://localhost:3001/api/api/updateAvailability',oput)
            .then(function (response){
                console.log(response);
            })
            .catch(function (error){
                console.log(error);
            });
            }
            catch(e){
                console.log(e);
            }
        console.log(datesAndTimes);
    }
}formData()
},[finish])
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
else if(error){
    return(
        <div>
            <p>Error: Invalid event ID</p>
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
         <button onClick={()=>{setFinished(true)}}>Done</button>
    </div>
)
}
else{
    if(daysSet<(eventData.domainDates.length)){
    if(arrIndex===0){
        return(
    <div>

         <Calendar className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         {console.log(curDate)}
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))
        setDaysSet(daysSet+1)
        }}>Next</button>
         {console.log(curDate.toLocaleString("en-US", {timeZone: "America/New_York"}).split('T'))}
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
         <button onClick={()=>{setFinished(true)}}>Done</button>
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
                setDaysSet(daysSet+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))}}>Next</button>
         {console.log(curDate)}
         {tSelect}
         <button onClick={()=>{setFinished(true)}}>Done</button>
    </div>
        )
    }
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
         <button onClick={()=>{setFinished(true)}}>Done</button>
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
         <button onClick={()=>{setFinished(true)}}>Done</button>
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
         <button onClick={()=>{setFinished(true)}}>Done</button>
    </div>
        )
    }
}
}
}
}
export default ResponseToInvite;