import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/Homepage';
import NotFound from './pages/NotFound';
import ApplicationForm from './pages/Application';
import AdminDashboard from "./pages/AdminDashboard";
import LeadershipAppForm from "./pages/LeadershipAppForm";

function App() {
 
  return (
    <>     
            <Routes>
            {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/register" element={<LeadershipAppForm />} />
        <Route path="/admin_view" element={<AdminDashboard />} />
    
       {/* Not Found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        
   
      
    </>
  )
}

export default App
