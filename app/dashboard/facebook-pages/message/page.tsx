"use client";

import { useState } from "react";

export default function SendMessage() {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);

  async function handleSend() {
    const res = await fetch("/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId, message }),
    });

    const data = await res.json();
    setResponse(data);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient PSID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send Message</button>

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
