import { useState } from "react";
import { searchUsers, type searchUser } from "../services/searchService";
import { Link } from "react-router-dom";

export const UserSearch = () => {
    const [ query, setQuery] = useState("")
    const [users, setUsers] = useState<searchUser[]>([])
    const [isloading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const handleSearch = async() => {
        if(!query.trim()){
            setUsers([])
            return 
        }

        try{
            setIsLoading(true)
            setError("")

            const result = await searchUsers(query.trim(),10,1)
            setUsers(result.data)
            setPage(1)
            setHasMore(result.data.length === 10)
        }catch(error){
            setError("Unable to seach Users")
        }finally{
            setIsLoading(false)
        }
    }   

    const loadMoreUsers = async() => {
        if(!hasMore || isLoadingMore || !query.trim()){
            return 
        }

        try{
            setIsLoadingMore(true)
            let nextPage = page + 1
            const result = await searchUsers(
                query.trim(),
                10,
                nextPage
            )
            setUsers(prev => [
                ...prev,
                ...result.data
            ])
            setPage(nextPage)
            setHasMore(result.data.length === 10)
        }catch(error){
            setError("Unable to load more users")
        }finally{
            setIsLoadingMore(false)
        }
    }
    return (
        <div className="mx-auto max-w-xl p-4">
            <h1 className="mb-4 text-2xl font-bold">
                search Users
            </h1>

            <div className="flex gap-2">
                <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search username..."
                className="flex-1 rounded border px-3 py-2"
                />

                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isloading}
                    className="rounded border px-4 py-2 disabled:opacity-50"
                >
                    {isloading ? "searching...": "Search"}    
                </button>
            </div>

            {error && (
                <p className="mt-4 text-red-500">
                    {error}
                </p>
            )}
            {!isloading && !error && query.trim() && users.length === 0  && (
                <p className="mt-4">
                    No users found.
                </p>
            )}

            <div className="mt-4 space-y-3">
                {users.map((user) => (
                    <Link
                    key={user.id}
                    to={`/profile/${user.username}`}
                    className="block rounded border p-3 hover:bg-gray-50">
                        <p className="font-medium">
                            @{user.username}
                        </p>

                        {user.bio && ( 
                            <p className="text-sm text-gray-600">
                                {user.bio}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
            {hasMore && (
                <button
                    type="button"
                    onClick={loadMoreUsers}
                    disabled={isLoadingMore}
                    className="mt-4 rounded border px-4 py-2 disabled:opacity-50"
                >
                    {isLoadingMore ? "Loading..." : "Load more"}
                </button>
            )}
        </div>
    )
}