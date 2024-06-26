import { AnswerFilters } from '@/constants/filters'
import Filter from './Filter'
import { getAnswers } from '@/lib/actions/answer.action'
import Link from 'next/link'

import Image from 'next/image'
import { getTimestamp } from '@/lib/utils'
import ParseHTML from './ParseHTML'
import Voting from './Voting'
import { getQuestionsById, isQuestionAuthor } from '@/lib/actions/question.action'

interface Props {
  questionId: string
  userId: string
  qauthor:string
  totalAnswers: string
  page?: string
  filter?: string
}

const AllAnswer = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
  qauthor
}: Props) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter
  })

  const getQuestion = await getQuestionsById({
    questionId
  })

  const isAuthor = await isQuestionAuthor({
    questionid: questionId,
    userid: qauthor
  })

  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'> {totalAnswers} Answers</h3>

        {/* filters */}

        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {result?.answers.map((answer) => (
          <article
            key={answer._id}
            className='light-border justify-between border-b py-10'
          >
              <div className='mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className='flex flex-1 items-start gap-1 sm:items-center'
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt={`${answer.author.clerkId} profile`}
                    className='rounded-full object-cover max-sm:mt-0.5'
                  />
                  <div className='flex flex-col  sm:flex-row sm:items-center'>
                    <p className='body-semibold text-dark300_light700 mt-0.5'>
                      {answer.author.name}
                    </p>

                    <p className='small-regular text-light400_light500 ml-1 mt-1 line-clamp-1'>
                      answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className='flex items-center justify-end'>
                  <Voting
                    type='Answer'
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    hasupVoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    hasdownVoted={answer.downvotes.includes(userId)}
                    isAuth={isAuthor}
                    questionId={JSON.stringify(questionId)} answersId={JSON.stringify(answer._id)}
                    hasAccepted={getQuestion?.answered.includes(answer._id)}
                  />

                </div>
              </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  )
}
export default AllAnswer
