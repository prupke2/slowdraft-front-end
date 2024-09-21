import Emoji from "../Emoji";
import { NavLink } from "react-router-dom";

const NavHeader = ({ emoji, text, link, }) => {
  const mainWindow = document.querySelector("main");
  const goToTop = () => mainWindow.scrollTop = 0;
  return (
    <li className="navtab" onClick={goToTop}>
      <NavLink to={link} activeClassName="active">
        <Emoji navbar={true} emoji={emoji} />
        <div className="nav-text">{text}</div>
      </NavLink>
    </li>
  );
}

export default NavHeader
