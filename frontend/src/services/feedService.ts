import { api } from "./api";
import type { FeedResponse } from "../types/feed";

export async function getFeed(): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>('/user/feed')
    return response.data
}