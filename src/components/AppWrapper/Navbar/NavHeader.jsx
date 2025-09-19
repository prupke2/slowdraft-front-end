import { scrollToTop } from "../../../util/util";
import Emoji from "../Emoji";
import { NavLink } from "react-router-dom";

const NavHeader = ({ emoji, text, link, innerTab=false }) => (
    <li className={`navtab ${innerTab ? "navtab-inner" : ""}`} onClick={() => scrollToTop()}>
      <NavLink to={link} activeClassName="active">
        {emoji && <Emoji navbar={true} emoji={emoji} />}
        <div className="nav-text">{text}</div>
      </NavLink>
    </li>
  );

export default NavHeader
