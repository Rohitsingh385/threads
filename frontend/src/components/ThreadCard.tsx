import type { Thread } from "../services/threadService";
import { Link } from "react-router-dom";
interface ThreadCardProps {
    thread: Thread
}

export function ThreadCard({ thread }: ThreadCardProps) {
    return (
        <Link to={`/threads/${thread.id}`}>
            <article className="rounded-lg border p-4 mb-3">
                <p className="whitespace-pre-wrap">
                    {thread.content}
                </p>
                <div className="mt-3 flex gap-4 text-sm text-gray-500">
                    <span>
                        {thread.likesCount} likes
                    </span>
                    <span>
                        {thread.commentsCount} comments
                    </span>
                </div>
            </article>
        </Link>
    )
}