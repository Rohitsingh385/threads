import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { deleteThread, getThread, updateThread, type Thread as ThreadData } from "../services/threadService";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types/comment";
import { createComment, getComments } from "../services/commentService";
import { toggleFollow } from "../services/followService";

export function Thread() {
    const { id } = useParams<{ id: string }>()
    const [thread, setThread] = useState<ThreadData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [comments, setComments] = useState<Comment[]>([])
    const [isCommentsLoading, setIsCommentsLoading] = useState(false)
    const [commentsError, setCommentsError] = useState("")
    const [commentContent, setCommentContent] = useState("")
    const [isCreatingComment, setIsCretingComment] = useState(false)
    const [createCommentError, setCreateCommentError] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    const [isCreatingReply, setIsCreatingReply] = useState(false)
    const [replyError, setReplyError] = useState("")
    const [replies, setReplies] = useState<Record<string, Comment[]>>({})
    const [loadingReplies, setLoadingReplies] = useState<string | null>(null)
    const [repliesError, setRepliesError] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [isFollowLoading, setIsFollowLoading] = useState(false)
    const [followError, setFollowError] = useState("")



    const { user } = useAuth()
    const isOwner = user?.username === thread?.author?.username

    useEffect(() => {
        const fetchThread = async () => {
            if (!id) return

            try {
                setIsLoading(true)
                setError("")
                const result = await getThread(id)
                console.log("thread", result)
                setThread(result.data.thread)
                setEditContent(result.data.thread.content)
                setIsFollowing(result.data.isFollowingAuthor)
            } catch (error) {
                setError("Unable to load thread")
            } finally {
                setIsLoading(false)
            }
        }
        fetchThread()
    }, [id])

    useEffect(() => {
        const fetchComments = async () => {
            if (!id) return
            try {
                setIsCommentsLoading(true)
                setCommentsError("")

                const result = await getComments(id, {
                    limit: 2
                })
                setComments(result.data.data)
            } catch (error) {
                setCommentsError("Unable to load comments")
            } finally {
                setIsCommentsLoading(false)
            }
        }
        fetchComments()
    }, [id])

    if (isLoading) {
        return <p>Loading thread...</p>
    }
    if (error) {
        return <p className="text-red-500">{error}</p>
    }
    if (!thread) {
        return <p>Thread not found</p>
    }

    const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!id) return

        const content = commentContent.trim()
        if (!content) return

        try {
            setIsCretingComment(true)
            setCreateCommentError("")

            const result = await createComment(id, content)

            setComments(prev => [
                result.data,
                ...prev
            ])
            setCommentContent("")
        } catch (error) {
            setCreateCommentError("Unable to create comment")
        } finally {
            setIsCretingComment(false)
        }
    }

    const handlCreateReply = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!id || !replyingTo) return

        const content = replyContent.trim()
        if (!content) return

        try {
            setIsCreatingReply(true)
            setReplyError("")

          const result = await createComment(
                id,
                content,
                replyingTo
            )
            setReplies(prev => ({
                ...prev,
                [replyingTo]: [
                    ...(prev[replyingTo] ?? []),
                    result.data
                ]
            }))
            setReplyContent("")
            setReplyingTo(null)
        } catch (error) {
            setReplyError("Unable to create reply")
        } finally {
            setIsCreatingReply(false)
        }
    }
    const fetchReplies = async (commentId: string) => {
        if (!id) return
        try {
            setLoadingReplies(commentId)
            setRepliesError("")
            const result = await getComments(id, {
                parentId: commentId,
                limit: 2
            })
            setReplies(prev => ({
                ...prev,
                [commentId]: result.data.data
            }))
        } catch (error) {
            setRepliesError("Unable to load replies")
        } finally {
            setLoadingReplies(null)
        }
    }

    const handleToggleFollow  = async() => {
        if(!thread?.author?.username) return 

        try{
            setIsFollowLoading(true)
            setFollowError("")

            await toggleFollow(thread.author.username)

            setIsFollowing(prev => !prev)

        }catch(error){
            setFollowError("Unable to update follow status")
        }finally{
            setIsFollowLoading(false)
        }
    }
    return (
        <main className="mx-auto max-w-2xl px-4 py-6">
            <article className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                    <p className="font-medium">
                        @{thread.author?.username}
                    </p>
                    <button
                        type="button"
                        onClick={handleToggleFollow}
                        disabled={isFollowLoading}
                        className="rounded border px-3 py-1 disabled:opacity-50"
                    >
                        {isFollowLoading
                         ? "..."
                         : isFollowing 
                            ? "Following"
                            : "Follow"
                        }
                    </button>
                </div>
                {
                    followError && (
                        <p className="text-red-500">
                            {followError}
                        </p>
                    )
                }
                <p className="whitespace-pre-wrap">
                    {thread.content}
                </p>
                {isEditing ? (
                    <div className="mt-4 space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="w-full rounded border px-3 py-2"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={async () => {
                                    try {
                                        setIsUpdating(true)
                                        const result = await updateThread(
                                            thread.id,
                                            {
                                                content: editContent
                                            }
                                        )
                                        setThread(result.data.thread)
                                        setEditContent(result.data.thread.content)
                                        setIsEditing(false)
                                    } catch (error) {
                                        setError("Unable to update thread")
                                    } finally {
                                        setIsUpdating(false)
                                    }
                                }}
                                disabled={
                                    isUpdating ||
                                    editContent.trim().length === 0 ||
                                    editContent.length > 200
                                }
                                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                            >
                                {isUpdating ? "Saving.." : "Save"}
                            </button>

                            <button
                                onClick={() => {
                                    setEditContent(thread.content)
                                    setIsEditing(false)
                                }}
                                disabled={isUpdating}
                                className="rounded border px-4 py-2"
                            >Cancel</button>
                        </div>
                    </div>
                ) : (
                    isOwner && (
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 rounded border px-4 py-2">
                                Edit
                            </button>
                            <button
                                onClick={async () => {
                                    const confirmed = window.confirm("Are you sure you want to delete this thread")
                                    if (!confirmed) return

                                    try {
                                        setIsDeleting(true)
                                        setError("")

                                        await deleteThread(thread.id)

                                        window.history.back()
                                    } catch (error) {
                                        setError("unable to delete thread")
                                    } finally {
                                        setIsDeleting(false)
                                    }
                                }}
                                disabled={isDeleting}
                                className="mt-4 rounded border px-4 py-2"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )
                )}

                <div className="mt-3 text-sm text-gray">
                    {thread.likesCount} likes
                </div>
                <section className="mt-6">
                    <form onSubmit={handleCreateComment} className="mt-4 space-y-2">
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="write a comment..."
                            maxLength={100}
                            rows={3}
                            className="w-full rounded border px-3 py-2"
                        />
                        <button
                            type="submit"
                            disabled={
                                isCreatingComment ||
                                commentContent.trim().length === 0 ||
                                commentContent.length > 100
                            }
                            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {isCreatingComment ? "Posting..." : "Comment"}
                        </button>
                    </form>
                    {createCommentError && (
                        <p className="text-red-500">
                            {createCommentError}
                        </p>
                    )}
                    <h2 className="text-lg font-semibold">
                        Comments
                    </h2>
                    {isCommentsLoading && (
                        <p>Loading comments...</p>
                    )}
                    {commentsError && (
                        <p className="text-red-500">
                            {commentsError}
                        </p>
                    )}
                    {!isCommentsLoading &&
                        !commentsError &&
                        comments.length === 0 && (
                            <p>No comments yet.</p>
                        )}

                    {!isCommentsLoading &&
                        comments.length > 0 && (
                            <div className="mt-4 space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id}>
                                        <p className="font-medium">
                                            @{comment.userId}
                                        </p>
                                        <p>
                                            {comment.content}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReplyingTo(comment.id)
                                            }}>Reply</button>

                                        {replyingTo === comment.id && (

                                            <form onSubmit={handlCreateReply}
                                                className="mt-2 space-y-2">
                                                <textarea
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder={`Reply to @${comment.userId}...`}
                                                    maxLength={100}
                                                    rows={2}
                                                    className="w-full rounded border px-3 py-2"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        isCreatingReply ||
                                                        replyContent.trim().length === 0
                                                    }
                                                    className="rounded bg-black px-3 py-1 text-white disabled:opacity-50"
                                                >
                                                    {isCreatingReply ? "Replying..." : "Reply"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyingTo(null)
                                                        setReplyContent("")
                                                    }}>
                                                    Cancel
                                                </button>
                                            </form>
                                        )}
                                        {!replies[comment.id] && (
                                            <button
                                            type="button"
                                            onClick={() => fetchReplies(comment.id)}
                                            disabled={loadingReplies === comment.id}
                                            >
                                                {loadingReplies === comment.id ? "Loading replies..." : "View replies"}
                                            </button>
                                        )}
                                        {replies[comment.id] && (
                                            <div className="ml-6 mt-3 space-y-3">
                                                {replies[comment.id].length === 0 ? (
                                                    <p>No replies yet.</p>
                                                ): (
                                                    replies[comment.id].map((reply) => (
                                                        <div key={reply.id}>
                                                            <p className="font-medium">
                                                                @{reply.username}
                                                            </p>
                                                            <p>
                                                                {reply.content}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>

                                ))}

                            </div>
                        )}
                </section>
            </article>
        </main>
    )
}