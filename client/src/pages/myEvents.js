import Calendar from 'react-calendar';
import React, {useState, useEffect} from 'react';
import 'react-clock/dist/Clock.css';
import '../App.css';
import logo from '../logo.svg';
import axios from 'axios'
import {createToken } from '../fire';
import {Link, useParams,Navigate} from 'react-router-dom';
import TimeViewer from '../components/TimeViewer';
import {Card,CardMedia,CardContent,CardActionArea,Accordion,AccordionSummary,Typography,Grid} from '@mui/material';

const MyEvents =()=>{
const {uId}=useParams();
const [userEvents,setUserEvents]=useState(null);
const [userAttended,setUserAttended]= useState(null);
const [loading,setLoading] = useState(true);
const [error,setErr]= useState(false);
const [selected,setSelected] = useState(false);
const [createdEvents,userCreated]=useState(false);
const [attendedEvents,pickAttended] = useState(false);
useEffect(()=>{
    console.log('on load useEffect')
    async function formData(){
        try{
        const header=await createToken();
        console.log(header.headers);
        await axios.get(`http://localhost:3001/api/yourpage/events/myEvents/${uId}`,{headers:{'Content-Type':'application/json','Authorization':header.headers.Authorization}})
        .then(function (response){
            console.log(response);
            setLoading(false)
            setErr(false)
            setUserEvents(response.data.events);
            setUserAttended(response.data.attended)
            console.log(response.data)

        })
        .catch(function (error){
            setErr(true);
            setLoading(false)
            console.log(error);
        });
        //setUserEvents(data);
        //console.log(data);

        }
        catch(e){
            setErr(true);
            setLoading(false);
            console.log(e)
        }
    }formData()
},[uId])

const datesEqual = (dte1,dte2) =>{
    if(!(dte1<dte2)){
        if(!(dte1>dte2)){
            return true
        }
    }
    return false;
}
const tileClassBuilder = (date,event)=>{
    for(let x=0;x<event.domainDates.length;x++){
        if(datesEqual(date,new Date(event.domainDates[x].date))){
            return 'workpls';
        }
    }
        return '';
    
}
const cardBuilder =(event) =>{
    return(
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key ={event._id}>
            <Card
            variant = "outlined"
            sx={{
                width: 'auto',
                height: 'auto',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: 5,
                border: '1px solid'
            }}>
               <Link to={`/event/${event._id}`} > 
                <CardMedia sx={{
                  width:"100%",
                  height:"100%"
                }}
                component='img'
                src={"https://www.shutterstock.com/image-vector/flat-calendar-icon-on-wall-260nw-732721924.jpg"}
                title='event image' 
                />
                <CardContent>
                    <Typography
                    sx={{
                        borderBottom: '1px solid #1e8678',
                        fontWeight: 'bold'
                      }}
                      gutterBottom
                      variant='body1'
                      component='div'
                      >
                        <label className='homepageLabel'>
                            Event Name
                        <h1 className='makeBlack'>{event.name}</h1>
                        </label>
                        <label className='homepageLabel'>
                            Event Description
                        <h2 className='makeBlack'>{event.description}</h2>
                        </label>
                        <label className='homepageLabel'>
                            Event Location
                        <p className='makeBlack'>{event.location}</p>
                        </label>
                    </Typography>
                    <Calendar tileDisabled={()=>{return true}} className='smallCal' value = {new Date()} tileClassName={({date})=>{return tileClassBuilder(date,event)}}></Calendar>
                    
                </CardContent>

                </Link>
            </Card>
        </Grid>
    )
}
//<TimeViewer date={new Date(event.domainDates[0].date)} startTime={new Date(event.domainDates[0].time.start)} endTime={new Date(event.domainDates[0].time.end)} attendees={event.attendees}></TimeViewer>
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
            <p>
                Error
            </p>
        </div>
    )
}
else{
    if(createdEvents){
    let card = null;
    card = userEvents && userEvents.map((event)=>{
        return cardBuilder(event);
    })
    return(
        <div>
            
            <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >{card}</Grid>
            <button className='App-link' onClick={()=>{
            userCreated(false)
            pickAttended(true)
        }}>Attended Events</button>
        </div>
    )
}
else if(attendedEvents){
    let card = null;
    card = userAttended && userAttended.map((event)=>{
        return cardBuilder(event);
    })
    return(
        <div>
            
            <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >{card}</Grid>
             <button className='App-link' onClick={()=>{
            userCreated(true)
            pickAttended(false)
        }}>Created Events</button>
        </div>
    )
}
else{
    return(
        <div>
            <h1>
                Do you want to see events that you created, or events that you responded to an invite for?
            </h1>
        <button className='App-link' onClick={()=>{
            userCreated(true)}}>Created Events</button>
        <button className='App-link' onClick={()=>{
            pickAttended(true)
        }}>Invited Events</button>

        </div>
    )
}
}

}

export default MyEvents;