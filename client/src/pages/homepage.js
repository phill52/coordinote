import '../App.css';
import React, {useState, useEffect} from 'react';
import Calendar from 'react-calendar';
import 'react-clock/dist/Clock.css';

const Homepage = () =>{
    const date1=new Date(2023,4,6,0,0,0,0);
    const date2=new Date(2023,4,7,0,0,0,0);
    const datesEqual = (dte1,dte2) =>{
        if(!(dte1<dte2)){
            if(!(dte1>dte2)){
                return true
            }
        }
        return false;
    }
    function tileClass({date}){
        if((datesEqual(date1,date))||(datesEqual(date2,date))){
            return 'workpls'
        }
        else {
            return ''
        }
        
    }
const disableAll = ({dates}) =>{
    return true;
}
return(
    <div className='centered-container'>
        <h1 className='titleText'>Welcome to Coordinote</h1>
        <h2 className='font-bold text-l dark-green-100 pb-5'>A scheduling platform to plan your events</h2>
        <h2 className='font-bold light-green-100 pb-2.5'>How it works</h2>
        <h3 className='text-center pb-4'>Enter a name, brief description, location, and add an image for your event</h3>
        <div className='login-form'>
            <label className='homepageLabel'>
                {'Event Input: '}
                <p className="homepageInput" >I'm an event name </p>
            </label>
            <label className='homepageLabel'>
                {'Event Description: '}
                <p className="homepageInput">I'm a brief description</p>
            </label>
            <label className='homepageLabel'>
                {'Location Input: '}
                <p className="homepageInput">1255 Hempstead Turnpike</p>
            </label>
            <label className='homepageLabel'>
                {'Event Image: '}
                <p className='homepageInput'>I am an image input</p>
            </label>
        </div>
        <div className='calContain'>
            <h3 className='light-green-200 pb-4'>Pick the possible dates for your event</h3>
            <Calendar minDetail={'month'} value = {new Date(2023,4,1,0,0,0,0)} tileClassName={tileClass} tileDisabled={disableAll}/>
        </div>
    </div>
    )
}
export default Homepage;