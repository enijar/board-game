import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppReset } from "@/components/app/app.styles";

const Game = React.lazy(() => import("@/pages/game/game"));

export default function App() {
  return (
    <React.Suspense fallback="Loading...">
      <AppReset />
      <Routes>
        <Route path="/" element={<Game />} />
      </Routes>
    </React.Suspense>
  );
}
