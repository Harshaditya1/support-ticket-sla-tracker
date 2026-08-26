import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { CREATE_TICKET } from "../../graphql/mutations/ticket";
import { GET_TICKETS } from "../../graphql/queries/ticket";

type Props = {
  onClose: () => void;
};

export default function CreateTicketModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

 const [createTicket, { loading, error }] = useMutation(
  CREATE_TICKET,
  {
    refetchQueries: [
      {
        query: GET_TICKETS,
        variables: { take: 10 },
      },
    ],
    awaitRefetchQueries: true,
  }
);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      await createTicket({
        variables: {
          input: {
            title,
            description,
            priority,
          },
        },
      });

      onClose();
    } catch (err) {
      console.error("Create Ticket Error:", err);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Ticket</h2>

        <form onSubmit={handleSubmit}>
          <label>Ticket Title</label>

          <input
            type="text"
            placeholder="Enter ticket title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>

          <textarea
            placeholder="Describe your issue..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />

          <label>Priority</label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          {error && (
            <p
              style={{
                color: "red",
                marginTop: "12px",
              }}
            >
              Failed to create ticket.
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}