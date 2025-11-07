import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = (props: Props) => {
  return (
    <Link href={`/events/${props.slug}`} id="event-card">
      <Image
        loading="lazy"
        className="poster"
        src={props.image}
        alt={props.title}
        width={400}
        height={300}
        style={{ width: "auto", height: "250px" }}
      />
      <div className="flex flex-row gap-2">
        <Image
          src="/icons/pin.svg"
          alt="location"
          width={14}
          height={14}
          style={{ width: "14px", height: "14px" }}
        />
        <p>{props.location}</p>
      </div>
      <p className="title">{props.title}</p>
      <div className="datetime">
        <div>
          <Image
            src="/icons/calendar.svg"
            alt="date"
            width={14}
            height={14}
            style={{ width: "auto", height: "14px" }}
          />
          <p>{props.date}</p>
          <Image
            src="/icons/clock.svg"
            alt="time"
            width={14}
            height={14}
            style={{ width: "auto", height: "14px" }}
          />
          <p>{props.time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
