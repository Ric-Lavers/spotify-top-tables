import { inspect } from "@xstate/inspect"
import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"

inspect({
  // options
  // url: "https://statecharts.io/inspect", // (default)
  // iframe: () => document.querySelector("iframe[data-xstate]"),
  iframe: false, // open in new window
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
