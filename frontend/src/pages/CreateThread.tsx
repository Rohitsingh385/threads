import { useState } from "react";
import { createThread } from "../services/threadService";


export function CreateThread(){

    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try{
            setIsSubmitting(true)
            await createThread({
                content
            })
            setContent("")
            setSuccess("Thread created successfully")
        }catch(error){
            setError("Failed to create thread")
        }finally{
            setIsSubmitting(false)
        }
    }
    return (
        <main className="mx-auto max-w-2xl px-4 py-6">
            <h1 className="mb-6 text-2xl font-bold">
                Create Thread 
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4" >
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="what's happening?"
                    rows={5}
                    className="w-full rounded border px-3 py-2"
                />
                <p className="text-right text-sm text-gray-500">
                    {content.length}/200
                </p>
                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-green-600">
                        {success}
                    </p>
                )}

                <button 
                    type="submit"
                    disabled={
                        isSubmitting || 
                        content.trim().length === 0 || 
                        content.length > 200
                    }
                    className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {isSubmitting ? "Posting...": "Post"}
                </button>
            </form>
        </main>
    )
}