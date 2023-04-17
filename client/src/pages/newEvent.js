import logo from '../logo.svg';
import '../App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'
import { Button } from '@mui/material';



const NewEvent= ()=>{
    const [dates,setDates]=useState([]);
    const [rangedate,setDateRange] =useState([new Date(),new Date()]);
    const [error,setErr]=useState(false);
/*useEffect(()=>{
    try{
    async function fetchData(){
    //setDateRange(rangedate);
    console.log(dates)
    let newDate=dates.splice();
    newDate=([...dates,rangedate])
    setDates(newDate)
    console.log(dates);
    setErr(false);
    }fetchData();
}
catch(e){
    console.log(e)
    setErr(true);
}
},[dates])*/
if(error){
    return(<div>
        <p>Error</p>
    </div>)
}
else{
/*return (<div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={date} onChange={(newDate)=>setDate(newDate)} />
    </LocalizationProvider>
    <input type='text' id='start'></input>
</div>)*/
return(<div>
    <DateTimeRangePicker onChange={setDateRange} value={rangedate} />
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
        
</div>)
}}
export default NewEvent;