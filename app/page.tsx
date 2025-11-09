import ExplorerBtn from "@/Components/ExplorerBtn";
import EventCard from "@/Components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

const Home = async () => {
  "use cache";
  cacheLife("hours");

  await connectDB();
  const data1: IEvent[] = await Event.find().sort({ createdAt: -1 }).lean();

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

      <div id="events" className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events list-none">
          {data1.map((event) => (
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
