"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "./button";

// Browser "back", falling back to home when the page was opened directly
// (new tab / external link) and there's no history to go back to.
export default function GoBackButton(props) {
  const router = useRouter();
  const goBack = () => (window.history.length > 1 ? router.back() : router.push("/"));

  return (
    <Button type="button" variant="secondary" icon="chevron_left" onClick={goBack} {...props}>
      Go Back
    </Button>
  );
}
