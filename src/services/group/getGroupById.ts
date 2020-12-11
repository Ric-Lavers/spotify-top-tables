import Axios from "services/axiosSetup"

export function getGroupById(id: string): Promise<any> {
  console.log(id)

  return Axios.get(`groups/${id}`)
}
