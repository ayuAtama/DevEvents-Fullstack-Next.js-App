// nextJS/fullstack/app/events/page.tsx


import ExplorerBtn from "@/Components/ExplorerBtn";
import EventCard from "@/Components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const APILAH = process.env.NEXT_PUBLIC_API_URL
const LOCAL = BASE_URL + "/api/events"
const nekopoi = APILAH + "/event"

const URL = nekopoi

const Home = async () => {
  "use cache";
  cacheLife("hours");

  //const response = await fetch(URL);
  //const data: IEvent[] = await response.json();

  const request = await fetch(URL)
  if (!request.ok){
    return (
      <div>
        <h1>
        Error Ngentod. Event Ghosting
        </h1>
        </div>
    )
  }
  const data: IEvent[] = await request.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br />
        Events You Love
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExplorerBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events list-none">
          {data &&
            data.length > 0 &&
            data.map((event) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
