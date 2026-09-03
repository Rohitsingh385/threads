import { api } from "./api";
import type { FeedResponse } from "../types/feed";

interface GetFeedParams {
    limit?: number
    cursor?: string
}

export async function getFeed(params?: GetFeedParams): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>('/user/feed', { params })
    return response.data
}