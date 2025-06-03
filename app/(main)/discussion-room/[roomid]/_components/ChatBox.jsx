// import React from 'react'

// function ChatBox({conversation}) {
//   return (
//     <div>
//       <div className='h-[60vh] bg-secondary border rounded-4xl 
//         flex flex-col relative p-4 overflow-auto '>
//             {/* <h2>Chat Section</h2> */}

//             {/* <div> */}
//               {conversation.map((item, index) => (
//                 <div className={`flex ${item.role == 'user' && 'justify-end'}`}>
//                   {item.role === 'assistant'
//                     ? (<h2 className='p-1 px-2 bg-primary text-white mt-2 inline-block rounded-md'>{item.content}</h2>)
//                     : (<h2 className='p-1 px-2 bg-gray-200 mt-2 inline-block rounded-md'>{item.content}</h2>)
//                   }
//                 </div>
//               ))}
//             {/* </div> */}
//           </div>
//           <h2 className='mt-4 text-gray-400 text-sm'>
//             At the end of your conversation we will automatically generate feedback/notes from your conversation.
//           </h2>
//     </div>
//   )
// }

// export default ChatBox

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; // Optional: remove if not using
import { motion } from 'framer-motion'; // Optional: add animation
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices';
import { LoaderCircle } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

function ChatBox({ coachingOption, conversation, enableFeedbackNotes }) {

  const [loading, setLoading] = useState(false);
  const updateSummary = useMutation(api.DiscussionRoom.UpdateSummary);
  const {roomid} = useParams();

  const GenerateFeedbackNotes = async() => {
    setLoading(true);
    try{
      const result = await AIModelToGenerateFeedbackAndNotes(coachingOption, conversation);
      console.log(result.content);
      
      await updateSummary({
        id: roomid,
        summary: result.content
      })
      setLoading(false);
      toast("Feedback/Notes Saved!");
    } catch(e) {
      setLoading(false);
      toast("Internal Server Error! Try again.")
    }
    
  }
  return (
    <div>
      <div className='h-[60vh] bg-muted border rounded-3xl flex flex-col p-4 overflow-y-auto shadow-sm'>
        {conversation.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={`flex mb-2 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-xl text-sm leading-relaxed ${
                item.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {item.content}
            </div>
          </motion.div>
        ))}
      </div>

      {!enableFeedbackNotes 
        ? <h2 className='mt-4 text-gray-400 text-sm text-center'></h2>
        : <Button className='mt-7 w-full' onClick={GenerateFeedbackNotes} disabled={loading} >
            {loading && <LoaderCircle className='animate-spin'/>}
            Generate Feedback/Notes</Button>
      } 
    </div>
  );
}

export default ChatBox;
