import { Link, Outlet, useLocation, useNavigate, useNavigation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { listNotes, createNote, deleteNote } from "~/lib/notes.client";
import type { Note } from "~/types/note";

// Ocean Professional palette
const colors = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  error: "#EF4444",
  bg: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
};

export default function NotesLayout() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();

  // Load notes from local storage on mount and whenever route changes back here.
  useEffect(() => {
    setNotes(listNotes());
  }, [location.key]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const onAdd = () => {
    const n = createNote({ title: "Untitled", content: "" });
    setNotes(listNotes());
    navigate(`/notes/${n.id}`);
  };

  const onDelete = (id: string) => {
    const ok = confirm("Delete this note?");
    if (!ok) return;
    deleteNote(id);
    setNotes(listNotes());
    // if we're on the deleted note, go back to list root
    if (location.pathname.endsWith(id)) {
      navigate("/notes");
    }
  };

  const isBusy = navigation.state !== "idle";

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ background: colors.bg }}>
      <div className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="border-b md:border-b-0 md:border-r border-gray-200 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 py-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-gray-50 border border-blue-200" />
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Ocean Notes</h1>
              <p className="text-xs text-gray-500">Capture ideas, fast.</p>
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="Search notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query ? (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>

          <div className="px-2">
            <button
              onClick={onAdd}
              className="mb-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              + New note
            </button>
          </div>

          <nav className="overflow-y-auto px-2 pb-4" aria-label="Notes list">
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-sm text-gray-500">No notes yet.</p>
            ) : (
              <ul className="space-y-1">
                {filtered.map((n) => {
                  const active = location.pathname.endsWith(n.id);
                  return (
                    <li key={n.id}>
                      <div className={`group flex items-center justify-between rounded-lg border ${active ? "border-blue-300 bg-blue-50" : "border-transparent hover:border-gray-200"} transition`}>
                        <Link
                          to={`/notes/${n.id}`}
                          className={`block flex-1 truncate px-3 py-2 text-sm ${active ? "text-blue-800" : "text-gray-800"} `}
                          prefetch="intent"
                        >
                          <div className="truncate font-medium">{n.title || "Untitled"}</div>
                          <div className="truncate text-xs text-gray-500">
                            {new Date(n.updatedAt).toLocaleString()}
                          </div>
                        </Link>
                        <button
                          onClick={() => onDelete(n.id)}
                          className="mr-2 hidden rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 group-hover:block"
                          aria-label={`Delete ${n.title || "note"}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </aside>

        {/* Main area */}
        <main className="relative">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-500 md:inline">
                {isBusy ? "Saving..." : "All changes saved"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/notes"
                className="rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
              >
                Notes
              </Link>
              <a
                href={import.meta.env.VITE_FRONTEND_URL || "#"}
                className="rounded-md bg-gradient-to-r from-blue-500/10 to-gray-50 px-3 py-2 text-sm text-blue-700 ring-1 ring-inset ring-blue-200 transition hover:from-blue-500/20"
                target="_blank"
                rel="noreferrer"
              >
                Open App
              </a>
            </div>
          </div>

          <div className="h-[calc(100vh-56px)] overflow-y-auto p-4">
            <div className="mx-auto max-w-3xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
