'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormControl } from '../ui/form'

import { AnswerSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from '@/constants/ThemeProvider'
import { Button } from '../ui/button'
import { createAnswer } from '@/lib/actions/answer.action'
import { usePathname } from 'next/navigation'
import { toast } from '../ui/use-toast'

interface Props {
  question: string
  questionId: string
  authorId: string
  content:string
}

const Answer = ({ question, questionId, authorId, content }: Props) => {
  const pathname = usePathname()
  const [isSubmiting, setIsSubmiting] = useState(false)
  // const [isSubmitingAi, setIsSubmitingAi] = useState(false)
  const { mode } = useTheme()
  const editorRef = useRef(null)
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: ''
    }
  })

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmiting(true)

    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname
      })

      form.reset()

      if (editorRef.current) {
        const editor = editorRef.current as any

        editor.setContent('')
      }

      return toast({
        title: 'Added an Answer to Question successfull',
        description: 'wow you added Answer !'
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmiting(false)
    }
  }

  // const generateAiAnswer = async () => {
  //   if (!authorId) return
  //   console.log('funtion is called')
  //   setIsSubmitingAi(true)

  //   try {
  //     console.log('trying to fetch ai')
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
  //         method: 'POST',
  //         body: JSON.stringify({ question })
  //       }
  //     )

  //     const aiAnswer = await response.json()
  //     alert(aiAnswer.reply)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsSubmitingAi(false)
  //   }
  // }
  return (
    <div>
      <div>
        <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <h4 className='paragraph-semibold text-dark400_light800'>
            {content}
          </h4>
          {/* <Button
            className='btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 dark:text-primary-500'
            onClick={generateAiAnswer}
          >
            <Image
              src='/assets/icons/stars.svg'
              alt='star'
              width={12}
              height={12}
              className='object-contain'
            />
            Generate Ai Answer
          </Button> */}
        </div>
      </div>
      <Form {...form}>
        <form
          className='mt-6 flex w-full flex-col gap-10'
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name='answer'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3 '>
                <FormControl className='mt-3.5'>
                  <Editor
                    // we will use env in prod
                    apiKey='1x8nevlh5yx7pbaw5gscn0grh7s8jwtg8n4kd5abphj23fxk'
                    onInit={(evt, editor) =>
                      // @ts-ignore
                      (editorRef.current = editor)
                    }
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'codesample',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table'
                      ],
                      toolbar:
                        'undo redo | blocks | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist  ',
                      content_style:
                        'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light'
                    }}
                  />
                </FormControl>
                {/* <FormMessage className='text-red-500' /> */}
              </FormItem>
            )}
          />

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='primary-gradient w-fit text-white'
              disabled={isSubmiting}
            >
              {isSubmiting ? 'submitting' : 'submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
  // something in the way
}
export default Answer
