import { Profile } from '@prisma/client';
import {prisma ,Prisma} from '../../prismaClient';
import { NextFunction } from 'express';
export class ProfileService {
  async createProfile(data: Prisma.ProfileCreateInput, next: NextFunction): Promise<Partial<Profile> | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        const result = await tx.profile.create({
          data
        });
        return result;
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(profileId: string,next:NextFunction): Promise<Partial<Profile> | undefined> {
    try {
      const result = await prisma.profile.findUnique({
        where: { profileId }
      });
      if(!result){
        throw new Error('No profile found');
      }
      return result;
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(profileId: string, data: Prisma.ProfileUpdateInput,next:NextFunction): Promise<Partial<Profile> | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        return tx.profile.update({
          where: { profileId },
          data
        });
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(profileId: string,next:NextFunction): Promise<Partial<Profile> | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        return tx.profile.delete({
          where: { profileId }
        });
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProfiles(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProfileWhereInput;
    },next:NextFunction): Promise<Partial<Profile>[] | undefined> {
    try {
      const { skip, take, where } = params;
      return await prisma.profile.findMany({
        skip,
        take,
        where,
      });
    } catch (error) {
      next(error);
    }
  }
}
 