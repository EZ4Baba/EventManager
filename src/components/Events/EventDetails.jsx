import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteEvent,
  fetchEventDetails,
  queryClient,
} from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const eventID = useParams();
  const navigate = useNavigate();
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["events", eventID.id],
    queryFn: ({ signal }) => {
      let id = eventID.id;
      return fetchEventDetails({ signal, id });
    },
  });
  const mutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      navigate("/events");
    },
  });
  function deleteEventHandler() {
    mutation.mutate(eventID.id);
  }

  let content;
  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching Event Details...</p>
      </div>
    );
  }
  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="Failed to load Event"
          message={error.info?.message || "Please try again later"}
        />
      </div>
    );
  }
  if (data) {
    const formatedDate = new Date(data.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    content = (
      <>
        <header>
          <h1>{isPending ? "Loading..." : data?.title}</h1>
          <nav>
            <button onClick={deleteEventHandler}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data?.image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data?.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formatedDate} @ {data?.time}
              </time>
            </div>
            <p id="event-details-description">{data?.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
