'use server'

import User from '@/database/user.question'
import {
  GetAllTagsParams,
  GetQuestionByIdParams,
  GetTopInteractedTagsParams
} from './shared.types'
import { connectionToDatabase } from '../mongoose'
import Tag, { ITag } from '@/database/tags.question'

import { FilterQuery } from 'mongoose'
import Question from '@/database/question.model'
import Blog from '@/database/blog.model'

export async function getTopInterectedTags (params: GetTopInteractedTagsParams) {
  try {
    connectionToDatabase()

    return ['a', 'b']
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllTags (params: GetAllTagsParams) {
  try {
    connectionToDatabase()
    const { searchQuery, filter } = params

    const query: FilterQuery<typeof Tag> = {}

    /**
     * { name: 'Popular', value: 'popular' },
  { name: 'Recent', value: 'recent' },
  { name: 'Name', value: 'name' },
  { name: 'Old', value: 'old' }
     */

    let sortOptions = {}

    switch (filter) {
      case 'popular':
        sortOptions = { question: -1 }
        break
      case 'recent':
        sortOptions = { createdAt: -1 }
        break
      case 'name':
        sortOptions = { name: 1 }
        break
      case 'old':
        sortOptions = { createdAt: -1 }
        break
      default:
        break
    }

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }]
    }
    const tags = await Tag.find(query).sort(sortOptions)

    return { tags }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionsByTagId (params: GetQuestionByIdParams) {
  try {
    connectionToDatabase()

    const { tagId, searchQuery } = params // page = 1, pageSize = 10

    const tagFilter: FilterQuery<ITag> = { _id: tagId }

    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: 'questions',
        model: Question,
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: 'i' } }
          : {},
        options: {
          sort: { createdAt: -1 }
        },
        populate: [
          { path: 'tags', model: Tag, select: '_id name' },
          { path: 'author', model: User, select: '_id clerkId name picture' }
        ]
      })
      .populate({
        path: 'blogs',
        model: Blog,
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: 'i' } }
          : {},
        options: {
          sort: { createdAt: -1 }
        },
        populate: [
          { path: 'tags', model: Tag, select: '_id name' },
          { path: 'author', model: User, select: '_id clerkId name picture' }
        ]
      })

    if (!tag) {
      throw new Error('Tag not found')
    }

    const questionsTags = tag.questions
    const blogsTags = tag.blogs
    const questions = [...questionsTags, ...blogsTags]

    return { tagtitle: tag.name, questions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getTopPopularTags () {
  try {
    connectionToDatabase()
    const popularTags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          numberOfQuestions: {
            $add: [{ $size: '$questions' }, { $size: '$blogs' }]
          }
        }
      },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 }
    ])

    return popularTags
  } catch (error) {
    console.log(error)
  }
}
