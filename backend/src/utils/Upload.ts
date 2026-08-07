import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { env } from "../config/env.js"
import { ApiError } from "./ApiError.js"

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
})

export function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "threads" }, (error, result) => {
            if (error) {
                reject(error)
                return
            }
            if (error) {
                throw new ApiError(
                    400,
                    "cloudinary error"
                )
            }
            if (!result) {
                reject(new ApiError(400, "no cloudinary result"))
                return
            }
            resolve(result)
        })

        stream.end(buffer)

    })
}

export function deleteToCloudinary(publicId: string) {
    return cloudinary.uploader.destroy(publicId)
}