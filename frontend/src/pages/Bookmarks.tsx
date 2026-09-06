import { use, useEffect, useState } from "react";

import { getBookmarks, type BookmarkThread } from "../services/bookmarkService";

export const Bookmarks = () => {
    const [threads, setThreads] = useState<BookmarkThread[]>([])
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasNextPage, setHasNextPage] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState("")

    useEffect(()=> {
        const fetchBookmarks = async()=> {
            try{
                setIsLoading(true)
                setError("")

                const result = await getBookmarks()
                setThreads(result.data.data)
                setNextCursor(result.data.nextCursor)
                setHasNextPage(result.data.hasNextPage)
            }catch(error){
                setError("Unable to load bookmarks")
            }finally{
                setIsLoading(false)
            }
        }
        fetchBookmarks()
    }, [])

    useEffect(()=> {
        const observer = new IntersectionObserver(
            entries => {
                if(entries[0].isIntersecting){
                    loadMoreBookmarks()
                }
            },
            {
                threshold: 1
            }
        )

        const element = document.getElementById("bookmarks-loader")
        if(element){
            observer.observe(element)
        }
        return () => {
            observer.disconnect()
        }
    }, [nextCursor, hasNextPage, isLoadingMore])
    const loadMoreBookmarks = async() => {
        if(!hasNextPage || !nextCursor || isLoadingMore) return

        try{
            setIsLoadingMore(true)
            const result = await getBookmarks(10, nextCursor)

            setThreads(prev => [
                ...prev,
                ...result.data.data
            ])
            setNextCursor(result.data.nextCursor)
            setHasNextPage(result.data.hasNextPage)

        }catch(error){
            setError("Unable to load more bookmarks")
        }finally{
            setIsLoadingMore(false)
        }
    }
    return(
        <div>
            <h1>Bookmarks</h1>

            {isLoading && <p>Loading Bookmarks</p>}
            {error && <p>{error}</p>}

            {!isLoading && !error && threads.length === 0 && (
                <p>You haven't bookmarked anything yet.</p>
            )}
            {threads.map((thread)=> (
                <div key={thread.id}>
                    <p>@{thread.author.username}</p>
                    <p>{thread.content}</p>
                </div>
            ))}
            <div id="bookmarks-loader">
            {isLoadingMore && <p>Loading more...</p>}
            </div>
        </div>
    )
}
