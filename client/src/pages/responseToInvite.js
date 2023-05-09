import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import TimeSelector from '../components/TimeSelector';
import React, {useState, useRef, useEffect, useContext} from 'react';
import Calendar from 'react-calendar';
import axios from 'axios'
import {Link, useParams,useNavigate} from 'react-router-dom';
import {auth, createToken } from '../fire';
import TimeViewer from '../components/TimeViewer';
import {Card,CardHeader,CardMedia,CardContent,CardActionArea,Accordion,AccordionSummary,Typography,Grid, unstable_createMuiStrictModeTheme} from '@mui/material';
import io from 'socket.io-client';
import Chat from '../components/chat';
import AuthContext from '../AuthContext';


const ResponseToInvite = (props) => {
    const {selecting} = props;
    const {id} = useParams(); 
    let card=null;
    // const uid='6449858e039651db9d8beed2';
const [uid, setUid]=useState('');
const [eventData,setEventData]=useState(null);
const [curDate,setCurDate] = useState(new Date());
const [loading,setLoading] = useState(true);
const [error,setError]= useState(false);
const [output, setOutput] = useState({eventId:'',attendeeId:'',domainDates:[]});
const [tSelect,setTSelect]= useState(null);
const [datesAndTimes,setDatesAndTimes] = useState([]);
const [arrIndex,setArrIndex] = useState(0);
const [curTimes,setCurTimes] = useState({date:new Date(),time:[]});
const [finish,setFinished] = useState(false);
const [daysSet,setDaysSet] = useState(0);
const [pickDates,setPickDates] = useState(false);
const [viewEventPage,setViewEventPage] = useState(false);
const [makeDoneButtonAppear,setDoneButtonAppears]=useState(false);
const [eventPgGrid,setEventPgGrid] = useState(null);
const [totalConflicts,setTotalConflicts]=useState([]);
const [bestDates,setBestDates]=useState([]);
const [deleteTheEventWarn,setDeleteWarn]=useState(false);
const [deleteConfirm,setDeleteConfirm]=useState(false);
const [deleteMsg,setDeleteMsg] = useState('');
const [errMsg,setErrMsg] = useState('');
const [reloadIt,setReloadIt]= useState(false);
const [chatOption,setChatOption] = useState(false);
const [availableAttendees, setAvailableAttendees] = useState([]);
const [unavailableAttendees, setUnavailableAttendees] = useState([]);
const [eventDataForm, setEventDataForm] = useState()


const {mongoUser, loadingMongo} = useContext(AuthContext);

useEffect(()=>{
    // console.log('hello')
    if (mongoUser) {
        setUid(mongoUser._id);
        // console.log('hello')
    } 
}, [mongoUser])

// console.log(mongoUser)


const nav=useNavigate();
useEffect(()=>{
    async function formData(){
        try{
            const header=await createToken();
            // console.log(header)
            let data ={};
        if(window.location.hostname==='localhost'){
        let response=await axios.get(`http://localhost:3001/api/yourpage/events/${id}`,{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}});
        data=response.data;
        }
        else{
            let response = await axios.get(`https://coordinote.us/api/yourpage/events/${id}`,{headers:{'Content-Type':'application/json',
            authorization:header.headers.Authorization}});
            data=response.data
        }
        // console.log(data)
        setEventData(data);
        setLoading(false)
        setError(false)
        setCurDate(new Date(data.domainDates[0].date))
        setEventPgGrid(
            <Grid
                container
                spacing={2}
                sx={{
                  flexGrow: 1,
                  flexDirection: 'row'
                }}>
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
                        <h1 className='makeBlack'>{data.name}</h1>
                        </label>
                        <label className='homepageLabel'>
                            Event Description
                        <h2 className='makeBlack'>{data.description}</h2>
                        </label>
                        <label className='homepageLabel'>
                            Event Location
                        <p className='makeBlack'>{data.location}</p>
                        </label>
                    </Typography>
    {data.domainDates.map((event)=>{
        // console.log(event);

        return (
            <Grid sx={{backgroundColor:'none'}} item xs={12} sm={7} md={5} lg={4} xl={3} key ={event.date.start}>

                            <TimeViewer date={new Date(event.date)} startTime={new Date(event.time.start)} endTime={new Date(event.time.end)} attendees={data.attendees} ></TimeViewer>
            </Grid>
            )
    })}
    </Grid>
        )
        let temparr=[];
        for(let x=0;x<data.domainDates.length;x++){
            temparr=[...temparr,{date:new Date(data.domainDates[x].date),time:[]}]
        }
        setTSelect(<TimeSelector className='centered' value={[]} startTime={new Date(data.domainDates[0].time["start"])} endTime={new Date(data.domainDates[0].time["end"])} date={new Date(data.domainDates[0].date)} change={setCurTimes} />)
        setDatesAndTimes(temparr);


        }
        catch(e){
            setLoading(false)
            setError(true)
            console.log(e);
        }
    }formData()
},[id])
async function bestDatesRequest(){
    try{
        let header= await createToken();
        let data={};
        if(window.location.hostname==='localhost'){
    let response=await axios.get(`http://localhost:3001/api/yourpage/events/bestTimes/${id}`,{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}});
        data=response.data;
    }
    else{
        let response=await axios.get(`https://coordinote.us/api/yourpage/events/bestTimes/${id}`,{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}});
        data=response.data;
    }

        setBestDates(data);
        // console.log(data);
        setError(false)
        }
        catch(e){
            console.log(e);
            setError(true);
        }
}
async function getTimesRequest(){
    try{
        let header= await createToken();
        let data={};
        if(window.location.hostname==='localhost'){
    let response=await axios.get(`http://localhost:3001/api/yourpage/events/${id}`,{headers:{'Content-Type':'application/json',
    authorization:header.headers.Authorization}});
    data=response.data;
        }
        else{
            let response=await axios.get(`https://coordinote.us/api/yourpage/events/${id}`,{headers:{'Content-Type':'application/json',
    authorization:header.headers.Authorization}});
    data=response.data;
        }
    // console.log(data)
    setEventData(data);
    setCurDate(new Date(data.domainDates[0].date))
    setError(false)
    }
    catch(e){
        console.log(e)
        setError(true);
    }
}

useEffect(()=>{
    async function formData(){
        if(reloadIt){
            try{
            getTimesRequest();
            bestDatesRequest();
            setReloadIt(false);
            setError(false);
            }
            catch(e){
                setError(true);
                console.log(e)
            }
        }
    }formData()
},[reloadIt])

useEffect(()=>{
    async function formData(){
        try{
            let data=[];
        const header=await createToken();
        if(window.location.hostname==='localhost'){
        let response=await axios.get(`http://localhost:3001/api/yourpage/events/bestTimes/${id}`,{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}});
            data=response.data;
    }
    else{
        let response=await axios.get(`https://coordinote.us/api/yourpage/events/bestTimes/${id}`,{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}});
            data=response.data;
    }
        setBestDates(data);
        // console.log(data);
        }
        catch(e){
            console.log(e);
        }
    }formData()
},[id])
useEffect(()=>{
    async function formData(){
        if(!error){
        let times;
        if(datesAndTimes && datesAndTimes[arrIndex] && datesAndTimes[arrIndex].time.length===0){
            times=[];
        }
        else{
            times=datesAndTimes[arrIndex].time;
        }
        setEventPgGrid(
            <Grid
                container
                spacing={2}
                sx={{
                  flexGrow: 1,
                  flexDirection: 'row'
                }}>
    {eventData.domainDates.map((event)=>{
        // console.log(event);
        return (
            <Grid sx={{backgroundColor:'none'}} item xs={12} sm={7} md={5} lg={4} xl={3} key ={event.date.end}>
            <Card sx={{backgroundColor:'white'}}>
                
        
                
                <CardContent>
                <Typography sx={{height:'100%',width:'100%',backgroundColor:'white'}} component={'div'} variant='body1'>
                    <h1>{new Date(event.date).toDateString()}</h1>
                </Typography>
            <TimeViewer date={new Date(event.date)} startTime={new Date(event.time.start)} endTime={new Date(event.time.end)} attendees={eventData.attendees} ></TimeViewer>
            </CardContent>
            </Card>
            </Grid>
            )
    })}
    </Grid>
        )
        setTSelect(<TimeSelector className='centered' value={times} startTime={new Date(eventData.domainDates[arrIndex].time["start"])} endTime={new Date(eventData.domainDates[arrIndex].time["end"])} date={curDate} change={setCurTimes} />)
    }
    }formData()
},[curDate,eventData,selecting])

useEffect(()=>{
    async function formData(){
        if(deleteTheEventWarn){
            setDeleteMsg('Are you sure that you want to delete the event?')
        }
        else{
            setDeleteMsg('');
        }
    }formData()
},[deleteTheEventWarn])

useEffect(()=>{
    async function formData(){
        if(deleteConfirm){
            let header = await createToken();
            let oput = {userId:uid};
            if(window.location.hostname==='localhost'){
            await axios.delete(`http://localhost:3001/api/yourpage/events/${id}`,{headers:{'Content-Type':'application/json',
            authorization:header.headers.Authorization}})

            .then(function (response){
                // console.log(response);
                if(response && response.data && response.data.deleted==true){
                    alert(`Event '${eventData.name}' deleted successfully!`)
                }
                nav('/',{replace:true})

            })
            .catch(function (error){
                console.log(error);
            });
        }
        else{
            await axios.delete(`https://coordinote.us/api/yourpage/events/${id}`,{headers:{'Content-Type':'application/json',
            authorization:header.headers.Authorization}})

            .then(function (response){
                // console.log(response);
                if(response && response.data && response.data.deleted==true){
                    alert(`Event '${eventData.name}' deleted successfully!`)
                }
                nav('/',{replace:true})

            })
            .catch(function (error){
                console.log(error);
            });
        }
   
        }
    }formData()
},[deleteConfirm])

useEffect(()=>{
    async function formData(){
        let tempArr=[...datesAndTimes];
        tempArr[arrIndex]=curTimes;
        setDatesAndTimes(tempArr);
    }formData()
},[curTimes])
// console.log(eventData)
const arrayIncludes = (arr,element) =>{
    for(let x=0;x<arr.length;x++){
      if(datesEqual(arr[x],element)){
        return true;
      }
    }
    return false;
  }
  const datesEqual = (dte1,dte2) =>{
    if(!(dte1<dte2)){
        if(!(dte1>dte2)){
            return true
        }
    }
    return false;
}
const buildAnchorObjectArray = (arr) =>{
    let outArr=[];
    if(arr.length===0){
        setErrMsg('');
        return [];
    }
    else if(arr.length%2!==0){
        setErrMsg('Error, an even number of anchor points must be picked for each date, as each range must have an open and close.');
        throw "Error: Not enough "
    }
    else{
        setErrMsg('');
        let y=0;
        for(let x=0;x<arr.length;x=x+2){
            outArr[y]={start:arr[x],end:arr[x+1]};
            y++;
        }
        return outArr;
    }
}
useEffect(()=>{
    async function formData(){
        let goHere=true;
        if(finish){
        let availability = [];
        try{
        for(let x=0;x<datesAndTimes.length;x++){
            availability=[...availability,{date:datesAndTimes[x].date,time:buildAnchorObjectArray(datesAndTimes[x].time)}];
        }
    }
    catch(e){
        goHere=false;
        setFinished(false);
        console.log(e);


    }
        // console.log(availability);
        let oput={eventId:id,attendee:{_id:uid,availability:availability}};
        //change the attendee id to uid later 
        // console.log(oput)
        if(goHere){
        try{
            const header=await createToken();
            // console.log(header);
            if(window.location.hostname==='localhost'){
            await axios.post('http://localhost:3001/api/updateAvailability',oput,{headers:{'Content-Type':'application/json',
            authorization:header.headers.Authorization}})
            .then(function (response){
                // console.log(response);
                setReloadIt(true);
                setPickDates(false);
                setFinished(false);
                nav(`/event/${id}`);
                // console.log(datesAndTimes);
            })
            .catch(function (error){
                console.log(error);
                setPickDates(true);
                setFinished(false);
            });
        }
        else{
            await axios.post('https://coordinote.us/api/updateAvailability',oput,{headers:{'Content-Type':'application/json',
            authorization:header.headers.Authorization}})
            .then(function (response){
                // console.log(response);
                setReloadIt(true);
                setPickDates(false);
                setFinished(false);
                nav(`/event/${id}`);
                // console.log(datesAndTimes);
            })
            .catch(function (error){
                console.log(error);
                setPickDates(true);
                setFinished(false);
            });
        }
            }
            catch(e){

                console.log(e);
            }}

    }
}formData()
},[finish])


if (loadingMongo) {
    return (
        <div>
            <p>
                Loading
            </p>
        </div>
    )
} 

const tileClassBuilder = (date,event)=>{
    for(let x=0;x<event.domainDates.length;x++){
        for(let y=0;y<bestDates.length;y++){
        //    console.log(new Date(bestDates[y]))
            let dateObj=new Date(bestDates[y]);
        if(datesEqual(date,new Date(dateObj.getFullYear(),dateObj.getMonth(),dateObj.getDate(),0,0,0,0))){
            
            return 'imTheBest'
        }}
        if(datesEqual(date,new Date(event.domainDates[x].date))){
            return 'workpls';
        }
    }
        return '';
    
}
const setClass = ({date})=>{
    
        if(datesEqual(curDate,date)){

            return 'workpls'
        }
        else{
            return ''
        }
    
}
const disableDates = ({date})=>{
    for(let x=0;x<eventData.domainDates.length;x++){
        if(!datesEqual(new Date(eventData.domainDates[x].date),date)){
            return true
        }
    }
    return false
}
const onUpdateEvent = async(e) => {
    e.preventDefault()
    let newName=document.getElementById('newName').value.trim()
    let newDescription=document.getElementById('newDescription').value.trim()
    let newLocation=document.getElementById('newLocation').value.trim()
    let url;
    if(window.location.hostname==='localhost'){
        url=`http://localhost:3001/api/yourpage/events/${eventData._id}`
    }
    else{
        url=`http://coordionote.us/api/yourpage/events/${eventData._id}`
    }
    try{
        const header=await createToken();
        await axios.patch(url,{name:newName,location:newLocation,description:newDescription,userId:uid},{headers:{'Content-Type':'application/json',
        authorization:header.headers.Authorization}})
        .then(function (response){
            // console.log("response:",response);
            setReloadIt(true);
            setPickDates(false);
            setFinished(false);
            nav(`/event/${id}`);
            // console.log(datesAndTimes);
        })
        .catch(function (error){
            console.log(error);
            setPickDates(true);
            setFinished(false);
        });
    }
    catch(e){
        console.log(e)
    }
    document.getElementById('newName').value=''
    document.getElementById('newDescription').value=''
    document.getElementById('newLocation').value=''

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
            <p>Error: Invalid event ID</p>
        </div>
    )
}
else{
    if(selecting){
    if(eventData.domainDates.length===1){
return(
    <div>

         <Calendar minDetail={'month'} className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         {/* {console.log(curDate)} */}
         {tSelect}
         <p>{errMsg}</p>
         <button onClick={()=>{setFinished(true)}}>Done</button>
    </div>
)
}
else{
    if(!makeDoneButtonAppear){
    if(arrIndex===0){
        return(
    <div>

         <Calendar minDetail={'month'} className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         {/* {console.log(curDate)} */}
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))
        setDaysSet(daysSet+1)
        }}>Next</button>
         {/* {console.log(curDate.toLocaleString("en-US", {timeZone: "America/New_York"}).split('T'))} */}
         {tSelect}
         
    </div>)
    }
    else if((arrIndex+1)===eventData.domainDates.length){
        setDoneButtonAppears(true);
        return(
            <div>
        
         <Calendar minDetail={'month'} className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex-1)
        setCurDate(new Date(eventData.domainDates[arrIndex-1].date))
        }}>Previous&nbsp;</button>
         {/* {console.log(curDate)} */}
         {tSelect}
         <p>{errMsg}</p>
         <button onClick={()=>{setFinished(true)}}>Done</button>
    </div>
        )
    }
    else{
        return(
            <div>
        
         <Calendar minDetail={'month'} className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex-1)
        setCurDate(new Date(eventData.domainDates[arrIndex-1].date))
        }}>Previous&nbsp;</button>
        <button onClick={()=>{setArrIndex(arrIndex+1)
                setDaysSet(daysSet+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))}}>Next</button>
         {/* {console.log(curDate)} */}
         {tSelect}
    </div>
        )
    }
}
else{
    if(arrIndex===0){
        return(
    <div>

         <Calendar minDetail={'month'} className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         {/* {console.log(curDate)} */}
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))
        }}>Next</button>
         {/* {console.log(curDate)} */}
         {tSelect}
         <p>{errMsg}</p>
         <button onClick={()=>{setFinished(true)}}>Done</button>
    </div>)
    }
    else if((arrIndex+1)===eventData.domainDates.length){
        return(
            <div>
        
         <Calendar minDetail={'month'} className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex-1)
        setCurDate(new Date(eventData.domainDates[arrIndex-1].date))
        }}>Previous&nbsp;</button>
         {/* {console.log(curDate)} */}
         {tSelect}
         <p>{errMsg}</p>
         <button onClick={()=>{setFinished(true)}}>Done</button>
    </div>
        )
    }
    else{
        return(
            <div>
        
         <Calendar minDetail={'month'} className='smallCal' value = {new Date()} tileClassName={setClass} tileDisabled={disableDates} ></Calendar>
         <h1>{curDate.toDateString()}</h1>
         <button onClick={()=>{setArrIndex(arrIndex-1)
        setCurDate(new Date(eventData.domainDates[arrIndex-1].date))
        }}>Previous&nbsp;</button>
        <button onClick={()=>{setArrIndex(arrIndex+1)
        setCurDate(new Date(eventData.domainDates[arrIndex+1].date))}}>Next</button>
         {/* {console.log(curDate)} */}
         {tSelect}
         <p>{errMsg}</p>
         <button className='App-link' onClick={()=>{setFinished(true)}}>Done</button>
    </div>
        )
    }
}
}
}
else {
    if(eventData.creatorID!==uid){
    return(
        <div>
            <Link to={`/event/response/${id}`} >Put in your times</Link>
            <div className='whiteBackground'>
            <label className='homepageLabel'>
                            Event Name
                        <h1 className='makeBlack'>{eventData.name}</h1>
                        </label>
                        <br />
                        <label className='homepageLabel'>
                            Event Description
                        <h2 className='makeBlack'>{eventData.description}</h2>
                        </label>
                        <br />
                        <label className='homepageLabel'>
                            Event Location
                        <p className='makeBlack'>{eventData.location}</p>
                        </label>
                        <br />
            </div>
    <Calendar minDetail={'month'} tileDisabled={()=>{return true}} className='smallCal' value = {new Date()} tileClassName={({date})=>{return tileClassBuilder(date,eventData)}}></Calendar>
    {eventPgGrid}
    <Chat id={id} ></Chat>
    </div>)}
    else{
        if(!deleteTheEventWarn){
        return(
            <div>
                <Link to={`/event/response/${id}`} >Put in your times</Link>
                <div className='whiteBackground'>
                <label className='homepageLabel'>
                                Event Name
                            <h1 className='makeBlack'>{eventData.name}</h1>
                            </label>
                            <br />
                            <label className='homepageLabel'>
                                Event Description
                            <h2 className='makeBlack'>{eventData.description}</h2>
                            </label>
                            <br />
                            <label className='homepageLabel'>
                                Event Location
                            <p className='makeBlack'>{eventData.location}</p>
                            </label>
                            <br />
                            <label className='homepageLabel'>
                                <form className='updateEventForm' onSubmit={onUpdateEvent}>
                                    <label htmlFor='newName'>New Name: </label>
                                    <input className='input-background' name='newName' id='newName' variant='outlined' placeholder='New name...'></input>&nbsp;
                                    <label htmlFor='newDescription'>New Description: </label>
                                    <input className='input-background' name='newDescription' id='newDescription' variant='outlined' placeholder='New description...'></input>&nbsp;
                                    <label htmlFor='newLocation'>New Location: </label>
                                    <input className='input-background' name='newLocation' id='newLocation' variant='outlined' placeholder='New location...'></input>&nbsp;
                                    <br />
                                    <button type='submit'>UPDATE EVENT</button>
                                </form>
                            </label>
                </div>
        <Calendar minDetail={'month'} tileDisabled={()=>{return true}} className='smallCal' value = {new Date()} tileClassName={({date})=>{return tileClassBuilder(date,eventData)}}></Calendar>
        {eventPgGrid}
        <br />
        <button className='App-link' onClick={()=>{setDeleteWarn(true)}}>Delete the event</button>
        <Chat id={id} ></Chat>
        </div>)
    }
else{
    return(
        <div>
            <Link onClick={()=>{setDeleteWarn(false)}} to={`/event/response/${id}`} >Put in your times</Link>
            <div className='whiteBackground'>
            <label className='homepageLabel'>
                            Event Name
                        <h1 className='makeBlack'>{eventData.name}</h1>
                        </label>
                        <br />
                        <label className='homepageLabel'>
                            Event Description
                        <h2 className='makeBlack'>{eventData.description}</h2>
                        </label>
                        <br />
                        <label className='homepageLabel'>
                            Event Location
                        <p className='makeBlack'>{eventData.location}</p>
                        </label>
                        <br />
                        <label className='homepageLabel'>
                                <form className='updateEventForm' onSubmit={onUpdateEvent}>
                                    <label for='newName'>New Name: </label>
                                    <input className='input-background' name='newName' id='newName' variant='outlined' placeholder='New name...'></input>&nbsp;
                                    <label for='newDescription'>New Description: </label>
                                    <input className='input-background' name='newDescription' id='newDescription' variant='outlined' placeholder='New description...'></input>&nbsp;
                                    <label for='newLocation'>New Location: </label>
                                    <input className='input-background' name='newLocation' id='newLocation' variant='outlined' placeholder='New location...'></input>&nbsp;
                                    <br />
                                    <button type='submit'>UPDATE EVENT</button>
                                </form>
                            </label>
            </div>
    <Calendar minDetail={'month'} tileDisabled={()=>{return true}} className='smallCal' value = {new Date()} tileClassName={({date})=>{return tileClassBuilder(date,eventData)}}></Calendar>
    {eventPgGrid}
    <br />
    <p>Are you sure you want to delete the event</p>
    <button className='App-link' onClick={()=>{setDeleteWarn(false)}}>Do not delete the event</button>
    <button className='App-link' onClick={()=>{setDeleteConfirm(true)}}>Confirm Delete</button>
    <br />
    </div>)
}
}
}
}
}
export default ResponseToInvite;