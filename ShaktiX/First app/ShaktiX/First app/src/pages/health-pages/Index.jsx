import HealthCarePlatform from "../../components/health-components/HealthCareProgram";
import Navigation from "../../components/Navbar";
import Footer from "../../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ paddingTop: "80px" }}>
      <Navigation />
      <HealthCarePlatform />
      <Footer />
    </div>
  );
};

export default Index;

