import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryResponse {
  url: string
  publicId: string
}

export const createImage = async (image: string): Promise<CloudinaryResponse> => {
  const result = await cloudinary.uploader.upload(image, {
    folder: 'upload-image',
    overwrite: true,
    invalidate: true,
    width: 150,
    crop: 'scale'
  })
  return {
    url: result.secure_url,
    publicId: result.public_id
  }
}
// delete image
export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId)
}
// update image
export const updateImage = async (publicId: string, image: string): Promise<CloudinaryResponse> => {
  const result = await cloudinary.uploader.upload(image, {
    public_id: publicId,
    overwrite: true,
    folder: 'upload-image'
  })
  return {
    url: result.secure_url,
    publicId: result.public_id
  }
}
// get image by publicId
export const getImage = async (publicId: string): Promise<string> => {
  const result = await cloudinary.api.resource(publicId)
  return result.secure_url
}

export default cloudinary
