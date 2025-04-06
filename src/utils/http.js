import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();
export async function fetchEvents({ searchTerm, signal }) {
  let url = "http://localhost:3000/events";
  if (searchTerm) {
    url = url + "?search=" + searchTerm;
  }
  const response = await fetch(url, { signal: signal });
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error; //must throw for react query to intersect that an error has occured
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {
  const res = await fetch(`http://localhost:3000/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    console.log("throwing error");
    const error = new Error("An error Occured in creating event");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }
  const { event } = await res.json();
  return event;
}

export async function fetchSelectableImages({ signal }) {
  const res = await fetch(`http://localhost:3000/events/images`, { signal });
  if (!res.ok) {
    const error = new Error("Error in fetching Selectable Images");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }
  const { images } = await res.json();
  return images;
}
export async function fetchEventDetails({ signal, id }) {
  const response = await fetch("http://localhost:3000/events/" + id, {
    signal,
  });
  if (!response.ok) {
    const error = new Error("Cant Find Event Details");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }
  const { event } = await response.json();
  return event;
}

export async function deleteEvent(eventID) {
  const res = await fetch("http://localhost:3000/events/" + eventID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const error = new Error("Could not delete event");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }
  const data = await res.json();
  console.log(data);
}
