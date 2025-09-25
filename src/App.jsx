import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUpScreen from "./screens/SignUpScreen"
import SignInScreen from "./screens/SignInScreen"
import GeneralDataWeddingScreen from "./screens/GeneralDataWeddingScreen"
import DressPreferencesScreen from "./screens/preferences/DressPreferencesScreen"
import PartyPreferencesScreen from "./screens/preferences/PartyPreferencesScreen"
import GroomsScreen from "./screens/GroomsScreen"
import DreamScenarioPreferencesScreen from "./screens/preferences/DreamScenarioPreferencesScreen"
import DecorationVibePreferenceScreen from "./screens/preferences/DecorationVibePreferenceScreen"
import InvitationPreferenceScreen from "./screens/preferences/InvitationPreferenceScreen"
import GiftPreferenceScreen from "./screens/preferences/GiftPreferenceScreen"
import FirstPriorityPreferencesScreen from "./screens/preferences/FirstPriorityPreferecesScreen"
import InvestmentPriorityPreferenceScreen from "./screens/preferences/InvestmentPriorityPreferenceScreen"
import DrinksPreferencesScreen from "./screens/preferences/DrinksPreferencesScreen"
import ExtraServicesPreferencesScreen from "./screens/preferences/ExtraServicesPreferencesScreen"
import GastronomyTypePreferenceScreen from "./screens/preferences/GastronomyTypePreferenceScreen"
import GastronomyMainOptionsPreferencesScreen from "./screens/preferences/GastronomyMainOptionsPreferenceScreen"
import GastronomyCakePreferencesScreen from "./screens/preferences/GastronomyCakePreferencesScreen"
import DreamsIdeasPreferenceScreen from "./screens/preferences/DreamsIdeasPreferenceScreen"

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