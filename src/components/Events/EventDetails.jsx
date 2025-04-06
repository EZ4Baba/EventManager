import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteEvent,
  fetchEventDetails,
  queryClient,
} from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useRef, useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
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
        refetchType: "none",
      });
      /*
      The invalidateQueries function marks specific queries as "stale," meaning their cached data is no longer considered up-to-date
      By default, stale queries are automatically refetched if they are active (visible in the UI).
      The refetchType  option allows you to control whether and how invalidated queries are refetched.
      refetchType: "none" - React Query will mark the selected queries as stale but will not automatically refetch them, even if they are active.
       */
      navigate("/events");
    },
  });
  function handleStartDelete() {
    setIsDeleting(true);
  }
  function handleStopDelete() {
    setIsDeleting(false);
  }
  function deleteEventHandler() {
    mutation.mutate(eventID.id);
  }
  console.log(mutation.isPending);
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
            <button onClick={handleStartDelete}>Delete</button>
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
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Do you wish to Proceed</h2>
          <p>This action can not be undone</p>
          <div className="form-actions">
            {mutation.isPending && <p> Deleting...</p>}
            {!mutation.isPending && (
              <>
                <button className="button" onClick={deleteEventHandler}>
                  Confirm
                </button>
                <button className="button-text" onClick={handleStopDelete}>
                  Cancel
                </button>
              </>
            )}
          </div>
          {mutation.isError && (
            <ErrorBlock
              title="Failed to delete Event"
              message={"Please try again later..."}
            />
          )}
        </Modal>
      )}
      <article id="event-details">{content}</article>
    </>
  );
}
