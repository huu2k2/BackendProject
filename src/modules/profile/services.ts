import { IProfile } from './interface'
import { prisma, Prisma } from '../../prismaClient'
import { NextFunction } from 'express'
import { ApiError } from '../../middleware/error.middleware'
export class ProfileService {
  async createProfile(data: IProfile, next: NextFunction): Promise<IProfile | undefined> {
    try {
      if (data.accountId === null) {
        throw new ApiError(400, 'accountId cannot be null')
      }

      const newProfile = await prisma.profile.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          cccd: data.cccd,
          accountId: data.accountId
        }
      })

      if (!newProfile) {
        throw new ApiError(400, 'Failed to create customer account')
      }

      return newProfile
    } catch (error) {
      throw error
    }
  }

  async getProfileById(profileId: string, next: NextFunction): Promise<IProfile | undefined> {
    try {
      const result = await prisma.profile.findUnique({
        where: { profileId }
      })
      if (!result) {
        throw new ApiError(400, 'No profile found')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async updateProfile(profileId: string, data: IProfile, next: NextFunction): Promise<IProfile | undefined> {
    try {
      const existingProfile = await prisma.profile.findFirst({
        where: {
          OR: [{ cccd: data.cccd }, { phoneNumber: data.phoneNumber }],
          NOT: { profileId }
        }
      })

      if (existingProfile) {
        throw new ApiError(400, 'CCCD or phoneNumber already exists')
      }

      const updateProfile = await prisma.profile.update({
        where: { profileId },
        data: data
      })
      if (!updateProfile) {
        throw new ApiError(400, 'Failed to update profile')
      }
      return updateProfile
    } catch (error) {
      throw error
    }
  }

  // async deleteProfile(profileId: string, next: NextFunction): Promise<IProfile | undefined> {
  //   try {
  //     return await prisma.$transaction(async (tx) => {
  //       return tx.profile.delete({
  //         where: { profileId }
  //       })
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  async getAllProfiles(
    params: {
      skip?: number
      take?: number
      where?: Prisma.ProfileWhereInput
    },
    next: NextFunction
  ): Promise<IProfile[] | undefined> {
    try {
      const { skip, take, where } = params
      const profiles = await prisma.profile.findMany({
        skip,
        take,
        where
      })
      return profiles
    } catch (error) {
      throw error
    }
  }
}
