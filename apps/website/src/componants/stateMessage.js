import React from "react";
import Icon from "./msIcon";

// One look for every "nothing to show yet" moment — loading or empty —
// instead of a bare line of muted text repeated per list.
export default function StateMessage({ icon = "search_off", loading = false, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-space-sm text-center text-on-surface-variant py-16">
      <Icon
        name={loading ? "progress_activity" : icon}
        className={`text-[28px] opacity-60 ${loading ? "animate-spin" : ""}`}
      />
      <p className="text-sm">{children}</p>
    </div>
  );
}
