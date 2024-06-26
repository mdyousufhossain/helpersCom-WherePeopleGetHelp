import Questions from '@/components/forms/Questions'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata : Metadata = {
  title: 'Ask Questions | HelpersCom',
  description: 'HelpersCom is community where developer living in harmony'

}
const Page = async () => {
  const { userId } = auth()

  if (!userId) redirect('/sign-in')
  //  getting user id
  const mongoUser = await getUserById({ userId })

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Ask a Questions</h1>
      <div className='mt-9'>
        <Questions mongoUserId={JSON.stringify(mongoUser._id)} questionDetails={''} />
      </div>
    </div>
  )
}

export default Page
