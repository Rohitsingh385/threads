import { useEffect, useState } from "react";

import { getBookmarks, type BookmarkThread } from "../services/bookmarkService";
import { ThreadCard } from "../components/ThreadCard";

export const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkThread[]>([])
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
                setBookmarks(result.data.data)
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

            setBookmarks(prev => [
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

            {!isLoading && !error && bookmarks.length === 0 && (
                <p>You haven't bookmarked anything yet.</p>
            )}
            {bookmarks.map((bookmark)=> (
                <ThreadCard 
                key={bookmark.id}
                thread={bookmark.thread}
                />
            ))}
            <div id="bookmarks-loader">
            {isLoadingMore && <p>Loading more...</p>}
            </div>
        </div>
    )
}
