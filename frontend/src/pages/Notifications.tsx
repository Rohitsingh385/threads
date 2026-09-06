import { useEffect, useState } from "react";

import { getNotificaitons, getUnreadCount, markNotificationAsRead,markAllNotificationAsRead , type Notification } from "../services/NotificationService";

const getNotificationsMessage = (notification: Notification) => {
    switch(notification.NotificationType){
        case "LIKE":
            return "liked your thread"
        case "COMMENT":
            return "comment on your thread"
        case "FOLLOW":
            return "started following you"
        default: 
            return "interacted with you"
    }
}
export const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [unreadCount, setUnreadCount] = useState(0)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [loadMoreError, setLoadMoreError] = useState("")
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true)
                setError("")
                const result = await getNotificaitons()

                setNotifications(result.data.data)
                setNextCursor(result.data.nextCursor)
                setHasNextPage(result.data.hasNextPage)

                const unreadResult = await getUnreadCount()
                setUnreadCount(unreadResult.data)

            } catch (error) {
                setError("unable to fetch notifications")
            } finally {
                setIsLoading(false)
            }
        }
        fetchNotifications()
    }, [])

    useEffect(()=> {
        const observer = new IntersectionObserver(
            entries => {
                if(entries[0].isIntersecting){
                    loadMoreNotifications()
                }
            }, 
            {
                threshold: 1
            }
        )

        const element = document.getElementById("notifications-loader")

        if(element){
            observer.observe(element)
        }
        return () => {
            observer.disconnect()
        }
    }, [nextCursor, hasNextPage, isLoadingMore])

    const handleMarkAsRead = async(notificationId: string) => {
        try{
            await markNotificationAsRead(notificationId)

            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId
                        ? {...notification, read: true}
                        : notification
                )
            )
            setUnreadCount(prev => Math.max(0, prev -1))
        }catch(error){
            setError("Unable to mark notification as read")
        }
    }

    const handlMarkAllAsRead = async() => {
        try{
            await markAllNotificationAsRead()

            setNotifications(prev => 
                prev.map(notification => ({
                    ...notification,
                    read: true
                }))
            )
            setUnreadCount(0)
        }catch(error){
            setError("unable to mark all notification as read")
        }
    }

    const loadMoreNotifications = async() => {
        if(!hasNextPage || !nextCursor || isLoading){
            return
        }

        try{
            setIsLoadingMore(true)
            setLoadMoreError("")
            const result = await getNotificaitons(
                10,
                nextCursor
            )
            setNotifications(prev => [
                ...prev,
                ...result.data.data
            ])
            setNextCursor(result.data.nextCursor)
            setHasNextPage(result.data.hasNextPage)
        }catch(error){
            setLoadMoreError("unable to load more notifications")
        }finally{
            setIsLoadingMore(false)
        }
    }
    return (
        <div className="mx-auto max-w-xl p-4">
            <h1 className="mb-4 text-2xl font-bold">
                Notifications
            </h1>
            <p className="mb-4 text-sm">
                {unreadCount} unread
            </p>
            {!isLoading && unreadCount > 0 && (
                <button
                type="button"
                onClick={handlMarkAllAsRead}
                className="mb-4 rounded-border px-4 py-2"
                >
                    Mark all as read
                </button>
            )}
            {isLoading && (
                <p>Loading Notifications..</p>
            )}
            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}
            {!isLoading || !error && notifications.length === 0  && (
                <p>
                    You don't have any notifications.
                </p>
            )}
            <div className="space-y-2">
                {notifications.map((notification)=> (
                    <div
                    key={notification.id}
                    onClick={() => {
                        if(!notification.read){
                            handleMarkAsRead(notification.id)
                        }
                    }}
                    className="rounded border p-3">
                        <p>
                            @{notification.actor.username}
                        </p>
                        <p className="text-sm">
                            {getNotificationsMessage(notification)}
                        </p>
                        {!notification.read && (
                            <p className={`cursor-pointer rounded border p-3 ${
                                !notification.read ? "bg-gray-100" : ""
                            }`}>
                                Unread
                            </p>
                        )}
                    </div>
                ))}    
                <div
                id="notifications-loader"
                className="py-4 text-center">
                    
                    {isLoadingMore && (
                        <p>Loading more notifications...</p>
                    )}
                    {loadMoreError && (
                        <p className="text-red-500">
                            {loadMoreError}
                        </p>
                    )}
                </div>
            </div>

        </div>
    )
}