import React, { useEffect, useState } from 'react';
// import Table from '../../../Table/Table';
import Table from '../../../Table/Table';
// import { getLeague } from '../../../../api/yahooApi';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';
import ModalWrapper from '../../ModalWrapper/ModalWrapper';
import { getForumPosts } from '../../../../util/requests';
import { timeSince } from '../../../../util/time';

export default function ForumTab({user, posts, setPosts, getLatestData}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [needToUpdate, setNeedToUpdate] = useState(false);

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      Filter: SearchColumnFilter,
      width: '400px',
    },
    {
      Header: 'User',
      accessor: 'user',
      Filter: SearchColumnFilter,
    },
    {
      Header: 'Body',
      accessor: 'body',
      show: false
    },
    {
      Header: <div>{
        <span>
          Date Posted 
          <span className='timezoneInWords'>
            &nbsp;
            ({(Intl.DateTimeFormat().resolvedOptions().timeZone)})
          </span>
        </span>
      }</div>,
      accessor: 'create_date',
      disableFilters: true,
      Cell: row => <div>{timeSince(row.value)}</div>,
    },
  ]
  const tableState = { 
    hiddenColumns: ["body"]
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (needToUpdate === true) {
      getForumPosts(user, setPosts);
      setNeedToUpdate(false);
    }
    if (modalOpen === true) {
      setNeedToUpdate(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen])

  useEffect(() => {
    setIsLoading(true);
    getLatestData()
    setTimeout(function () {}, 1500) // set a delay so that the localStorage is available
    const forumData = localStorage.getItem('forumData');
    if (forumData && user) {
      console.log("Using cached data");
      let data = JSON.parse(forumData);
      setPosts(data.posts);
    }
    else {
      console.log("Getting new forum data");
      if (user) {
        getForumPosts(user, setPosts);    
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setPosts])

  function newForumPost() {
    setModalOpen(true);
  }

  return (
    <>
      { isLoading &&
        <Loading text="Loading Forum..." />
      }
      { !isLoading &&
        <>
          <button className='margin-15' onClick = {() => newForumPost()}>New post</button>
          <ModalWrapper 
            modalIsOpen={modalOpen}
            setIsOpen={setModalOpen}
            data=''
            modalType='newForumPost'
          />
          <Table
            user={user}
            data={posts}
            columns={columns}
            tableState={tableState}
            defaultColumn='create_date'
            tableType='forum'
          />
        </>
      }
    </>
  );
}
