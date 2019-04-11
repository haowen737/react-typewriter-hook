import React from 'react'
import { useState, useEffect, useRef } from "react"
import logo from './logo.svg'
import './App.css'
import useTypewriter from "../../build"

const alarmClock = () => new Date().toLocaleTimeString()

export default function App() {
  const [time, setTime] = useState(alarmClock())
  const intervalRef = useRef({})
  const typing = useTypewriter(time)

  useEffect(() => {
      intervalRef.current = setInterval(() => {
        setTime(alarmClock())
      }, 3000)
      return function clear() {
        clearInterval(intervalRef.current)
      }
    },
    [time]
  )

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {typing}
      </header>
    </div>
  )
}

