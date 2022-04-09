import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppReset } from "@/components/app/app.styles";

const Home = React.lazy(() => import("@/pages/home/home"));

export default function App() {
  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <AppReset />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </React.Suspense>
  );
}
