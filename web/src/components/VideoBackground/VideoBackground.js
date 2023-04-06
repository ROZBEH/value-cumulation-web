export const VideoBackground = ({ children }) => {
  return (
    <div className="video-background">
      <video autoPlay loop muted playsInline className="video">
        <source src="720p.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">{children}</div>
    </div>
  )
}
