'use server'

import { connectionToDatabase } from '../mongoose'
import { FilterQuery } from 'mongoose'
import User from '@/database/user.question'
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams
} from './shared.types'
import { revalidatePath } from 'next/cache'
import Question from '@/database/question.model'
import Tag from '@/database/tags.question'
import Answer from '@/database/answer.model'

export async function getUserById (params: any) {
  try {
    connectionToDatabase()

    const { userId } = params

    const user = await User.findOne({ clerkId: userId })
    return user
  } catch (error) {
    console.log(error)
  }
}

// this a demo comment
// this a seccond comment

export async function createUser (userData: CreateUserParams) {
  try {
    connectionToDatabase()

    const newUser = await User.create(userData)
    return newUser
  } catch (error) {
    console.log(error)
  }
}
export async function updateUser (params: UpdateUserParams) {
  try {
    connectionToDatabase()

    const { clerkId, updateData, path } = params

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    })
    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}
export async function deleteUser (params: DeleteUserParams) {
  try {
    await connectionToDatabase()

    const { clerkId } = params

    const user: any = await User.findOneAndDelete({ clerkId })

    if (!user) {
      throw new Error('User not found')
    }

    // eslint-disable-next-line no-unused-vars
    // const userQuestionsIds = await Question.find({ author: user._id }).distinct(
    //   '_id'
    // )

    await Question.deleteMany({ author: user._id })

    // @todo: Later delete user answers, comments, and other related data if needed

    const deletedUser = await User.findByIdAndDelete(user._id)

    return deletedUser
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete user')
  }
}

export async function getAllUsers (params: GetAllUsersParams) {
  try {
    connectionToDatabase()

    // const { page = 1, pageSize = 20, filter, searchQuery } = params

    const users = await User.find({}).sort({ createdAt: -1 })

    return { users }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function toggleSaveQuestion (params: ToggleSaveQuestionParams) {
  try {
    connectionToDatabase()

    const { userId, questionId, path } = params

    const user = await User.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }
    const isQuestionsSaved = user.saved.includes(questionId)

    if (isQuestionsSaved) {
      // remove the questionid from the saved instance
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      )
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getSavedQuestions (params: GetSavedQuestionsParams) {
  try {
    connectionToDatabase()
    // page = 1, pageSize = 10, filter, gonna use later
    const { clerkId, searchQuery } = params
    /**
     * query for searching fitler who saved the items or not
     *
     */
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {}

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    })

    if (!user) {
      throw new Error('user not found')
    }

    const savedQuestions = user.saved

    return { question: savedQuestions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserinfo (params: GetUserByIdParams) {
  try {
    connectionToDatabase()
    const { userId } = params

    const user = await User.findOne({ clerkId: userId })

    if (!user) throw new Error('user not found')

    const totalQuestions = await Question.countDocuments({ author: user._id })
    const totalAnswer = await Answer.countDocuments({ author: user._id })

    return { user, totalAnswer, totalQuestions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// export async function getAllUsers(params:GetAllUsersParams) {

//   try {
//     connectionToDatabase()
//   } catch (error) {
//       console.log(error)
//       throw error
//   }

// }
