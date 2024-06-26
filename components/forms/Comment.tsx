'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useTheme } from '@/constants/ThemeProvider'
import { CommentSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createComments } from '@/lib/actions/comments.action'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import Image from 'next/image'
import { Editor } from '@tinymce/tinymce-react'
import { toast } from '../ui/use-toast'

interface Props {
  post: string
  postId: string
  authorId: string
  content:string
}

const Comment = ({ post, postId, authorId, content }: Props) => {
  const pathname = usePathname()
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mode } = useTheme()
  const editorRef = useRef(null)
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: ''
    }
  })

  const handleCreateAnswer = async (values: z.infer<typeof CommentSchema>) => {
    setIsSubmiting(true)

    try {
      await createComments({
        content: values.comment,
        author: JSON.parse(authorId),
        postid: JSON.parse(postId),
        path: pathname
      })

      if (editorRef.current) {
        const editor = editorRef.current as any

        editor.setContent('')
      }
      form.reset()
      return toast({
        title: 'Added an Comment successfull',
        description: 'wow you editing the questions!'
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmiting(false)
    }
  }
  return (
    <div>
      <div>
        <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <h4 className='paragraph-semibold text-dark400_light800'>
            {content}
          </h4>
          <Button
            className='btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 dark:text-primary-500'
            onClick={() => {}}
          >
            <Image
              src='/assets/icons/stars.svg'
              alt='star'
              width={12}
              height={12}
              className='object-contain'
            />
            Generate An Ai Answer
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form
          className='mt-6 flex w-full flex-col gap-10'
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name='comment'
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
}
export default Comment
