import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUpScreen from "./screens/SignUpScreen"

export default function App() {
  return (
    <BrowserRouter  basename="/eden-pdw">
      <Routes>
        <Route path="/" element={<h1>Home vazia</h1>} />
        <Route path="/signup" element={<SignUpScreen />} />
      </Routes>
    </BrowserRouter>
  )
}