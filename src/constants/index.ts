const top_time_range = [
  { value: "short_term", label: "4 weeks" },
  { value: "medium_term", label: "6 months" },
  { value: "long_term", label: "Years" },
]

let LOGIN_URL: string
if (process.env.REACT_APP_ENV === "PROD") {
  LOGIN_URL =
    process.env.REACT_APP_LOGIN_URL_PROD ||
    "https://serverless-1qy6p9wlj.vercel.app/api/login"
} else if (process.env.REACT_APP_ENV === "STAG") {
  LOGIN_URL =
    process.env.REACT_APP_LOGIN_URL_PROD ||
    "https://serverless-1qy6p9wlj.vercel.app/api/login"
} else {
  LOGIN_URL =
    process.env.REACT_APP_LOGIN_URL_DEV || "http://localhost:4000/api/login"
}

export { LOGIN_URL, top_time_range }
