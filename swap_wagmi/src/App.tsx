
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from "./pages/HomePages"
import LiquidesPages from './pages/LiquidezPages'
import SendPage from './pages/SendPage'
import Navbar from './components/Navbar'

function App() {

  return (
    <Router
        future={{
    v7_startTransition: true,
  }}>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/liquidez' element={<LiquidesPages/>}/>
        <Route path='/send' element={<SendPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
