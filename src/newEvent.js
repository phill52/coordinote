import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';



const NewEvent= ()=>{
    const [date,setDate]=useState(dayjs('2023-04-03'));
useEffect(()=>{
    async function fetchData(){
    console.log(date);
    setDate(date)
    }fetchData();
},[date])
return (<div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={date} onChange={(newDate)=>setDate(newDate)} />
    </LocalizationProvider>
</div>)
}
export default NewEvent;