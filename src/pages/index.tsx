import { Fragment } from 'react'
import { PageProps } from 'gatsby'
import React from 'react'
import sflogo from '../assets/sflogo.svg'
import { Button, Dropdown, Menu, Navbar, Theme } from 'react-daisyui'
import { SearchContainer } from '../components/SearchContainer'


const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Home', href: '#', current: true },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      <Theme dataTheme='dark'>
        <Navbar className='bg-base-100 shadow-xl rounded-box'>
          <Navbar.Start>
            <a className="btn btn-ghost normal-case text-xl">Starfield Library</a>
          </Navbar.Start>
        </Navbar>

        <SearchContainer></SearchContainer>
      </Theme>
    </>
  )
}

export default IndexPage

// export const Head: HeadFC = () => <title>Home Page</title>
