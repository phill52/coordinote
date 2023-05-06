import React from 'react';
import {Link} from 'react-router-dom';
import {Card,CardMedia,CardContent,CardActionArea,Accordion,AccordionSummary,Typography,Grid} from '@mui/material';
import {Calendar} from 'react-calendar';
import '../App.css';


const CardBuilder =(event) =>{
  
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
  if(typeof event.image==='string'){
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
              src={event.image}
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
                  <Calendar minDetail={'month'} tileDisabled={()=>{return true}} className='smallCal' value = {new Date()} tileClassName={({date})=>{return tileClassBuilder(date,event)}}></Calendar>
                  
              </CardContent>

              </Link>
          </Card>
      </Grid>
  )
  }
  else{
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
}

export default CardBuilder;