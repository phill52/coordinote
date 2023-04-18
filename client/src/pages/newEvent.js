import logo from '../logo.svg';
import '../App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'
import DateTimePicker from 'react-datetime-picker'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';


import Calendar from 'react-calendar'
import { Button } from '@mui/material';



const NewEvent= ()=>{
    const [dates,setDates]=useState([]);
    const [rangedate,setDateRange] =useState([new Date(),new Date()]);
    const [error,setErr]=useState(false);
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
if(error){
    return(<div>
        <p>Error</p>
    </div>);
}
else{
return(<div>
    <div>
    <p>WHY DO I BREAK</p>
    <DateRangePicker value={rangedate} onChange={setDateRange}/>
    <DateTimePicker value={new Date()} />
    </div>
    <br />
    <Button onClick={()=>{
        console.log(rangedate)
        let newDate=[...dates,rangedate];
        setDates(newDate)
        console.log(newDate)
        console.log(dates)
        let inForm= document.getElementById('inputForm')
        inForm.value=newDate.toString();}} 
        >
            Add new date
        </Button>
    <Button onClick={()=>{
        console.log(dates)
    }}>Print dates</Button>
    <form>
        <input type='text' id='inputForm' readOnly required></input>
        <br /> 
        <button type='submit'>Submit</button>
    </form>
        
</div>);
}}
export default NewEvent;