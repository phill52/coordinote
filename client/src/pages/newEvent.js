import logo from '../logo.svg';
import '../App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import DateTimePicker from 'react-datetime-picker'
//import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import TimeSelector from '../components/TimeSelector';
import TimeSelectorTwoAnchors from '../components/TimeSelectorTwoAnchors';
import Calendar from 'react-calendar';
import { Button } from '@mui/material';
import { formatDate } from 'react-calendar/dist/cjs/shared/dateFormatter';



const NewEvent= ()=>{
    const [dates,setDates]=useState(new Date());
    const [rangedate,setDateRange] =useState([new Date(),new Date()]);
    const [error,setErr]=useState(false);
    const [stDate,setStartDate]=useState(new Date());
    const [endDate,setEndDate]=useState(new Date());
    const [Tselect,setTselect]=useState(null);
    const [allDates,setAllDates]= useState([]);
    const [dateLock,SetDateLock] = useState(false);
    const [curDate,setCurDate] = useState(new Date);
    const [curTimes,setCurTimes] = useState({date:new Date(),time:[]})
    const [datesAndTimes,setDatesAndTimes] = useState([]);
    const [clickedDay,setClickedDay] = useState([]);
    const [arrIndex,setArrIndex]=useState(0);
    const [eventName,setEventName] = useState('');
    const [eventDescription,setDescription] = useState('');
    const [nameSet,setNameSet]= useState(false);
    const [descriptionSet,setEventDescription]= useState(false);
    const [location,setLocation] = useState('');
    const [locationSet,locationIsSet] = useState(false);
    const arr={anchors:[]};
    const [firstLoad,setFirstLoad] = useState(true);
    const datesEqual = (dte1,dte2) =>{
        if(!(dte1<dte2)){
            if(!(dte1>dte2)){
                return true
            }
        }
        return false;
    }
    useEffect(()=>{
        console.log(curDate)
        let tempArr=[...clickedDay];
        if(!firstLoad){
        if(arrayIncludes(tempArr,dates)){
            for(let x=0;x<tempArr.length;x++){
                if(datesEqual(tempArr[x],dates)){
                    tempArr.splice(x,1);
                }
            }
            tempArr.sort((a, b) => a - b)
            setClickedDay([...tempArr])
        }
        else{
            tempArr=[...tempArr,dates];
            tempArr.sort((a, b) => a - b)
        setClickedDay([...tempArr]);
        }}
        else{
            setFirstLoad(false)
        }
    },[dates])
    useEffect(()=>{
        async function fetchData(){
            try{
                let index=-1;
                for(let x=0;x<clickedDay.length;x++){
                 if(datesEqual(curDate,clickedDay[x])){
                    index=x;
                 }
                    
                    console.log(clickedDay[x])
                    console.log(curDate)
                }
                let times = [];
                if(((datesAndTimes.length)<=index)||(index===-1)){
                    let curObj = {date:curDate,time:[]};
                    times =[];
                    //setCurTimes(curObj);
                }
                else{
                  //  setCurTimes(datesAndTimes[index])
                  
                    times=datesAndTimes[index].time;
                    console.log(times)
                }
                console.log(index);
                setTselect(<TimeSelectorTwoAnchors startTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 14, 0, 0, 0)} endTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 22, 0, 0, 0)} value = {times} date= {clickedDay[arrIndex]} change={setCurTimes}/>)
                console.log(curTimes)
            }
            catch(e){
                console.log(e);
            }
        }fetchData()
    },[curDate])
    const arrayIncludes = (arr,element) =>{
        for(let x=0;x<arr.length;x++){
          if(datesEqual(arr[x],element)){
            return true;
          }
        }
        return false;
      }
    function tileClass({date}){
        if(arrayIncludes(clickedDay,date)){
            return 'workpls'
        }
        else {
            return ''
        }
        
    }
    useEffect(()=>{
        async function fetchData(){
            try{
                setCurDate(clickedDay[0]);
            }
            catch(e){
                console.log(e);
            }
        }fetchData()
    },[dateLock])
    useEffect(()=>{
        async function fetchData(){
        console.log(curTimes)
        let index=-1;
                for(let x=0;x<clickedDay.length;x++){
                    if(!(clickedDay[x]<curDate)){
                        if(!(clickedDay[x]>curDate)){
                        index=x;
                        }
                    }
                    console.log(clickedDay[x])
                    console.log(curDate)
                }
                let tempArr=[...datesAndTimes];
                tempArr[index]=curTimes;
                setDatesAndTimes(tempArr)
        
        }fetchData()
    },[curTimes])
    useEffect(()=>{
        console.log(datesAndTimes);
    },[datesAndTimes])
/*useEffect(()=>{
    async function fetchData(){
    try{
    
    setDateRange(rangedate);
    console.log(dates)
    let newDate=dates.splice();
    newDate=([...dates,rangedate])
    setDates(newDate)
    console.log(dates);
    setErr(false);
    }
catch(e){
    console.log(e)
    setErr(true);
}}fetchData();
},[dates,rangedate])*/
useEffect(()=>{
    async function fetchData(){
        try{
            setDateRange([stDate,endDate]);
           // console.log(rangedate);
            setErr(false);
        }
        catch(e){
            setErr(true);
        }
    }fetchData();
},[stDate,endDate])
useEffect(()=>{
    async function fetchData(){
        let curr=new Date(rangedate[0]);
        let end=new Date(rangedate[1]);
        let newDates=[];
        try{
            while(curr < end){
                newDates=[...newDates,new Date(curr)];
                curr.setDate(curr.getDate()+1)
                console.log(rangedate[0]);
                console.log(curr)
            }
            setAllDates(newDates);
        }
        catch(e){
            console.log(e);
        }
    }fetchData()
    //console.log(allDates)
},[rangedate])
if(error){
    return(<div>
        <p>Error</p>
    </div>);
}
else{
    if(!nameSet){
        if((eventName!=='')&&(eventDescription!=='')&&(location!=='')){
        return(
            <div>
                <label>
                    {'Event Input: '}
                <input id='eventInput' onChange={(e)=>{setEventName(e.target.value)
                console.log(e)}} placeholder='event name' />
                </label>
                <br />
                <label>
                    {'Event Description: '}
                    <input id='descriptionInput' onChange={(e)=>{setDescription(e.target.value)}} placeholder='Enter Description' />
                </label>
                <br />
                <label>
                    {'Location Input: '}
                    <input id='locationInput' onChange={(e)=>{setLocation(e.target.value)}} placeholder='Enter Location' />
                </label>
                <br />
                <button onClick={()=>{setNameSet(true)
                let inputval=document.getElementById('eventInput');                
                console.log(inputval)}}>Lock Event Info</button>
            </div>
        )}
        else{
            return(
                <div>
                    <label>
                        {'Event Input: '}
                    <input id='eventInput' onChange={(e)=>{setEventName(e.target.value)
                    console.log(e)}} placeholder='event name' />
                    </label>
                    <br />
                    <label>
                        {'Event Description: '}
                        <input id='descriptionInput' onChange={(e)=>{setDescription(e.target.value)}} placeholder='Enter Description' />
                    </label>
                    <br />
                    <label>
                        {'Location Input: '}
                        <input id='locationInput' onChange={(e)=>{setLocation(e.target.value)}} placeholder='Enter Location' />
                    </label>
                    <br />

                </div>
            )
        }
    }
    else{
    if(dateLock){
        let tmpDte=new Date(rangedate[1]);
        tmpDte.setDate(tmpDte.getDate()-1);
        if(arrIndex===0){
return(<div>
    <div>
    <p>{eventName}</p>
    <p>{eventDescription}</p>
    <p>{location}</p>
    <Calendar value = {new Date()} tileClassName={tileClass} ></Calendar>
    {console.log(allDates)}
    </div>
    <br />
    <h1>{clickedDay[arrIndex].toDateString()}</h1>
    <button onClick={
        ()=>{
            setArrIndex(arrIndex+1)
            setCurDate(clickedDay[arrIndex+1])}}>Next</button>
    {Tselect}
    <br />
    {console.log(curDate)}
        
</div>);}
else if(arrIndex===(clickedDay.length-1)){
    return(<div>
        <div>
        <p>{eventName}</p>
        <p>{eventDescription}</p>
        <p>{location}</p>
        <Calendar value = {new Date()} tileClassName={tileClass} ></Calendar>
        {console.log(allDates)}
        </div>
        <br />
        <h1>{clickedDay[arrIndex].toDateString()}</h1>
        <button onClick={
            ()=>{
                setArrIndex(arrIndex-1)
                setCurDate(clickedDay[arrIndex-1])}}>previous</button>
        {Tselect}
        <br />
        {console.log(curDate)}
            
    </div>);
}
else{
    return(<div>
        <div>
        <p>{eventName}</p>
        <p>{eventDescription}</p>
        <p>{location}</p>
        <Calendar value = {new Date()} tileClassName={tileClass} ></Calendar>
        {console.log(allDates)}
        </div>
        <br />
        <h1>{clickedDay[arrIndex].toDateString()}</h1>
        <button onClick={
            ()=>{
                setArrIndex(arrIndex-1)
                setCurDate(clickedDay[arrIndex-1])}}>previous</button>

<button onClick={
        ()=>{
            setArrIndex(arrIndex+1)
            setCurDate(clickedDay[arrIndex+1])}}>Next</button>
        {Tselect}
        <br />
        {console.log(curDate)}
            
    </div>);
}
}
else{
    return(<div>
        <div>
        <p>{eventName}</p>
        <p>{eventDescription}</p>
        <p>{location}</p>
        <Calendar value = {new Date()} onChange={setDates} tileClassName={tileClass} ></Calendar>
        {console.log(clickedDay)}
        </div>
        <br />
        <button onClick={()=>{
            SetDateLock(true)}}> Lock Dates</button>

                    
    </div>);
}}
}}
export default NewEvent;