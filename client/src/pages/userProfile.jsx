import React from 'react';
import { useState, useEffect } from 'react';
import { auth, createToken } from '../fire';
import { useParams } from 'react-router';
import axios from 'axios';
import { Image } from 'react';
import AuthContext from '../AuthContext';
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(false);
  const [isMyPage, setIsMyPage] = useState(false);
  const [userData, setUserData] = useState(null);
  const {id} = useParams();
  const {mongoUser} = React.useContext(AuthContext);

  useEffect(() => {
    async function formData(){
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
    }formData()
  },[mongoUser]);

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
    return (
      <div>   
        <p>{userData.username}</p>
        <img src={userData.picture}/> 
        {isMyPage && <button>Change Profile Picture</button>}
      </div>
    );
  }
};

export default Profile;