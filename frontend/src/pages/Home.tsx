import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState , useRef} from "react";
import { type Thread } from "../services/threadService";
import { getFeed } from "../services/feedService";
import { ThreadCard } from "../components/ThreadCard";
export function Home() {
    const { user } = useAuth()
    const [threads, setThreads] = useState<Thread[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [nextCursor, setnextCursor] = useState<string | null> (null)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loadMoreRef = useRef<HTMLDivElement | null>(null)
    const [loadMoreError, setLoadMoreError] = useState("")

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setIsLoading(true)
                setError("")

                const result = await getFeed({limit: 10})
                setThreads(result.data.data)
                setnextCursor(result.data.nextCursor)
                setHasNextPage(result.data.hasNextPage)
            } catch (error) {
                setError("Unable to load feed")

            } finally {
                setIsLoading(false)
            }
        }
        fetchFeed()
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]

            if(entry.isIntersecting){
                loadMore()
            }
        })

        const element = loadMoreRef.current
        if(element){
            observer.observe(element)
        }
        return () => {
            observer.disconnect()
        }
    }, [nextCursor, hasNextPage, isLoadingMore])

    const loadMore = async() => {
        if(!hasNextPage || !nextCursor || isLoadingMore) return 

        try{
            setIsLoadingMore(true)
            setLoadMoreError("")
            const result = await getFeed({
                limit: 10,
                cursor: nextCursor
            })
            setThreads(prev => [
                ...prev,
                ...result.data.data
            ])
            setnextCursor(result.data.nextCursor)
            setHasNextPage(result.data.hasNextPage)
        }catch(error){
            setLoadMoreError("Unable to load more threads")
        }finally{
            setIsLoadingMore(false)
        }
    }
    if(isLoading){
        return <p>Loading feed...</p>
    }

    if(error){
        return <p className="text-red-500">{error}</p>
    }
    if(threads.length === 0){
        return <p>No threads to show</p>
    }
    return (
        <div>
            <h1>Home</h1>
            <Link to={`/profile/${user?.username}`}>Profile</Link>

            <div className="mt-4">
                {threads.map((thread) => (
                    <ThreadCard
                        key={thread.id}
                        thread={thread}
                    />
                ))}
            </div>
            {hasNextPage && (
                <div
                    ref={loadMoreRef}
                    className="h-10"
                />
            )}
            {loadMoreError && (
                <p className="text-red-500">
                    {loadMoreError}
                </p>
            )}
            {hasNextPage && (
                <div
                    ref={loadMoreRef}
                    className="h-10"
                ></div>
            )}
            {isLoadingMore && (
                <p>Loading More...</p>
            )}
        </div>
    )
}