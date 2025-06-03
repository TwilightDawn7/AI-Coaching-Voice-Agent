"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import moment from "moment";
import { CoachingOptions } from "@/services/Options";
import ChatBox from "../../discussion-room/[roomid]/_components/ChatBox";
import SummaryBox from "../_components/SummaryBox";

function ViewSummary() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(
    api.DiscussionRoom.GetDiscussionRoom,
    roomid ? { id: roomid } : "skip"
  );

  const GetAbstractImages = (option) => {
    const coachingOption = CoachingOptions.find((item) => item.name === option);
    return coachingOption?.abstract ?? "/ab1.png";
  };

  if (!DiscussionRoomData) {
    return <div className="text-gray-400 p-5">Loading summary...</div>;
  }

  return (
    <div className="-mt-10">
      <div className="flex justify-between items-end">
        <div className="flex gap-7 items-center">
          <Image
            src={GetAbstractImages(DiscussionRoomData.coachingOption)}
            alt="abstract"
            height={100}
            width={100}
            className="w-[70px] h-[70px] rounded-full"
          />
          <div>
            <h2 className="font-bold text-lg">{DiscussionRoomData.topic}</h2>
            <h2 className="text-gray-400">
              {DiscussionRoomData.coachingOption}
            </h2>
          </div>
        </div>
        <h2 className="text-gray-400 text-sm">
          {moment(DiscussionRoomData?._creationTime).fromNow()}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
        <div className="col-span-3">
          <h2 className="text-lg font-bold mb-6">Summary of Your Conversation</h2>
          <SummaryBox summary={DiscussionRoomData.summary} />
        </div>
        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-6">Your Conversation</h2>
          {DiscussionRoomData?.conversation && <ChatBox conversation={DiscussionRoomData?.conversation}
            coachingOption={DiscussionRoomData?.coachingOption}
            enableFeedbackNotes={false}
          />}
        </div>
      </div>
    </div>
  );
}

export default ViewSummary;
