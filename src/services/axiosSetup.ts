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

  Axios.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    // this will returned undefined on network error
    (error: AxiosError) => Promise.reject(error),
  )
  return Axios
}
const urlService = Axios()

export default urlService
