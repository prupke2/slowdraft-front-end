import Emoji from "../Emoji";

const NavHeader = ({ emoji, text }) => {
  const mainWindow = document.querySelector("main");
  const goToTop = () => mainWindow.scrollTop = 0;
  return (
    <span onClick={goToTop}>
      <Emoji navbar={true} emoji={emoji} />
      <div className="nav-text">{text}</div>
    </span>
  );
}

export default NavHeader
