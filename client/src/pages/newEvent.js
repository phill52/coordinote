import logo from '../logo.svg';
import '../App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import DateTimePicker from 'react-datetime-picker'
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import TimeSelector from '../components/TimeSelector';
import Calendar from 'react-calendar';
import { Button } from '@mui/material';



const NewEvent= ()=>{
    const [dates,setDates]=useState([]);
    const [rangedate,setDateRange] =useState([new Date(),new Date()]);
    const [error,setErr]=useState(false);
    const [stDate,setStartDate]=useState(new Date());
    const [endDate,setEndDate]=useState(new Date());
    const [Tselect,setTselect]=useState(null);
    const [allDates,setAllDates]= useState([]);
    const [dateLock,SetDateLock] = useState(false);
    const [curDate,setCurDate] = useState(new Date);
    const [curTimes,setCurTimes] = useState({date:new Date(),time:[]})
    const arr={anchors:[]};
    useEffect(()=>{
        async function fetchData(){
            try{
                setTselect(<TimeSelector startTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 14, 0, 0, 0)} endTime={new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 22, 0, 0, 0)} value = {curTimes.time} date= {curDate} change={setCurTimes}/>)
                console.log(curTimes)
            }
            catch(e){
                console.log(e);
            }
        }fetchData()
    },[curDate])
    useEffect(()=>{
        async function fetchData(){
            try{
                setCurDate(rangedate[0]);
            }
            catch(e){
                console.log(e);
            }
        }fetchData()
    },[dateLock])
    useEffect(()=>{
        console.log(curTimes)
    },[curTimes])
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
    if(dateLock){
        let tmpDte=new Date(rangedate[1]);
        tmpDte.setDate(tmpDte.getDate()-1);
        if(curDate<=rangedate[0]){
return(<div>
    <div>
    <p>WHY DO I BREAK</p>
    <Calendar selectRange={true} value={rangedate} onChange={setDateRange}></Calendar>
    {console.log(allDates)}
    </div>
    <br />
    <button onClick={
        ()=>{
            let tempDate=new Date(curDate)
            tempDate.setDate(tempDate.getDate()+1);
            console.log(tempDate)
            setCurDate(tempDate)}}>Next</button>
    {Tselect}
    <br />
    {console.log(curDate)}
        
</div>);}
else if(curDate<tmpDte){
    return(<div>
        <div>
        <p>WHY DO I BREAK</p>
        <Calendar selectRange={true} value={rangedate} onChange={setDateRange}></Calendar>
        {console.log(allDates)}
        </div>
        <br />
        <button onClick={
            ()=>{
                let tempDate=new Date(curDate)
                tempDate.setDate(tempDate.getDate()-1);
                console.log(tempDate)
                setCurDate(tempDate)}}>Previous</button>

        <button onClick={
            ()=>{
                let tempDate=new Date(curDate)
                tempDate.setDate(tempDate.getDate()+1);
    
                setCurDate(tempDate)}}>Next</button>
        {Tselect}
        <br />
        {console.log(curDate)}
            
    </div>);
}
else{
    return(<div>
        <div>
        <p>WHY DO I BREAK</p>
        <Calendar selectRange={true} value={rangedate} onChange={setDateRange}></Calendar>
        {console.log(allDates)}
        </div>
        <br />
        <button onClick={
            ()=>{
                let tempDate=new Date(curDate)
                tempDate.setDate(tempDate.getDate()-1);
                console.log(tempDate)
                setCurDate(tempDate)}}>previous</button>
        {Tselect}
        <br />
        {console.log(curDate)}
            
    </div>);
}
}
else{
    return(<div>
        <div>
        <p>WHY DO I BREAK</p>
        <Calendar selectRange={true} value={rangedate} onChange={setDateRange}></Calendar>
        {console.log(allDates)}
        </div>
        <br />
        <button onClick={()=>{SetDateLock(true)}}> Lock Dates</button>

                    
    </div>);
}
}}
export default NewEvent;