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
    useEffect(()=>{
        async function fetchData(){
            try{
                setTselect(<TimeSelector startTime={new Date(2023, 4, 15, 14, 0, 0, 0)} endTime={new Date(2023, 4, 15, 22, 0, 0, 0)}/>)
            }
            catch(e){
                console.log(e);
            }
        }fetchData()
    },[])
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
return(<div>
    <div>
    <p>WHY DO I BREAK</p>
    <DateTimePicker value={stDate} onChange={setStartDate} />
    <DateTimePicker value={endDate} onChange={setEndDate} />
    <Calendar selectRange={true} value={rangedate} onChange={setDateRange}></Calendar>
    {console.log(allDates)}
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
    {Tselect}
    <br />
    <TimeSelector startTime={new Date(2023, 4, 15, 14, 0, 0, 0)} endTime={new Date(2023, 4, 15, 22, 0, 0, 0)}/>
        
</div>);
}}
export default NewEvent;