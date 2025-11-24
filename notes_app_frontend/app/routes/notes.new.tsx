import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { createNote } from "~/lib/notes.client";

export default function NotesNew() {
  const navigate = useNavigate();
  useEffect(() => {
    const note = createNote({ title: "Untitled", content: "" });
    navigate(`/notes/${note.id}`, { replace: true });
  }, [navigate]);

  return null;
}
