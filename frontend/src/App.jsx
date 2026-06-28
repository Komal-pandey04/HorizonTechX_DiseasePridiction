import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import Predict from './pages/Predict'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import About from './pages/About'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/"          element={<Home />} />
          <Route path="/predict"   element={<Predict />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history"   element={<History />} />
          <Route path="/about"     element={<About />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style:{ background:'#fff',color:'#1a202c',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'0.875rem',boxShadow:'0 4px 20px rgba(0,0,0,0.12)' },
        success:{ iconTheme:{ primary:'#10b981', secondary:'#fff' } },
        error:  { iconTheme:{ primary:'#ef4444', secondary:'#fff' } },
        duration: 3500,
      }} />
      <div style={{ display:'flex', minHeight:'100vh' }}>
        <Sidebar />
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <Navbar />
          <main style={{ flex:1 }}>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </div>
      <Chatbot />
    </BrowserRouter>
  )
}
