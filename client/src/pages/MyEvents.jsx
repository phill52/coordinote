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
import CardBuilder from '../components/cardBuilder';
import { useLocation } from 'react-router-dom';

const MyEvents = ({invited}) => {
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(false);
  const [userEvents, setUserEvents] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const header = createToken();
    async function formData(){
        try{
        const header=await createToken();
        console.log(header.headers);
        await axios.get(`http://localhost:3001/api/yourpage/events/myEvents`,{headers:{'Content-Type':'application/json','Authorization':header.headers.Authorization}})
        .then(function (response){
          setLoading(false)
          setErr(false)
          if (invited) setUserEvents(response.data.attended); 
          else setUserEvents(response.data.events);
        })
        .catch(function (error){
          console.log(error)
          setErr(true);
          setLoading(false)
        });
        }
        catch(e){
          setErr(true);
          setLoading(false);
        }
      }formData()
    },[location]);
  if (loading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <p>Error</p>
      </div>
    );
  } else {
    let card = null;
    card = userEvents && userEvents.map((event) => {
      return CardBuilder(event);
    });

    if (card.length === 0) {
      return (
        <div>
          <h1>You have not created any events yet!</h1>
        </div>
      );
    }

    return (
      <div>
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row',
          }}
        >
          {card}
        </Grid>
      </div>
    );
  }
};
export default MyEvents;