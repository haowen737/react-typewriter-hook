import React from 'react'
import { useState } from "react"
import logo from './logo.svg'
import './App.css'
import useTypewriter from "../../build"

export default function App() {
  const [value, setValue] = useState('')
  const [time, setTime] = useState('')
  const typing = useTypewriter(time)

  return (
    <div className="App">
      <header>react-typewriter-hook</header>
      <img src={logo} className="App-logo" alt="logo" />
      <p>{typing}</p>
      <textarea
        rows="4"
        cols="50"
        onChange={(ev) => setValue(ev.target.value)}
        value={value}
        placeholder="write something interesting and click start"
        />
      <button onClick={() => setTime(value)}>Start!</button>
    </div>
  )
}

