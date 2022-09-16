/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'
const MainLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  return (
    <>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 4000 }} />
      <header className="bg-slate-100 sticky top-0 z-50 rounded-b-xl">
        <nav className="flex items-center justify-between flex-wrap bg-gold-800 p-6">
          <div>
            <Link to={routes.home()}>
              <img
                src="/logo-text.svg"
                className="Applogo"
                alt="logo"
                width="200"
              />
            </Link>
          </div>

          <div className="text-sm sm:flex-grow">
            <div className="block mt-4 sm:inline-block sm:mt-0 text-base text-lime-700 hover:text-orange-900 mr-8">
              <Link to={routes.home()}>Home</Link>
            </div>
            <div className="block mt-4 sm:inline-block sm:mt-0 text-base text-lime-700 hover:text-orange-900 mr-8">
              <Link to={routes.about()}>About</Link>
            </div>
            <div className="block mt-4 sm:inline-block sm:mt-0 text-base text-lime-700 hover:text-orange-900 mr-8">
              <Link to={routes.contact()}>Contact us</Link>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="block mt-4 sm:inline-block sm:mt-0 text-base text-lime-700 mr-8">
              <Link to={routes.profile()}>{currentUser.email} </Link>
              <button
                onClick={logOut}
                type="button"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="block mt-4 sm:inline-block sm:mt-0 text-base text-lime-700 mr-8">
              <button
                type="button"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <Link to={routes.login()}>Login</Link>
              </button>
            </div>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default MainLayout
