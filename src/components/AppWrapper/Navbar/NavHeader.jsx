import { Fragment } from "react"
import Emoji from "../Emoji";

const NavHeader = ({ emoji, text }) => {
  const mainWindow = document.querySelector("main");
  const goToTop = () => mainWindow.scrollTop = 0;
  return (
    <Fragment>
      <Emoji navbar={true} emoji={emoji} />
      <div onClick={goToTop}>{text}</div>
    </Fragment>
  );
}

export default NavHeader
