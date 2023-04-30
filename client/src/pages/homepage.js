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
<div>
<h1 className='titleText'>Welcome to Coordinote</h1>
<br />
<br />
<br />
<br />
<h2 className='howItWorks'>How it works</h2>
<br />
<br />
<div className='inputPage'>
    <h3 className='right'>Enter a name, brief description, location, and add an image for your event</h3>
    <div className='Login-page'>
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
    </div>
</div>

<div className='calContain'>
<Calendar value = {new Date(2023,4,1,0,0,0,0)} tileClassName={tileClass} tileDisabled={disableAll}/>
<h3>Pick the dates on which you are avalible</h3>

</div>
</div>
)
}
export default Homepage;