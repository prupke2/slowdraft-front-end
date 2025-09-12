import Emoji from "../Emoji";
import { NavLink } from "react-router-dom";

const NavHeader = ({ emoji, text, link, innerTab=false }) => {
  const mainWindow = document.querySelector("main");
  const goToTop = () => mainWindow.scrollTop = 0;
  return (
    <li className={`navtab ${innerTab ? "navtab-inner" : ""}`} onClick={goToTop}>
      <NavLink to={link} activeClassName="active">
        {emoji && <Emoji navbar={true} emoji={emoji} />}
        <div className="nav-text">{text}</div>
      </NavLink>
    </li>
  );
}

export default NavHeader
