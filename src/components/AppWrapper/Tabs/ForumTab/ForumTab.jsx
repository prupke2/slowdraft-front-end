import React, { useEffect, useState } from 'react';
import Table from '../../../Table/Table';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';
import { ViewForumPost, NewForumPost } from '../../ModalWrapper/ModalWrappers';
import { getForumPosts } from '../../../../util/requests';
import { timeSince, adjustOffset } from '../../../../util/time';
import UsernameStyled from '../../UsernameStyled/UsernameStyled';
import './ForumTab.css';

export default function ForumTab({user, posts, setPosts, getLatestData}) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [forumPost, setForumPost] = useState({id: null});
  
  function forumModal(post) {
    console.log(`post: ${JSON.stringify(post, null, 4)}`);
    setForumPost(post);
    setViewModalOpen(true);
  }

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      Filter: SearchColumnFilter,
      width: '400px',
      Cell: cell => 
        <div className='post-title'>
          <div onClick={() => forumModal(cell.row.original)}>
            {cell.value}
          </div>
        </div>
    },
    {
      Header: 'User',
      accessor: 'user',
      Filter: SearchColumnFilter,
      Cell: cell => 
        <UsernameStyled
          username={cell.row.original.username}
          color={cell.row.original.color}
          teamId={cell.row.original.yahoo_team_id}
        />
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
      Cell: row => <div title={adjustOffset(row.value)}>{timeSince(row.value)}</div>,
    },
  ]
  const tableState = { 
    hiddenColumns: ["body"]
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (needToUpdate === true) {
      getForumPosts(setPosts);
      setNeedToUpdate(false);
    }
    if (createModalOpen === true) {
      setNeedToUpdate(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModalOpen])

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
        getForumPosts(setPosts);    
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPosts])

  return (
    <>
      { isLoading &&
        <Loading text="Loading Forum..." />
      }
      { !isLoading &&
        <>
          <button className='margin-15' onClick = {() => setCreateModalOpen(true)}>New post</button>
          { createModalOpen &&
            <NewForumPost 
              modalIsOpen={createModalOpen}
              setIsOpen={setCreateModalOpen}
            />
          }
          { viewModalOpen &&
            <ViewForumPost
              modalIsOpen={viewModalOpen}
              setIsOpen={setViewModalOpen}
              post={forumPost}
            />
          }
          <Table
            user={user}
            data={posts}
            columns={columns}
            tableState={tableState}
            defaultColumn='create_date'
            tableType='forum'
            paginationTop
            paginationBottom
          />
        </>
      }
    </>
  );
}
