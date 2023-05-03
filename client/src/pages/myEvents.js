import Calendar from 'react-calendar';
import React, {useState, useEffect} from 'react';
import 'react-clock/dist/Clock.css';
import '../App.css';
import logo from '../logo.svg';
import axios from 'axios'
import {createToken } from '../fire';
import {Link, useParams} from 'react-router-dom';
import TimeViewer from '../components/TimeViewer';
import {Card,CardMedia,CardContent,CardActionArea,Accordion,AccordionSummary,Typography,Grid} from '@mui/material';

const MyEvents =()=>{
const {uId}=useParams();
const [userEvents,setUserEvents]=useState(null);
const [loading,setLoading] = useState(true);
const [error,setErr]= useState(false);

useEffect(()=>{
    console.log('on load useEffect')
    async function formData(){
        try{
        const header=await createToken();
        console.log(header.headers);
        await axios.get(`http://localhost:3001/api/yourpage/events/myEvents/${uId}`,{headers:{'Content-Type':'application/json','Authorization':header.headers.Authorization}})
        .then(function (response){
            console.log(response);
            setUserEvents(response.data);
            console.log(response.data)

        })
        .catch(function (error){
            console.log(error);
        });
        //setUserEvents(data);
        //console.log(data);
        setLoading(false)
        setErr(false)
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
                    <TimeViewer date={new Date(event.domainDates[0].date)} startTime={new Date(event.domainDates[0].time.start)} endTime={new Date(event.domainDates[0].time.end)} attendees={event.attendees}></TimeViewer>
                </CardContent>

                </Link>
            </Card>
        </Grid>
    )
}
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
            
        </div>
    )
}

}

export default MyEvents;