import { useState } from "react"
import { FollowButton } from "./components/FollowButton"
import Navbar from "./components/Navbar"

function App() {
  const [follow, setFollow] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Threads" />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-4xl font-bold">Home</h1>
        <FollowButton
          initialFollowing={follow}
          toggleFollow={() => setFollow(prev => !prev)}
        />
      </main>
    </div>
  )
}

export default App