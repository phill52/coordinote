import axios from 'axios'
import {createToken } from '../fire';
import React, {useState, useEffect} from 'react';
function ChangeProfilePic (props){
const {uid,change,done}= props;
const [imageIn,setImageIn]=useState(false);
const [fileChange,setFileChange] = useState(false);
const [submitForm,setFormSubmit] = useState(false);
const [fileUrl,setFileUrl] = useState('');
const [errMsg,setErrMsg] = useState('');
const [error,setErr] = useState(false);
useEffect(()=>{
    async function fileUpload(){
        console.log(submitForm);
        if(submitForm){
        if((document.querySelector('input[type="file"]').files.length!==0)){
            const formData = new FormData();
            console.log(document.querySelector('input[type="file"]').files[0])
            formData.append("image",document.querySelector('input[type="file"]').files[0],document.querySelector('input[type="file"]').files[0].name)
            console.log(formData.getAll('image')[0]);
            console.log(formData)
            const header=await createToken();
            try{
                if(window.location.hostname==='localhost'){
            await axios.post('http://localhost:3001/api/yourpage/events/imageTest',formData,{headers:{'Content-Type':'multipart/form-data',
            authorization:header.headers.Authorization}})
            .then(function (response){
                console.log(response);
                setFileUrl(response.data.imageUrl);
                setImageIn(true);
            })
            .catch(function (error){
                console.log(error);
            });
            console.log('WHY WONT I WORK')
                }
                else{
                    await axios.post('https://coordinote.us/api/yourpage/events/imageTest',formData,{headers:{'Content-Type':'multipart/form-data',
            authorization:header.headers.Authorization}})
            .then(function (response){
                console.log(response);
                setFileUrl(response.data.imageUrl);
                setImageIn(true);
            })
            .catch(function (error){
                console.log(error);
            });
            console.log('WHY WONT I WORK')
                }
            }
            catch(e){
            console.log(e);
            }
                }
                else{
                    setErrMsg("Error, incorrect upload of image");
                    console.log('im here')
                    setFormSubmit(false)
                }}
                
}fileUpload()},[submitForm])

useEffect(()=>{
    async function formData(){
        if(imageIn){
            const header=await createToken();

            if(window.location.hostname==='localhost'){
                await axios.post(`http://localhost:3001/api/user/${uid}`,{picture:fileUrl},{headers:{'Content-Type':'application/json','Authorization':header.headers.Authorization}})
            .then(function (response){
                console.log(response)
                setFormSubmit(false)
                change(true)
                done(false)
            })
            .catch(function (error){
                console.log(error)
                setFormSubmit(false)
                setErrMsg('upload failed :(')
            })
            }
            else{
            await axios.post(`https://coordinote.us/api/user/${uid}`,{picture:fileUrl},{headers:{'Content-Type':'application/json','Authorization':header.headers.Authorization}})
            .then(function (response){
                console.log(response)
                setFormSubmit(false)
                change(true)
                done(false)

            })
            .catch(function (error){
                console.log(error)
                setFormSubmit(false)
                setErrMsg('upload failed :(')
            })
                
            
        }}
    }formData()
},[imageIn])
if(error){
    return (
        <div>
            <p>Error</p>
        </div>
    )
}
else{
    return(
        <div>
                    <label className='login-label'>
                        {'Event Image: '}
                        <input type='file' accept='image/png, image/jpeg, image/jpg' required className='login-input' id='imageInput' onChange={(e)=>{
                            console.log(e)}}
                             />
                    </label>
                    <button onClick={()=>{setFormSubmit(true)}}>Submit the image</button>

                    <p>{errMsg}</p>

        </div>
    )
}





}
export default ChangeProfilePic;