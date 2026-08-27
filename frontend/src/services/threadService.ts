import { api } from "./api";

export async function getThreads(){
    const response = await api.get('/threads')
    return response.data
}