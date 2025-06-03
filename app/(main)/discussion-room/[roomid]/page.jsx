"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/services/GlobalServices";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@clerk/nextjs";
import { RealtimeTranscriber } from "assemblyai";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { AIModel } from "@/services/GlobalServices";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState, useContext } from "react";
import ChatBox from "./_components/ChatBox";
import { ConvertTextToSpeech } from "@/services/GlobalServices";
import { toast } from "sonner";
import { UserContext } from "@/app/_context/UserContext";
import Webcam from "react-webcam";

// import RecordRTC from 'recordrtc';
const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  // console.log(DiscussionRoomData._id);
  const { userData, setUserData } = useContext(UserContext);

  const [expert, setExpert] = useState();
  const [enableMic, setEnableMic] = useState(false);
  const recorder = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [transcribe, setTranscribe] = useState();
  const realtimeTranscriber = useRef(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState();
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const [enableFeedback, setEnableFeedback] = useState(false);
  const updateUserToken = useMutation(api.users.UpdateUserToken);
  const [cameraOn, setCameraOn] = useState(false);

  let silenceTimeout;
  let texts = {};

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      console.log("Expert Name : ", Expert?.name);
      console.log("Expert avatar:", Expert?.avatar);
      console.log(Expert);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = async () => {
    setLoading(true);
    setEnableMic(true);

    // Initialise Assembly AI
    realtimeTranscriber.current = new RealtimeTranscriber({
      token: await getToken(),
      sample_rate: 16_000,
    });

    realtimeTranscriber.current.on("transcript", async (transcript) => {
      // console.log(transcript);
      let msg = "";

      if (transcript.message_type === "FinalTranscript") {
        setConversation((prev) => [
          ...prev,
          {
            role: "user",
            content: transcript.text,
          },
        ]);
        await updateUserTokenMethod(transcript.text); // update user generated token
      }

      texts[transcript.audio_start] = transcript?.text;
      const keys = Object.keys(texts);

      const ordered = keys.sort((a, b) => a - b);
      const combined = ordered.map((k) => texts[k]).join(" ");
      setTranscribe(combined);
    });

    await realtimeTranscriber.current.connect();
    setLoading(false);
    setEnableMic(true);
    toast("Connected...");

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Dynamically import RecordRTC only when needed
        const { default: RecordRTC } = await import("recordrtc");

        recorder.current = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm;codecs=pcm",
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 250,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
          ondataavailable: async (blob) => {
            if (!realtimeTranscriber.current) return;
            clearTimeout(silenceTimeout);

            const buffer = await blob.arrayBuffer();
            // console.log("Audio buffer:", buffer);
            realtimeTranscriber.current.sendAudio(buffer);

            silenceTimeout = setTimeout(() => {
              console.log("User stopped talking");
            }, 2000);
          },
        });

        recorder.current.startRecording();
      } catch (err) {
        console.error("Mic access or RecordRTC error:", err);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (
        conversation?.length > 0 &&
        conversation[conversation.length - 1]?.role === "user"
      ) {
        // Calling AI text Model to Get Response
        const lastTwoMsg = conversation.slice(-2);
        const aiResp = await AIModel(
          DiscussionRoomData?.topic,
          DiscussionRoomData?.coachingOption,
          lastTwoMsg
        );

        // console.log("AI Response:", aiResp);
        const url = await ConvertTextToSpeech(
          aiResp.content,
          DiscussionRoomData.expertName
        );
        console.log(url);
        setAudioUrl(url);
        setConversation((prev) => [...prev, aiResp]);
        await updateUserTokenMethod(aiResp.content); //Update AI generated token
      }
    }
    fetchData();
  }, [conversation]);

  const disconnect = async () => {
    try {
      setLoading(true);

      // Stop microphone recording and release tracks
      if (recorder.current) {
        await new Promise((resolve) => {
          recorder.current.stopRecording(() => {
            try {
              const stream = recorder.current.stream;
              if (stream && stream.getTracks) {
                stream.getTracks().forEach((track) => track.stop());
              }
            } catch (err) {
              console.error("Error stopping stream:", err);
            }
            resolve();
          });
        });

        recorder.current = null;
      }

      // Close the realtime transcriber
      if (realtimeTranscriber.current) {
        await realtimeTranscriber.current.close();
        realtimeTranscriber.current = null;
      }

      clearTimeout(silenceTimeout);
      setEnableMic(false);
    } catch (err) {
      console.error("Error during disconnect:", err);
    } finally {
      if (DiscussionRoomData?._id) {
        try {
          await UpdateConversation({
            id: DiscussionRoomData._id,
            conversation: conversation,
          });
        } catch (err) {
          console.error("Failed to update conversation:", err);
        }
      } else {
        console.warn("No valid DiscussionRoom ID. Skipping update.");
      }

      setLoading(false);
      toast("Disconnected!");
      setEnableFeedback(true);
    }
  };

  const updateUserTokenMethod = async (text) => {
    const tokenCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const result = await updateUserToken({
      id: userData._id,
      credits: Number(userData.credits) - Number(tokenCount),
    });

    setUserData((prev) => ({
      ...prev,
      credits: Number(userData.credits) - Number(tokenCount),
    }));
  };

  return (
    <div className="-mt-20">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            {expert?.avatar ? (
              <Image
                src={expert.avatar}
                alt="Avatar"
                width={200}
                height={200}
                className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
              />
            ) : (
              <div className="h-[80px] w-[80px] rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                ?
              </div>
            )}
            <h2 className="text-gray-500">{expert?.name}</h2>

            <audio src={audioUrl} type="audio/mp3" autoPlay />
            {/* <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
              <UserButton />
            </div> */}

            <div className="absolute bottom-10 right-10 flex flex-col items-center gap-2">
              {cameraOn ? (
                <Webcam height={80} width={130} className="rounded-2xl" />
              ) : (
                <div className="bg-white p-2 rounded-2xl shadow-md">
                  <UserButton />
                </div>
              )}
              
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            <Button
              variant={enableMic ? "destructive" : "outline"}
              size="icon"
              onClick={enableMic ? disconnect : connectToServer}
              disabled={loading}
              aria-label="Toggle Mic"
              className="p-2"
            >
              {loading ? (
                <Loader2Icon className="animate-spin w-5 h-5" />
              ) : (
                <Image
                  src={enableMic ? "/mic-fill.svg" : "/mic-mute-fill.svg"}
                  alt="Mic Toggle"
                  width={24}
                  height={24}
                />
              )}
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={() => setCameraOn((prev) => !prev)}
                aria-label="Toggle Camera"
                className="p-1 ml-5 bg-blue-500"
              >
                <Image
                  src={
                    cameraOn ? "/camera-video.svg" : "/camera-video-off.svg"
                  }
                  alt="Toggle Camera"
                  width={20}
                  height={20}
                />
              </Button>
          </div>

        </div>

        <div>
          <ChatBox
            conversation={conversation}
            enableFeedbackNotes={enableFeedback}
            coachingOption={DiscussionRoomData?.coachingOption}
          />
        </div>
      </div>
      <div>
        <h2>{transcribe}</h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;
