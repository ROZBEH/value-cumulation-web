/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Private, Route, Set } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import MainLayout from 'src/layouts/MainLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={[MainLayout]}>
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        <Route path="/verification" page={VerificationPage} name="verification" />
        {/* <Route path="/verification-reset" page={VerificationResetPage} name="verificationReset" /> */}
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/contact" page={ContactPage} name="contact" />
        <Route path="/drafts" page={ContactPage} name="drafts" />
        <Private unauthenticated="login">
          <Route path="/profile" page={ProfilePage} name="profile" />
        </Private>

        {/* Wrap the following around anything that you'd like to make it private and need authentication
        <Private unauthenticated="about"> </Private> */}
        {/* <Private unauthenticated="login"> */}

        <Route path="/" page={HomePage} name="home" />

        {/* </Private> */}
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
