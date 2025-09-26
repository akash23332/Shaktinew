import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/Notfound";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import About from "./pages/About";
import Health from "./pages/health-pages/Index";
import ServiceDetail from "./pages/health-pages/ServiceDetail";
import NearbyDoctors from "./pages/health-pages/NearbyDoctors";
import HealthScoreAnalysis from "./pages/health-pages/HealthScoreAnalysis";
import AISymptomChecker from "./pages/health-pages/AISymptomChecker";
import AIChatbot from "./pages/health-pages/AIChatbot";
import MedicineTracker from "./pages/health-pages/MedicineTracker";
import VideoConsultation from "./pages/health-pages/VideoConsultation";
import MedicalHistory from "./pages/health-pages/MedicalHistory";
import MenstrualTracker from "./pages/health-pages/MenstrualTracker";
import PregnancyTracker from "./pages/PregnancyTracker";
import Cybersecurity from "./pages/Cybersecurity";
import OneClickReport from "./pages/OneClickReport";
import EvidenceLocker from "./pages/EvidenceLocker";
import DeepfakeDetection from "./pages/DeepfakeDetection";
import VoiceShield from "./pages/VoiceShield";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/services" element={<Services />} />
      <Route path="/cybersecurity" element={<Cybersecurity />} />
      <Route path="/oneclickreport" element={<OneClickReport />} />
      <Route path="/evidence-locker" element={<EvidenceLocker />} />
      <Route path="/deepfake-detection" element={<DeepfakeDetection />} />
      <Route path="/voice-shield" element={<VoiceShield />} />
      <Route path="/health" element={<Health />} />
      {/* Service detail route from health services grid */}
      <Route path="/service/:id" element={<ServiceDetail />} />

      {/* Health Analysis subpages */}
      <Route path="/health/analysis/nearby-doctors" element={<NearbyDoctors />} />
      <Route path="/health/analysis/health-score" element={<HealthScoreAnalysis />} />

      {/* AI Tele Clinic subpages */}
      <Route path="/health/tele-clinic/symptom-checker" element={<AISymptomChecker />} />
      <Route path="/health/tele-clinic/chatbot" element={<AIChatbot />} />
      <Route path="/health/tele-clinic/medicine-tracker" element={<MedicineTracker />} />
      <Route path="/health/tele-clinic/video-consultation" element={<VideoConsultation />} />
      <Route path="/health/tele-clinic/medical-history" element={<MedicalHistory />} />
      {/* Health Tracker subpages */}
      <Route path="/health/tracker/menstrual-tracker" element={<MenstrualTracker />} />
      <Route path="/health/tracker/pregnancy-tracker" element={<PregnancyTracker />} />
      <Route path="/health/tracker/medical-history" element={<MedicalHistory />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/search" element={<Search />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;


