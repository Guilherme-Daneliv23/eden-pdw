import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUpScreen from "./screens/SignUp"
import SignInScreen from "./screens/SignIn"
import GeneralDataWeddingScreen from "./screens/GeneralDataWedding"
import DressPreferencesScreen from "./screens/preferences/Dress"
import PartyPreferencesScreen from "./screens/preferences/Party"
import GroomsScreen from "./screens/Grooms"
import DreamScenarioPreferencesScreen from "./screens/preferences/DreamScenario"
import DecorationVibePreferenceScreen from "./screens/preferences/DecorationVibe"
import InvitationPreferenceScreen from "./screens/preferences/Invitation"
import GiftPreferenceScreen from "./screens/preferences/Gift"
import FirstPriorityPreferencesScreen from "./screens/preferences/FirstPriority"
import InvestmentPriorityPreferenceScreen from "./screens/preferences/InvestmentPriority"
import DrinksPreferencesScreen from "./screens/preferences/Drinks"
import ExtraServicesPreferencesScreen from "./screens/preferences/ExtraServices"
import GastronomyTypePreferenceScreen from "./screens/preferences/GastronomyType"
import GastronomyMainOptionsPreferencesScreen from "./screens/preferences/GastronomyMainOptions"
import GastronomyCakePreferencesScreen from "./screens/preferences/GastronomyCake"
import DreamsIdeasPreferenceScreen from "./screens/preferences/DreamsIdeas"

export default function App() {
  return (
    <BrowserRouter  basename="/eden-pdw">
      <Routes>
        <Route path="/home" element={<h1>Home vazia</h1>} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/" element={<SignInScreen />} />
        <Route path="/set/general-data-wedding" element={<GeneralDataWeddingScreen />} />
        <Route path="/set/preferences/dress" element={<DressPreferencesScreen />} />
        <Route path="/set/preferences/party" element={<PartyPreferencesScreen />} />
        <Route path="/set/grooms" element={<GroomsScreen />} />
        <Route path="/set/preferences/dream-scenario" element={<DreamScenarioPreferencesScreen />} />
        <Route path="/set/preferences/decoration" element={<DecorationVibePreferenceScreen />} />
        <Route path="/set/preferences/invitation" element={<InvitationPreferenceScreen />} />
        <Route path="/set/preferences/gift" element={<GiftPreferenceScreen />} />
        <Route path="/set/preferences/first-priority" element={<FirstPriorityPreferencesScreen />} />
        <Route path="/set/preferences/investiment-priority" element={<InvestmentPriorityPreferenceScreen />} />
        <Route path="/set/preferences/drinks" element={<DrinksPreferencesScreen />} />
        <Route path="/set/preferences/extra-services" element={<ExtraServicesPreferencesScreen />} />
        <Route path="/set/preferences/gastronomy-type" element={<GastronomyTypePreferenceScreen />} />
        <Route path="/set/preferences/gastronomy-main-options" element={<GastronomyMainOptionsPreferencesScreen />} />
        <Route path="/set/preferences/gastronomy-cake" element={<GastronomyCakePreferencesScreen />} />
        <Route path="/set/preferences/dreams-ideas" element={<DreamsIdeasPreferenceScreen />} />
      </Routes>
    </BrowserRouter>
  )
}