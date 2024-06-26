/* eslint-disable multiline-ternary */
'use client'

import { useTheme } from '@/constants/ThemeProvider'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  // MenubarSeparator,
  // MenubarShortcut,
  MenubarTrigger
} from '@/components/ui/menubar'
import Image from 'next/image'
import { themes } from '@/constants'

const Theme = () => {
  const { mode, setMode } = useTheme()

  const themHanlder = (item: any) => {
    setMode(item)
    if (item !== 'system') {
      localStorage.theme = item
    } else {
      localStorage.removeItem('theme')
    }
  }

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <Menubar className='shadow-none relative border-none bg-transparent'>
      <MenubarMenu>
        <MenubarTrigger
          className='data[state=open]:bg-light-900 focus:bg-light-900
        dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200'
        >
          {mode === 'light' ? (
            <Image
              src='/assets/icons/sun.svg'
              alt='sun'
              width={20}
              height={20}
              className='active-theme'
            />
          ) : (
            <Image
              src='/assets/icons/moon.svg'
              alt='moon'
              width={20}
              height={20}
              className='active-theme'
            />
          )}
        </MenubarTrigger>
        <MenubarContent className='absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300'>
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className='dark:focus:big-dark-400 flex items-center gap-4 px-2.5 py-2'
              onClick={() => themHanlder(item.value)}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={16}
                height={16}
                className={`${mode === item.value && 'active-theme'}`}
              />
              <p
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className={`body-semibold text-light-500 ${
                  mode === item.value
                    ? 'text-primary-500'
                    : 'text-dark100_light900'
                }`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
export default Theme
