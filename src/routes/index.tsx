import { createFileRoute } from "@tanstack/react-router";
import { ReferenceApp } from "@/components/reference-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ReferenceApp />;
}
