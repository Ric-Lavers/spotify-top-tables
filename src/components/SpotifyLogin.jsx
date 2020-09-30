import React, { Component } from "react"

import { LOGIN_URL } from "constants/index"
import variables from "styles/variables"
import { getCurrentUsersProfile } from "services/index"
import SpotifyLogo from "images/custom-svgs/SpotifyLogo"

const { colors } = variables

export const styles = {
  container: {
    margin: 16,
  },
  logo: {
    backgroundColor: "white",
    fill: colors.success,
    stroke: colors.success,
    width: 64,
    height: 64,
    borderRadius: 24,
    position: "relative",
    zIndex: 2,
  },
  dp: {
    width: 64,
    height: 64,
    borderRadius: 24,
    marginLeft: -16,
    position: "relative",
  },
  avartarContainer: {
    display: "flex",
    position: "relative",
  },
  noLinkStyle: {
    cursor: "pointer",
    color: "inherit",
    textDecoration: "inherit",
  },
}

class SpotifyLogin extends Component {
  state = {
    tokenPresent: null,
    tokenValid: null,

    display_name: null,
    display_picture: null,
    spotifyLink: "",
  }
  static defaultProps = {
    onLogIn: () => {},
  }

  componentDidMount() {
    const { spotifyToken } = sessionStorage

    this.checkToken(spotifyToken)
    this.setToken()
  }

  setToken = () => {
    const address = window.location.href
    if (address.includes("access_token=")) {
      let token = new URLSearchParams(window.location.search).get(
        "access_token",
      )

      sessionStorage.spotifyToken = token
      window.location.replace(window.origin)
    }
  }

  checkToken = async (spotifyToken) => {
    const { onLogIn } = this.props

    if (spotifyToken) {
      this.setState({ tokenPresent: true })
      try {
        // set User
        let {
          display_name,
          email,
          images,
          external_urls,
        } = await getCurrentUsersProfile(spotifyToken)
        let display_picture = images.length !== 0 ? images[0].url : null

        this.setState({
          tokenValid: true,
          display_name,
          display_picture,
          email,
          spotifyLink: external_urls.spotify,
        })
        onLogIn(true)
        return true
      } catch (error) {
        console.log("error.status", { ...error })
        // timed out
        this.setState({ tokenValid: false })
        onLogIn(false)
      }
    } else {
      // no token
      this.setState({ tokenPresent: false })
      window.location.href = LOGIN_URL
    }
  }

  findLogoColor = (tokenPresent, tokenValid) =>
    tokenValid === null
      ? { fill: colors.inactive, stroke: colors.inactive }
      : tokenPresent && tokenValid
      ? { fill: colors.success, stroke: colors.success }
      : { fill: colors.error, stroke: colors.error }

  render() {
    const {
      tokenPresent,
      tokenValid,
      display_picture,
      display_name,
      email,
      spotifyLink,
    } = this.state
    const { isLoading } = this.props

    const logoColor = this.findLogoColor(tokenPresent, tokenValid)

    if (isLoading) {
      return <p>...loading</p>
    }

    return (
      <div id="spotify-login" style={styles.container}>
        {!tokenValid && (
          <a href={LOGIN_URL}>
            {tokenPresent
              ? `spotify auth timed out login again`
              : `login to spotify`}
          </a>
        )}
        <div>
          <SpotifyLogo style={{ ...styles.logo, ...logoColor }} />
          {tokenValid && display_picture && (
            <>
              <img src={display_picture} alt="display" style={styles.dp} />
            </>
          )}
        </div>
        <a href={spotifyLink} style={styles.noLinkStyle}>
          {display_name ? display_name : email}
        </a>
      </div>
    )
  }
}

export default SpotifyLogin
