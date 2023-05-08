import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import '../App.css';
import { useParams } from 'react-router-dom';
import AuthContext from '../AuthContext';

function Chat(){
    const {mongoUser} = React.useContext(AuthContext);

    console.log(mongoUser);
    const {id} = useParams();
    const [state, setState] = useState({message: '', name: mongoUser.username, room: id});
    const [chat, setChat] = useState([]);
    
    const socketRef = useRef();
  
    useEffect(() => {
      socketRef.current = io('/');
      userjoin('','');
      return () => {
        socketRef.current.disconnect();
      };
    }, []);
  
    useEffect(() => {
      socketRef.current.on('message', function ({name, message}) {
        console.log(chat)
        console.log('The server has sent some data to all clients in the room');
        console.log('hello?')
        setChat([{name, message},...chat]);
      });
      socketRef.current.on('user_join', function (newChat) {
        setChat(newChat);
      });
  
      return () => {
        socketRef.current.off('message');
        socketRef.current.off('user_join');
      };
    }, [chat]);
  
    const userjoin = (name, room) => {
      socketRef.current.emit('user_join', mongoUser.username, id);
    };
  
    const onMessageSubmit = (e) => {
      let msgEle = document.getElementById('message');
      console.log(id)
      console.log([msgEle.name], msgEle.value);
      if(msgEle.value.trim()) {
        setState({...state, [msgEle.name]: msgEle.value});
        socketRef.current.emit('message', {
          name: state.name,
          message: msgEle.value,
          room: id
        });
      }
      e.preventDefault();
      setState({message: '', name: state.name});
      msgEle.value = '';
      msgEle.focus();
    };
  
    const renderChat = () => {
      // console.log('In render chat');
      // console.log(chat);
      return chat.map(({name, message}, index) => (
        <div key={index}>
          <h2>
            {name}: <span>{message}</span>
          </h2>
        </div>
      ));
    };
  
    return (
      <div>
          <div className='card'>
          <form onSubmit={onMessageSubmit}>
              <h1>Messenger</h1>
              <div>
                <input
                  name='message'
                  id='message'
                  variant='outlined'
                  label='Message'
                />
              </div>
              <button>Send Message</button>
            </form>
            <div className='render-chat'>
              <h1>Chat Log</h1>
              {renderChat()}
            </div>

          </div>
      </div>
    );

}
export default Chat;