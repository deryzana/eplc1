import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login';
import MainPage from './main_page/frontend/MainPage';

function App() {
  const [count, setCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? <MainPage /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
}

export default App
