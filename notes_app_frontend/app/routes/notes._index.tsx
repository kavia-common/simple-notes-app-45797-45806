import { Link } from "@remix-run/react";

export default function NotesIndex() {
  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">Welcome to Ocean Notes</h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        Create, edit, and organize your notes with a clean and modern interface. Your notes are saved in your browser for now.
      </p>
      <Link
        to="/notes/new"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        + Create your first note
      </Link>
    </div>
  );
}
