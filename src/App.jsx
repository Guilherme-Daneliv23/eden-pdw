import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUpScreen from "./screens/SignUpScreen"
import SignInScreen from "./screens/SignInScreen"
import GeneralDataWeddingScreen from "./screens/GeneralDataWeddingScreen"
import DressPreferencesScreen from "./screens/preferences/DressPreferencesScreen"
import PartyPreferencesScreen from "./screens/preferences/PartyPreferencesScreen"

export default function App() {
  return (
    <BrowserRouter  basename="/eden-pdw">
      <Routes>
        <Route path="/" element={<h1>Home vazia</h1>} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<SignInScreen />} />
        <Route path="/general-data-wedding" element={<GeneralDataWeddingScreen />} />
        <Route path="/preferences/dress" element={<DressPreferencesScreen />} />
        <Route path="/preferences/party" element={<PartyPreferencesScreen />} />
      </Routes>
    </BrowserRouter>
  )
}