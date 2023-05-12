import React from 'react';
import Link from 'next/link';
import { TopicItemInF } from './TopicInterface';
import useIsMobile from '@/hooks/useIsMobile';
import Image from 'next/image';
import HandImage from '@/public/images/hand.png';

interface Props extends TopicItemInF {
  key: number;
}

export const TopicItem = ({
  topic_id,
  needHelp,
  rootLeaf,
  bestLeaf,
}: Props) => {
  const isMobile = useIsMobile();
  const needHelpPing = (
    <div
      className="absolute
                  h-[12%] w-[10%] top-[63%] right-[61%]
                  md:h-12 md:w-12 md:-top-4 md:-right-3"
    >
      <div className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></div>
      <Image className="absolute h-full w-full" src={HandImage} alt="hand" />
    </div>
  );

  return (
    <div
      className={`relative bg-gray-300 shadow-lg flex flex-col items-center justify-evenly rounded-xl
                    w-[94vw] h-[40vh] mx-[3%] ${isMobile ? 'shrink-0' : ''}
                    md:w-[30%] md:h-80 md:m-[2%] md:hover:relative md:hover:scale-110 md:transition`}
    >
      {needHelp && needHelpPing}
      <div className="bg-white w-[90%] h-[60%] rounded-xl p-[3%] overflow-hidden">
        <Link href={`/topics/${topic_id}`}>Rendering screen component</Link>
      </div>
      <div className="w-[90%] h-[25%] flex justify-evenly">
        <img
          className="bg-white rounded-xl hover:shadow-lg hover:transition hover:cursor-pointer"
          src={`${bestLeaf.image}`}
          alt="user Image"
        />
        <div className="pl-[5%] w-[65%] flex flex-col justify-between">
          <div
            className="bg-white text-xl h-[50%] rounded-xl p-[2%]
                        md:hover:text-green-300 md:hover:transition"
          >
            {bestLeaf.title}
          </div>
          <div className="bg-white text-base h-auto rounded-lg p-[1%]">
            {bestLeaf.nickname}
          </div>
        </div>
      </div>
    </div>
  );
};
