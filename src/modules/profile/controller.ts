import { Request, Response, NextFunction } from 'express'
import { ProfileService } from './services'

const profileService = new ProfileService()

export class ProfileController {
  async createProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const profile = await profileService.createProfile(req.body, next)
      res.status(201).json({ message: 'Profile created successfully', data: profile })
    } catch (error) {
      next(error)
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { profileId } = req.params
      const profile = await profileService.getProfileById(profileId, next)
      res.status(200).json({ message: 'Profile created successfully', data: profile })
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { profileId } = req.params
      const profile = await profileService.updateProfile(profileId, req.body, next)
      res.status(200).json({ message: 'Profile updated successfully', data: profile })
    } catch (error) {
      next(error)
    }
  }
 
  async getAllProfiles(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { skip, take, ...where } = req.query
      const profiles = await profileService.getAllProfiles(
        {
          skip: skip ? Number(skip) : undefined,
          take: take ? Number(take) : undefined,
          where: where || undefined
        },
        next
      )
      res.status(200).json({ message: 'Get all successfully', data: profiles })
    } catch (error) {
      next(error)
    }
  }
}

export const profileController = new ProfileController()
