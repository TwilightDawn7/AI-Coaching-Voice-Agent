import axios from "axios";
import OpenAI from "openai"
import { CoachingOptions } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  return result.data;
};


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true
})

export const AIModel = async(topic, coachingOption, lastTwoConversation) => {
  
  const option = CoachingOptions.find((item) => item.name === coachingOption)
  const PROMPT = (option.prompt).replace('{user_topic}', topic)


  const completion = await openai.chat.completions.create({
    model: "google/gemma-3n-e4b-it:free",
    messages: [
      { role: "user", content: PROMPT },
      ...lastTwoConversation
    ],
  })
  const response = completion.choices[0].message;
  console.log(completion.choices[0].message);
  return response;
}

export const ConvertTextToSpeech = async(text, expertName) => {
  const pollyClient = new PollyClient({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_POLLY_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
    }
  })

  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: expertName
  })

  try{
    const { AudioStream } = await pollyClient.send(command);

    const audioArrayBuffer = await AudioStream.transformToByteArray();
    const audioBlob = new Blob([audioArrayBuffer], {type: 'audio/mp3'})

    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;

  }catch(e){
    console.log(e);
  }
}

export const AIModelToGenerateFeedbackAndNotes = async(coachingOption, conversation) => {
  
  const option = CoachingOptions.find((item) => item.name === coachingOption)
  const PROMPT = (option.summaryPrompt);


  const completion = await openai.chat.completions.create({
    model: "google/gemma-3n-e4b-it:free",
    messages: [
      ...conversation,
      { role: "assistant", content: PROMPT },
    ],
  })
  const response = completion.choices[0].message;
  return response;
}