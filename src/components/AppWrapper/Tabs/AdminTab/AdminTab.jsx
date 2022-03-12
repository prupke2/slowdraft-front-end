import React from 'react';
import './AdminTab.css';
import AddKeeperTab from './AddKeeperTab';
import AddPlayerToDBTab from './AddPlayerToDBTab';
import MakePickTab from './MakePickTab';
import AddDraftPickTab from './AddDraftPickTab';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';

export default function AdminTab() {

  const userInfo = JSON.parse(localStorage.getItem('user'));
  const cachedAdminTab = localStorage.getItem('adminTab');
  const defaultTabRoute = cachedAdminTab ? `/admin/${cachedAdminTab}` : '/admin/add-player';
  console.log(`userInfo: ${JSON.stringify(userInfo, null, 4)}`);
  return (
    <div className="navbar-tabs inner-navbar-tabs">
      <ul className='navtab-list'>
        <li className='navtab'>
          <NavLink to='/admin/add-player' activeClassName='active'>
            <div className="inner-tab">Add player to DB</div>
          </NavLink>
        </li>
        <li className='navtab'>
          <NavLink to='/admin/add-keeper' activeClassName='active'>
            <div className="inner-tab">Add keeper</div>
          </NavLink>  
        </li>
        <li className='navtab'>
          <NavLink to='/admin/make-pick' activeClassName='active'>
            <div className="inner-tab">Make pick</div>
          </NavLink>
        </li>
        <li className='navtab'>
          <NavLink to='/admin/add-pick' activeClassName='active'>
            <div className="inner-tab">Add draft pick</div>
          </NavLink>
         
        </li>
      </ul>
      <div className='admin-tab-wrapper'>
        <Switch>
          { userInfo.role !== 'admin' &&
            <Redirect to='draft' />
          }
          <Route path='/admin/add-player'>
            <AddPlayerToDBTab />
          </Route>
          <Route path='/admin/add-keeper'>
            <AddKeeperTab 
              userInfo={userInfo}
            />   
          </Route>
          <Route path='/admin/make-pick'>
            <MakePickTab
              userInfo={userInfo}
            />
          </Route>
          <Route path='/admin/add-pick'>
            <AddDraftPickTab
              userInfo={userInfo}
            />
          </Route>
          <Redirect to={defaultTabRoute} />
        </Switch>
      </div>
    </div>
  );
}

