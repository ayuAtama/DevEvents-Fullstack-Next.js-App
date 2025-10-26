import ExplorerBtn from "@/Components/ExplorerBtn";
import EventCard from "@/Components/EventCard";
import { events } from "@/lib/constants";

const Home = () => {
  console.log("Where am I?");
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
          {events.map((event) => (
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
