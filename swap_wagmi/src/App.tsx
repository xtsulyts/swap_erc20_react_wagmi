
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from "./pages/HomePages"
import LiquidesPages from './pages/LiquidezPages'

function App() {

  return (
    <Router
        future={{
    v7_startTransition: true,
  }}>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/liquides' element={<LiquidesPages/>}/>
      </Routes>
    </Router>
  )
}

export default App
