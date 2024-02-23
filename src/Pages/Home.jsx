import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {Button,Flex,Grid,Input,Text} from "@chakra-ui/react"
export const Home = () => {
  const [total, setTotal] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [name, setName] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    getAudio();
  }, []);

  const getAudio = () => {
    axios.get("https://eksaq-backend.vercel.app/")
      .then((res) => {
        console.log(res.data.data);
        setTotal(res.data.data);
      });
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false)
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
          };
          mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
            setRecordedAudio(audioBlob);
            uploadAudio(audioBlob);
            audioChunks.current = [];
          };
          mediaRecorder.current.start();
          setIsRecording(true);
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    }
  };

  const uploadAudio = (audioBlob) => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audiofile", audioBlob, name);

      axios.post('https://eksaq-backend.vercel.app/upload', formData)
        .then(response => {
          console.log('Audio uploaded successfully:', response.data);
          getAudio();
        })
        .catch(error => {
          console.error('Error uploading audio:', error);
        });
    } else {
      console.error('No audio recorded.');
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" pt="20px">
      <Text fontSize={"large"} fontWeight={"bold"}>Recent recorded</Text>
      <audio src={recordedAudio ? URL.createObjectURL(recordedAudio) : ''} controls />
      <Input placeholder="Please name your audio before recording" onChange={(e) => { setName(e.target.value) }} w="60%" mt="8"/>
      <Button onClick={toggleRecording} isDisabled={name === ""}  mt="8">
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <Grid templateColumns='repeat(2, 1fr)' gap={6}>
      {total.length > 0 && total.map((ele, index) => (
        <div key={index} style={{marginTop:"20px",boxShadow: "0 0 10px rgba(255, 255, 255, 0.3), 0 0 10px rgba(0, 0, 0, 0.3)",display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Text  fontSize={"larger"}>Topic : {ele.name}</Text>
          <audio src={ele.audio} controls />
          {/* <Text fontWeight={"bold"}>Transcript : {ele.transcription}</Text> */}
        </div>
      ))}
</Grid>
    </Flex>
  );
};