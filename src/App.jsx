import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/Homepage';
import NotFound from './pages/NotFound';
import ApplicationForm from './pages/Application';

function App() {
 
  return (
    <>     
            <Routes>
            {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/apply" element={<ApplicationForm />} />
    
       {/* Not Found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        
   
      
    </>
  )
}

export default App
