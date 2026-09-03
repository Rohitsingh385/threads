import { useState } from "react";
import type { Thread } from "../services/threadService";
import { Link } from "react-router-dom";
import { toggleLike } from "../services/likeService";

interface ThreadCardProps {
    thread: Thread
}

export function ThreadCard({ thread }: ThreadCardProps) {

    const [isLiked, setIsLiked] = useState(thread.isLiked)
    const [likesCount, setLikesCount] = useState(thread.likesCount)
    const [isLikeLoading, setIsLikeLoading] = useState(false)
    const [likeError, setLikeError] = useState("")

    const handleLike = async () => {
        if(isLikeLoading) return 

        try{

            setIsLikeLoading(true)
            setLikeError("")

            const result = await toggleLike(thread.id)
            setIsLiked(result.data.liked)
            setLikesCount(result.data.likesCount)

        }catch(error){
            setLikeError("Unable to update like")
        }finally{
            setIsLikeLoading(false)
        }
    }
    return (
        <Link to={`/threads/${thread.id}`}>
            <article className="rounded-lg border p-4 mb-3">
                <p className="whitespace-pre-wrap">
                    {thread.content}
                </p>
                <div className="mt-3 flex gap-4 text-sm text-gray-500">
                    <button
                    onClick={handleLike}
                    disabled={isLikeLoading}
                    >
                        {isLiked ? "Unlike" : "Like"} {likesCount}
                    </button>
                    {likeError && (
                        <p className="text-red-500">
                            {likeError}
                        </p>
                    )}
                    <span>
                        {thread.commentsCount} comments
                    </span>
                </div>
            </article>
        </Link>
    )
}