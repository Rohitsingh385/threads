import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { deleteThread, getThread, updateThread, type Thread as ThreadData } from "../services/threadService";
import { useAuth } from "../context/AuthContext";

export function Thread() {
    const { id } = useParams<{ id: string }>()
    const [thread, setThread] = useState<ThreadData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const { user } = useAuth()
    const isOwner = user?.username === thread?.author?.username
    useEffect(() => {
        const fetchThread = async () => {
            if (!id) return

            try {
                setIsLoading(true)
                setError("")

                const result = await getThread(id)
                setThread(result.data.thread)
                setEditContent(result.data.thread.content)
            } catch (error) {
                setError("Unable to load thread")
            } finally {
                setIsLoading(false)
            }
        }
        fetchThread()
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
    return (
        <main className="mx-auto max-w-2xl px-4 py-6">
            <article className="rounded-lg border p-4">
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
            </article>
        </main>
    )
}