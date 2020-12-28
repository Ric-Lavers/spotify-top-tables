import Axios from "services/axiosSetup";

export function addNewGroup(group_name: string): Promise<any> {
  return Axios.get(`group/add/${group_name}`);
}
