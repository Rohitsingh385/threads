import { api } from "./api"

export interface NotificationActor {
    id: string 
    username: string 
    avatarUrl: string | null
}

export interface NotificationThread {
    id: string 
    content: string 
}

export interface NotificationComment {
    id: string 
    content: string 
}

export interface Notification {
    id: string 
    NotificationType: string 
    read: boolean
    createdAt: string 
    actor: NotificationActor
    thread: NotificationThread | null 
    comment: NotificationComment | null  
}

export interface NotificationResult {
    data: Notification[]
    hasNextPage: boolean 
    nextCursor: string | null
}

export interface NotificationResponse {
    success: boolean
    message: string 
    data: NotificationResult
}
export interface NotificationCountResponse {
    success: boolean
    message: string 
    data: number
}
export const getNotificaitons = async(limit = 10, cursor?: string ): Promise<NotificationResponse> => {
    const response = await api.get<NotificationResponse>("/notifications", {
        params: {
            limit,
            cursor
        }
    })
    return response.data
}

export const getUnreadCount = async(): Promise<NotificationCountResponse> => {
    const response = await api.get<NotificationCountResponse>("/notifications/unread-count")

    return response.data
}

export const markNotificationAsRead = async(notificationId: string) => {
    const response = await api.patch(`/notification/${notificationId}`)

    return response.data
}

export const markAllNotificationAsRead = async()=> {
    const response = await api.patch("/notification/")
    return response.data
}