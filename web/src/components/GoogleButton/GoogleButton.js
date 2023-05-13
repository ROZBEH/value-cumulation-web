import {
  GoogleProviders,
  requestGoogle,
} from 'src/components/GoogleButton/utils/google'

const GoogleButtons = () => {
  return (
    <>
      {GoogleProviders.map((v) => (
        <button
          className={`btn btn-${v}`}
          key={v}
          onClick={requestGoogle(v)}
          type="button"
        >
          <i className={`fab fa-${v}`}></i>
          <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
        </button>
      ))}
    </>
  )
}

export default GoogleButtons
