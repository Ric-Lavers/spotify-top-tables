import React from "react"
import "./App.css"

import TopTable from "./components/TopTable"
import SpotifyLogin from "components/SpotifyLogin"

function App() {
  const [loggedIn, set] = React.useState(false)
  return (
    <div className="App">
      <SpotifyLogin onLogIn={set} />
      <header className="App-header">{loggedIn && <TopTable />}</header>
      <iframe data-xstate />
    </div>
  )
}

export default App
