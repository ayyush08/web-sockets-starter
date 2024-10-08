import { Container, Typography,TextField,Button, Box, Stack } from '@mui/material';
import React, { useEffect,useState,useMemo } from 'react'
import {io} from 'socket.io-client'
const App = () => {
  const socket = useMemo(()=>
    io("http://localhost:3000",
      {withCredentials:true}
    ),[],
  )

  const [message,setMessage] = useState("");
  const [room,setRoom] = useState("");
  const [socketId,setSocketId] = useState("");
  const [messages,setMessages] = useState([]);
  const [roomName,setRoomName] = useState("");

  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName);
    setRoomName("");
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit("message",{message,room});
    setMessage("");
  }
  console.log(messages);
  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketId(socket.id);
      console.log("Connected",socket.id);
    })

    socket.on("welcome",(data)=>{
      console.log(data);
    })
    socket.on("receive-message",(data)=>{
      setMessages((messages)=>[...messages,data]);

    })
    return ()=>{
      socket.disconnect();
    }
  },[])
  return (
    <Container maxWidth="sm">
      <Box my={4}>

      <Typography variant='h4' component='div' gutterBottom>
        {socket.id}
      </Typography>

     <form onSubmit={joinRoomHandler}>
      <h5>Join Room</h5>
      <TextField
    value={roomName}
    onChange={(e)=>setRoomName(e.target.value)}
    id='outlined-basic' 
    label='Room Name'
    variant='outlined'/>
    <Button type='submit' variant='contained' color='primary'>Join</Button>
     </form>
    <form onSubmit={handleSubmit}>
    <TextField
    value={message}
    onChange={(e)=>setMessage(e.target.value)}
    id='outlined-basic' 
    label='Message'
    variant='outlined'/>
    <TextField
    value={room}
    onChange={(e)=>setRoom(e.target.value)}
    id='outlined-basic' 
    label='Room'
    variant='outlined'/>
    <Button type='submit' variant='contained' color='primary'>Send</Button>
    </form>



    <Stack>
      {
        messages.map((msg,index)=>(
          <Typography key={index} variant='h6' component='div' gutterBottom>
            {msg}
          </Typography>
        ))
      }
    </Stack>
    </Box>
    </Container>
  )
}

export default App
