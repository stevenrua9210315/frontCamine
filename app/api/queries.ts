import { api } from "./api";

export async function getMe() {
    const response = await api.get("/me")
    console.log(response.data)
    return response.data;
}