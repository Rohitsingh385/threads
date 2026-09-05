
import { NotificationType } from "@prisma/client"
import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"
import { createNotification } from "../notification/notification.service.js"

export const followService = async (userId: string, username: string) => {

    const checkUserExists = await prisma.user.findFirst({
        where: {
            username: username
        }
    })
    if (!checkUserExists) {
        throw new ApiError(
            404,
            'user not found'
        )
    }
    if (checkUserExists.id === userId) {
        throw new ApiError(
            400,
            'cannot do self follow'
        )
    }
    const checkFollow = await prisma.follow.findUnique({
        where: {
            followingId_followerId: {
                followerId: userId,
                followingId: checkUserExists.id
            }
        }
    })
    if (checkFollow) {
        //unfollow
        const [unfollow] = await prisma.$transaction([

            prisma.follow.delete({
                where: {
                    followingId_followerId: {
                        followerId: userId,
                        followingId: checkUserExists.id
                    }
                }
            }),
            prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    followingCount: {
                        decrement: 1
                    }
                }
            }),
            prisma.user.update({
                where: {
                    id: checkUserExists.id
                },
                data: {
                    followerCount: {
                        decrement: 1
                    }
                }
            })
        ])
        return {
            unfollow,
            message: 'user unfollowed'
        }
    }

    const follow = await prisma.$transaction(async (tx) => {
        const follow = await tx.follow.create({
            data: {
                followerId: userId,
                followingId: checkUserExists.id
            }
        })
        const followingCount = await tx.user.update({
            where: {
                id: userId
            },
            data: {
                followingCount: {
                    increment: 1
                }
            }
        })
        const followerCount = await tx.user.update({
            where: {
                id: checkUserExists.id
            },
            data: {
                followerCount: {
                    increment: 1
                }
            }
        })
        await createNotification(tx, { recipientId: checkUserExists.id, actorId: userId, type: NotificationType.FOLLOW })
        return {
            follow,
            followingCount,
            followerCount
        }
    })
    return {
        follow,
        message: 'user followed'
    }
}

export const getFollowing = async (username: string) => {
    const checkUserExists = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (!checkUserExists) {
        throw new ApiError(
            404,
            'user not found'
        )
    }
    const following = await prisma.follow.findMany({
        where: {
            followerId: checkUserExists.id,
        },
        select: {
            followings: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                    bio: true
                }
            }
        }
    })
    return {
        following: following.map(follow => follow.followings),
        followingCount: checkUserExists.followingCount
    }
}

export const getFollowers = async (username: string) => {
    const checkUserExists = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (!checkUserExists) {
        throw new ApiError(
            404,
            'user not found'
        )
    }
    const followers = await prisma.follow.findMany({
        where: {
            followingId: checkUserExists.id
        },
        select: {
            followers: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                    bio: true
                }
            }
        }
    })
    return {
        followers: followers.map(follow => follow.followers),
        followersCount: checkUserExists.followerCount
    }
}

