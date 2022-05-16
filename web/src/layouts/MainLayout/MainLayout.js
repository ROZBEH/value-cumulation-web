import { Link, routes } from '@redwoodjs/router'
const MainLayout = ({ children }) => {
  return (
    <>
      <header>
        <Link to={routes.home()}>
          <p>
            <img
              src="/logo-text.svg"
              className="Applogo"
              alt="logo"
              width="300"
            />
          </p>
        </Link>
        <nav>
          <ul>
            <li>
              <Link to={routes.home()}>Home</Link>
            </li>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default MainLayout
