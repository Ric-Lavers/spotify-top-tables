import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios"

const Axios = ({
  config,
  headers,
}: {
  config?: object
  headers?: object
} = {}): AxiosInstance => {
  const spotifyToken = sessionStorage.spotifyToken

  const Axios = axios.create({
    // baseURL: "https://api.spotify.com/v1/",
    baseURL: "http://localhost:4000/api/",
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
      "Content-Type": "application/json",
      accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    },
    ...config,
  })
  // Axios.defaults.withCredentials = true

  Axios.interceptors.request.use((config) => {
    if (document.cookie) config.headers.Cookie = document.cookie
    if (sessionStorage.spotify_user_id)
      config.params = {
        ...config.params,
        spotify_user_id: sessionStorage.spotify_user_id,
      }

    return config
  })
  Axios.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    // this will returned undefined on network error
    (error: AxiosError) => Promise.reject(error),
  )
  return Axios
}
const urlService = Axios()

export default urlService
