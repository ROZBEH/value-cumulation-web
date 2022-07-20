import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'
const MainLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  return (
    <>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header>
        <div className="flex-between">
          <h1 style={{ display: 'inline-block' }}>
            <Link to={routes.home()}>
              <img
                src="/logo-text.svg"
                className="Applogo"
                alt="logo"
                width="300"
              />
            </Link>
          </h1>
          {isAuthenticated ? (
            <div
              style={{
                marginTop: '2rem',
                float: 'right',
                verticalAlign: 'top',
                display: 'inline-block',
                alignItems: 'center',
              }}
            >
              Logged in as {currentUser.email}{' '}
              <button type="button" onClick={logOut}>
                Logout
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
        <nav>
          <ul>
            <li>
              <Link to={routes.home()}>Home</Link>
            </li>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
            <li>
              <Link to={routes.contact()}>Contact us</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default MainLayout
