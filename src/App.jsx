import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout"
import Home from "@/pages/Home"
import AnimeDetails from "@/pages/AnimeDetails"
import Browse from "@/pages/Browse"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="AnimeDetails/:id" element={<AnimeDetails />} />
          <Route path="Browse" element={<Browse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
