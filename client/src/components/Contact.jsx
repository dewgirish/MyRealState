import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landLord, setlandLord] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/get/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setlandLord(data);
          //console.log(data);
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred. Please try again later.");
      }
    };

    fetchData();
  }, [listing.userRef]);

  return (
    <>
      {landLord && (
        <div className="flex flex-col gap-2">
          <p>
            contact <span className="font-semibold">{landLord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full p-3 border rounded-lg"
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          ></textarea>
          <Link
            className="bg-slate-700 text-white p-3 rounded-lg text-center uppercase hover:opecity-95"
            to={`mailto:${landLord.email}?subject=Girish'S EState Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
