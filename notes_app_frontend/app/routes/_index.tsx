import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Ocean Notes" },
    { name: "description", content: "A simple notes app with a modern Ocean Professional theme." },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/notes", { replace: true });
  }, [navigate]);
  return null;
}
