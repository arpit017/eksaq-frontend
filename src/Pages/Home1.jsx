import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Input, Flex, VStack, Heading, Text, Divider, Spacer, useToast } from "@chakra-ui/react";

export const Home1 = () => {
  const [total, setTotal] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [name, setName] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const toast = useToast();

  useEffect(() => {
    getAudio();
  }, []);

  const getAudio = () => {
    axios.get("http://localhost:8080")
      .then((res) => {
        setTotal(res.data.data);
      })
      .catch(error => {
        console.error('Error fetching audio data:', error);
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

      axios.post('http://localhost:8080/upload', formData)
        .then(response => {
          toast({
            title: "Audio Uploaded",
            description: "Your audio has been successfully uploaded.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          getAudio(); // Refresh audio list after upload
        })
        .catch(error => {
          console.error('Error uploading audio:', error);
          toast({
            title: "Error",
            description: "Failed to upload audio. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      console.error('No audio recorded.');
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" mt={8}>
      <Heading mb={4}>Recent Recordings</Heading>
      {recordedAudio && (
        <audio src={URL.createObjectURL(recordedAudio)} controls />
      )}
      <Input
        placeholder="Enter audio name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        mb={4}
      />
      <Button onClick={toggleRecording} disabled={!name} mb={4}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <VStack align="stretch" spacing={4} mt={4} w="100%">
        {total.map((ele, index) => (
          <div key={index}>
            <Heading size="md">{ele.name}</Heading>
            <audio src={ele.audio} controls />
            <Text>{ele.transcription}</Text>
            {index !== total.length - 1 && <Divider />}
          </div>
        ))}
      </VStack>
    </Flex>
  );
};
