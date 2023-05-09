import React from 'react';
import { useState, useEffect } from 'react';
import { auth, createToken } from '../fire';
import { useParams } from 'react-router';
import axios from 'axios';
import { Image } from 'react';
import AuthContext from '../AuthContext';
import ChangeProfilePic from '../components/changeProfilePic';
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(false);
  const [isMyPage, setIsMyPage] = useState(false);
  const [userData, setUserData] = useState(null);
  const {id} = useParams();
  const {mongoUser} = React.useContext(AuthContext);
  const [changePicture,setChangePicture] = useState(false);
  const [forceChange,setForceChange] = useState(true);
  useEffect(() => {
    async function formData(){
      if(forceChange){
      const header=await createToken();
      try{
        let data={};
        if(window.location.hostname==='localhost'){
        const response = await axios.get(`http://localhost:3001/api/user/${id}`,{headers:{'Content-Type':'application/json','Authorization':header.headers.Authorization}})
        data=response;
        }
        else{
          const response = await axios.get(`https://coordinote.us/api/user/${id}`,{headers:{'Content-Type':'application/json','Authorization':header.headers.Authorization}})
          data=response;
        }
        setLoading(false);
        setErr(false);
        setUserData(data.data)
        console.log("MONGO USER", mongoUser)
        if (mongoUser && mongoUser._id === id) {
          console.log("IS MY PAGE")
          setIsMyPage(true);
        }
      } catch(e){
        console.log(e);
        setLoading(false);
        setErr(true);
      }
      setForceChange(false);
    }
  }formData()
  },[mongoUser,forceChange]);

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
    if(!changePicture){
    return (
      <div>   
        <p>{userData.username}</p>
        <img src={userData.picture} alt="profile picture"/> 
        {console.log(isMyPage)}
        
        {isMyPage && <button onClick={()=>{setChangePicture(true)}}>Change Profile Picture</button>}
      </div>
    );
  }
  else{
    return(
      <div>
    <p>{userData.username}</p>
    <img src={userData.picture} alt="profile picture" /> 
    {/* {console.log('im here 2')} */}
    <ChangeProfilePic uid={id} change={setForceChange} done={setChangePicture} />
    <button onClick={()=>{setChangePicture(false)}}>Go Back</button>
    </div>
    )

  }
  }
};

export default Profile;