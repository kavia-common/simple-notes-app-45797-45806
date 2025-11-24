import { Link, useNavigate, useParams } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { deleteNote, getNote, updateNote } from "~/lib/notes.client";
import type { Note } from "~/types/note";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load the note
  useEffect(() => {
    if (!id) return;
    const n = getNote(id);
    setNote(n);
    setTitle(n?.title ?? "");
    setContent(n?.content ?? "");
  }, [id]);

  // Autosave on debounce
  useDebouncedEffect(
    () => {
      if (!id) return;
      const updated = updateNote(id, { title, content });
      setNote(updated);
    },
    400,
    [id, title, content]
  );

  const updatedAgo = useMemo(() => {
    if (!note) return "";
    return new Date(note.updatedAt).toLocaleString();
  }, [note]);

  const onDelete = () => {
    if (!id) return;
    const ok = confirm("Delete this note?");
    if (!ok) return;
    deleteNote(id);
    navigate("/notes");
  };

  if (!note) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        Note not found. It may have been deleted.
        <div className="mt-3">
          <Link to="/notes" className="text-sm underline">
            Back to notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Last updated: {updatedAgo}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          className="w-full rounded-md border-0 px-2 py-2 text-xl font-semibold text-gray-900 outline-none placeholder:text-gray-400"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="mt-3 h-[60vh] w-full resize-none rounded-md border-0 p-2 text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-400"
          placeholder="Start typing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}

function useDebouncedEffect(effect: () => void, delay: number, deps: unknown[]) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
