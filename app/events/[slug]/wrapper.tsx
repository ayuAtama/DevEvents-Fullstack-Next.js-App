import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/Components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/action/event.action";
import { IEvent } from "@/database/event.model";
import EventCard from "@/Components/EventCard";
import { cacheLife } from "next/cache";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image
        src={icon}
        alt={alt}
        width={17}
        height={17}
        style={{ width: "17px", height: "17px" }}
      />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.25 flex-wrap">
    {tags.map((item) => (
      <div className="pill" key={item}>
        {item}
      </div>
    ))}
  </div>
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const bookings: number = 10;

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  cacheLife("hours");

  //use params
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  //const { message } = await request.json();

  let event;

  // handle error no event data to notFound pages
  const body = await request.json();

  if (!body.event) {
    return notFound();
  }

  // destructure the event data
  const {
    event: {
      title,
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      organizer,
      _id,
    },
  } = body;
  // console.log(body);
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  // const {description,image, overview, date, time, location, mode, agenda, audience,tags} = event
  // const data = await request.json();
  // console.log(data);

  if (!description) return notFound();
  return (
    <section id="event">
      <div className="header flex-col-gap-2">
        <h1 className="flex-col-gap-2">{title}</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
            style={{ width: "800px", height: "800px" }}
            loading="eager"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
          </section>
          <section className="flex-col-gap2">
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About Event Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who already booked their spot
              </p>
            ) : (
              <p>Be the first who book your spot</p>
            )}
            <BookEvent eventId={_id} slug={slug} />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((item: IEvent) => (
              <EventCard key={item.title} {...item} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
