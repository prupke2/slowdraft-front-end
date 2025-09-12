import React from "react";
import "./AdminTab.css";
import AddKeeperTab from "./AddKeeperTab";
import AddPlayerToDBTab from "./AddPlayerToDBTab";
import MakePickTab from "./MakePickTab";
import AddDraftPickTab from "./AddDraftPickTab";
import { Switch, Route, Redirect } from "react-router-dom";
import NewDraftTab from "./NewDraftTab";
import AdminHomeTab from "./AdminHomeTab";
import NavHeader from "../../Navbar/NavHeader";

export default function AdminTab({ channel }) {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const cachedAdminTab = localStorage.getItem("adminTab");
  const defaultTabRoute = cachedAdminTab ? `/admin/${cachedAdminTab}` : "/admin/home";

  return (
    <div className="inner-navbar-tabs">
      <div className="admin-nav-wrapper">
        <ul className="admin-navtab-list">
          <NavHeader text="Home" link="/admin/home" innerTab />
          <NavHeader text="Add player to DB" link="/admin/add-player" innerTab />
          <NavHeader text="Add keeper" link="/admin/add-keeper" innerTab />
          <NavHeader text="Make pick" link="/admin/make-pick" innerTab />
          <NavHeader text="Add draft pick" link="/admin/add-pick" innerTab />
          <NavHeader text="New Draft" link="/admin/new-draft" innerTab />
        </ul>
      </div>
      <div className="admin-tab-wrapper">
        <Switch>
          {userInfo.role !== "admin" && <Redirect to="draft" />}
          <Route path="/admin/home">
            <AdminHomeTab userInfo={userInfo} />
          </Route>
          <Route path="/admin/add-player">
            <AddPlayerToDBTab />
          </Route>
          <Route path="/admin/add-keeper">
            <AddKeeperTab userInfo={userInfo} />
          </Route>
          <Route path="/admin/make-pick">
            <MakePickTab channel={channel} />
          </Route>
          <Route path="/admin/add-pick">
            <AddDraftPickTab userInfo={userInfo} />
          </Route>
          <Route path="/admin/new-draft">
            <NewDraftTab userInfo={userInfo} />
          </Route>
          <Redirect to={defaultTabRoute} />
        </Switch>
      </div>
    </div>
  );
}
