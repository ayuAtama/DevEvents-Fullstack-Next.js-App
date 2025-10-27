import ExplorerBtn from "@/Components/ExplorerBtn";
import EventCard from "@/Components/EventCard";
import { events } from "@/lib/constants";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const Home = async () => {
  console.log("Where am I?");
  const response = await fetch(`${BASE_URL}/api/events`);
  const data : IEvent[] = await response.json();
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
