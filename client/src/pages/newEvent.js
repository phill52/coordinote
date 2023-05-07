import logo from '../logo.svg';
import '../App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import DateTimePicker from 'react-datetime-picker'//import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import TimeSelector from '../components/TimeSelector';
import TimeSelectorTwoAnchors from '../components/TimeSelectorTwoAnchors';
import Calendar from 'react-calendar';
import { Button } from '@mui/material';
import { formatDate } from 'react-calendar/dist/cjs/shared/dateFormatter';
import axios from 'axios'
import {createToken } from '../fire';

const NewEvent= ()=>{
    const [dates,setDates]=useState(new Date());
    const [rangedate,setDateRange] =useState([new Date(),new Date()]);
    const [error,setErr]=useState(false);
    const [stDate,setStartDate]=useState(new Date());
    const [endDate,setEndDate]=useState(new Date());
    const [Tselect,setTselect]=useState(null);
    const [allDates,setAllDates]= useState([]);
    const [dateLock,SetDateLock] = useState(false);
    const [curDate,setCurDate] = useState(new Date());
    const [curTimes,setCurTimes] = useState({date:new Date(),time:[]})
    const [datesAndTimes,setDatesAndTimes] = useState([]);
    const [clickedDay,setClickedDay] = useState([]);
    const [arrIndex,setArrIndex]=useState(0);
    const [eventName,setEventName] = useState('');
    const [eventDescription,setDescription] = useState('');
    const [nameSet,setNameSet]= useState(false);
    const [location,setLocation] = useState('');
    const arr={anchors:[]};
    const [firstLoad,setFirstLoad] = useState(true);
    const [dateTimeLock, lockDateTime] = useState(false);
    const [output,setOutput] = useState({name:'', location:'',domainDates:[],description:'',image:new FormData(),attendees:[]})
    const [fileInput,setFileInput] = useState(new FormData());
    const [fileIsIn, setFileIsIn] = useState(false);
    const [errMsg,setErrMsg] = useState('');
    const [fileUrl,setFileUrl] = useState('');
    const [fileForm,setFileFormValue]=useState(null);
    const [inputTaken,setInputTaken] = useState(false);
    const [lastPageReached,setLastReached] = useState(false);
    const datesEqual = (dte1,dte2) =>{
        if(!(dte1<dte2)){
            if(!(dte1>dte2)){
                return true
            }
        }
        return false;
    }
    useEffect(()=>{
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
                }
                if(datesEqual(new Date(new Date().toDateString()),new Date(curDate.toDateString()))){
                setTselect(<TimeSelectorTwoAnchors className='centered' startTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), new Date().getHours(), 0, 0, 0)} endTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 23, 59, 59, 0)} value = {times} date= {clickedDay[arrIndex]} change={setCurTimes}/>)
                }
                else{
                    setTselect(<TimeSelectorTwoAnchors className='centered' startTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 0, 0, 0, 0)} endTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 23,59, 59, 0)} value = {times} date= {clickedDay[arrIndex]} change={setCurTimes}/>)
                }
            }
            catch(e){
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
            }
        }fetchData()
    },[dateLock])
    useEffect(()=>{
        async function fetchData(){
        let index=-1;
                for(let x=0;x<clickedDay.length;x++){
                    if(!(clickedDay[x]<curDate)){
                        if(!(clickedDay[x]>curDate)){
                        index=x;
                        }
                    }
                }
                let tempArr=[...datesAndTimes];
                tempArr[index]=curTimes;
                setDatesAndTimes(tempArr)
        
        }fetchData()
    },[curTimes])
    useEffect(()=>{
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
const handleSubmit = (event) =>{
    event.preventDefault();
    if((eventName!=='')&&(eventDescription!=='')&&(location!=='')&&(fileIsIn)){
        setErrMsg('');
    setNameSet(true)
    }
    else{
        setErrMsg('Error: all input parameters must be filled out');
    }
}
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
            }
            setAllDates(newDates);
        }
        catch(e){
        }
    }fetchData()
    //console.log(allDates)
},[rangedate])
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
const tileDisabled =({date,view})=>{
    let today=new Date(new Date().toDateString());
    if(view==='month'){
    if(date<today){
        return true;
    }
    else{
        return false;
    }
}
else if(view==='year'){
    if(date<new Date(today.getFullYear(),today.getMonth(),0)){
        return true;
    }
    else{
        return false;
    }
}
else{
    if(date<new Date(today.getFullYear(),0,0)){
        return true;
    }
    else{
        return false;
    }
}
}
const disableAll = ({date,view})=>{
    if(view==='month'){
    return true;
    }
}
useEffect(()=>{
    async function fetchData(){
        if(dateTimeLock){
        let tempObj={...output};
        setOutput({name:eventName,location:location,domainDates:datesAndTimes,description:eventDescription,image:fileInput});
        try{
            let domDates = [];
        for(let x=0;x<datesAndTimes.length;x++){
            domDates=[...domDates,{date:datesAndTimes[x].date,time:{start:datesAndTimes[x].time[0],end:datesAndTimes[x].time[1]}}];
        }
            let oput={name:eventName,location:location,domainDates:domDates,description:eventDescription,image:fileInput,attendees:[]}
            const header=await createToken();
            if(window.location.hostname==='localhost'){
        await axios.post('http://localhost:3001/api/yourpage/events/createEvent',{name:eventName,location:location,domainDates:domDates,description:eventDescription,image:fileUrl,attendees:[]},{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}})
        .then(function (response){
        })
        .catch(function (error){
        });}
        else{
            await axios.post('https://coordinote.us/api/yourpage/events/createEvent',{name:eventName,location:location,domainDates:domDates,description:eventDescription,image:fileUrl,attendees:[]},{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}})
        .then(function (response){
        })
        .catch(function (error){
        });
        }
        }
        catch(e){
        }

    }}fetchData()
},[dateTimeLock])
useEffect(()=>{
async function handleFileInput(){
    if(inputTaken){
    if((document.querySelector('input[type="file"]').files.length!==0)){
const formData = new FormData();
formData.append("image",document.querySelector('input[type="file"]').files[0],document.querySelector('input[type="file"]').files[0].name)
setFileIsIn(true);
const header=await createToken();
try{
    if(window.location.hostname==='localhost'){
await axios.post('http://localhost:3001/api/yourpage/events/imageTest',formData,{headers:{'Content-Type':'multipart/form-data',
authorization:header.headers.Authorization}})
.then(function (response){
    setFileUrl(response.data.imageUrl);
})
.catch(function (error){
});
    }
    else{
        await axios.post('https://coordinote.us/api/yourpage/events/imageTest',formData,{headers:{'Content-Type':'multipart/form-data',
authorization:header.headers.Authorization}})
.then(function (response){
    setFileUrl(response.data.imageUrl);
})
.catch(function (error){
});
    }
}
catch(e){
}
    }
    else{
        setErrMsg("Error, incorrect upload of image");
        setFileIsIn(false);
    }}
    else{
        setErrMsg('');
    }
}handleFileInput()},[fileForm])
if(error){
    return(<div>
        <p>Error</p>
    </div>);
}
else{
    if(dateTimeLock){
        return(
            <div>
                <h1 className='currentDay'>All Done!</h1>
            </div>
        )
    }
    else{
    if(!nameSet){
                return(
            <div className='Login-page'>
                <form className='login-form' onSubmit={handleSubmit}>
                <label className='login-label'>
                    {'Event Name: '}
                <input className="login-input" id='nameInput' onChange={(e)=>{setEventName(e.target.value)
                }} placeholder='event name' required />
                </label>
                <br />
                <label className='login-label'>
                    {'Event Description: '}
                    <input className="login-input" id='descriptionInput' onChange={(e)=>{setDescription(e.target.value)}} placeholder='Enter Description' required />
                </label>
                <br />
                <label className='login-label'>
                    {'Location Input: '}
                    <input className="login-input" id='locationInput' onChange={(e)=>{setLocation(e.target.value)}} placeholder='Enter Location' required/>
                </label>
                <br />
                <label className='login-label'>
                        {'Event Image: '}
                        <input type='file' accept='image/png, image/jpeg, image/jpg' required className='login-input' id='imageInput' onChange={(e)=>{
                            setInputTaken(true)
                            setFileFormValue(e)}} />
                    </label>
                    <br />
                <div className='flex justify-center'>
                <button type='submit' onClick={handleSubmit}>Lock Event Info</button>
                </div>
                </form>
                <p>{errMsg}</p>
            </div>
        )
        
    }
    else{
    if(dateLock){
        if(clickedDay.length===1&&!lastPageReached){
            setLastReached(true)
        }

        let tmpDte=new Date(rangedate[1]);
        tmpDte.setDate(tmpDte.getDate()-1);
            return(
                    <div>
                        <div>
                        <div className='postit-note'>
                            <h2 className='light-green-100'>Event Name</h2>
                            <p>{eventName}</p>
                            <h2 className='light-green-100'>Event Description</h2>
                            <p>{eventDescription}</p>
                            <h2 className='light-green-100'>Event Location</h2>
                            <p>{location}</p>
                        </div>
                                <Calendar minDetail={'decade'} tileDisabled={disableAll} className='smallCal' value = {new Date()} tileClassName={tileClass} ></Calendar>
                            </div>
                            <br />
                            <h1 className='currentDay'>{clickedDay[arrIndex].toDateString()}</h1>
                            <div className="button-date-container">
                                <button
                                    className="button-left"
                                    onClick={() => {
                                        setArrIndex(arrIndex - 1);
                                        setCurDate(clickedDay[arrIndex - 1]);
                                    }}
                                    disabled={arrIndex === 0} // Disable the button if arrIndex is 0
                                >
                                    &#9664; {/* Left triangle */}
                                </button>
                                <h1 className="currentDay">{clickedDay[arrIndex].toLocaleDateString("en-US")}</h1>
                                <button
                                className="button-right"
                                onClick={() => {
                                    if(arrIndex===(clickedDay.length-2)){
                                        setLastReached(true);
                                    }
                                }}
                                disabled={arrIndex === (clickedDay.length-1)} // Disable the button if arrIndex is the last element
                                >
                                &#9654; {/* Right triangle */}
                                </button>
                            </div>
                            {console.log("is last page reached?",lastPageReached) }
                            {Tselect}
                            <br />
                            <br />
                            {lastPageReached && (
                                <form action="">
                                <button onClick={() => { lockDateTime(true) }}>Lock dates and times</button>
                                </form>
                            )}
                            <br />
                            </div>
                    );
}
else{
    if(clickedDay.length>0){
    return(<div>
        <div className='postit-note'>
            <h2 className='light-green-100'>Event Name</h2>
            <p>{eventName}</p>
            <h2 className='light-green-100'>Event Description</h2>
            <p>{eventDescription}</p>
            <h2 className='light-green-100'>Event Location</h2>
            <p>{location}</p>
        </div>
        <div>
        <Calendar minDetail={'decade'} className='smallCal' tileDisabled={tileDisabled} value = {new Date()} onChange={setDates} tileClassName={tileClass} ></Calendar>
        </div>
        
        <br />
        <button onClick={()=>{
            SetDateLock(true)}}> Lock Dates</button>

                    
    </div>);
}
else{
    return(<div>
        <div>
        <div className='postit-note'>
            <h2 className='light-green-100'>Event Name</h2>
            <p>{eventName}</p>
            <h2 className='light-green-100'>Event Description</h2>
            <p>{eventDescription}</p>
            <h2 className='light-green-100'>Event Location</h2>
            <p>{location}</p>
        </div>
        <div>
        <Calendar minDetail={'decade'} className='smallCal' tileDisabled={tileDisabled} value = {new Date()} onChange={setDates} tileClassName={tileClass} ></Calendar>
        </div>
        </div>
        <br />
        

                    
    </div>);
}
}}}
}}
export default NewEvent;