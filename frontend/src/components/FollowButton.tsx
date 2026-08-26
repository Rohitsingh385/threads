
import { Button } from "./Button"
interface FollowButtonProps {
    initialFollowing: boolean
    toggleFollow: () => void
}
export function FollowButton({ initialFollowing, toggleFollow }: FollowButtonProps) {


    return (
        <Button onClick={toggleFollow}>
            {initialFollowing ? 'Following' : 'Follow'}
        </Button>

    )
}