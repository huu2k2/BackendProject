import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './services';

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await this.profileService.createProfile(req.body, next);
      res.status(201).json({ message: 'Profile created successfully', data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { profileId } = req.params;
      const profile = await this.profileService.getProfile(profileId, next);
      res.status(200).json({ data: profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { profileId } = req.params;
      const profile = await this.profileService.updateProfile(profileId, req.body, next);
      res.status(200).json({ message: 'Profile updated successfully', data: profile });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { profileId } = req.params;
      await this.profileService.deleteProfile(profileId, next);
      res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAllProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, take, ...where } = req.query;
      const profiles = await this.profileService.getAllProfiles({
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined,
        where: where || undefined
      }, next);
      res.status(200).json({ data: profiles });
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();