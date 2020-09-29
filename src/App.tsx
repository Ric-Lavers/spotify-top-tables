import React from "react"
import "./App.css"

import TopTable from "./components/TopTable"
import SpotifyLogin from "components/SpotifyLogin"

function App() {
  return (
    <div className="App">
      {/* <SpotifyLogin /> */}
      <header className="App-header">
        <TopTable />
      </header>
    </div>
  )
}

export default App
