/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { Link, routes } from '@redwoodjs/router'

export const TabSignup = () => {
  return (
    <div className="flex flex-col mx-10 my-10">
      <div className="mb-5">
        Please sign up to access more features on our website. Thank you.
      </div>
      <button
        type="button"
        className="text-gray-900 w-48 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-md px-3 py-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      >
        <Link to={routes.signup()}>Lets Begin Here</Link>
      </button>
    </div>
  )
}
