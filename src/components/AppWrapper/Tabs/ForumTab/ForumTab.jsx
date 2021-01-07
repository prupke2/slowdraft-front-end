import React, {useEffect, useState} from 'react';
// import Table from '../../../Table/Table';
import Table from '../../../Table/Table';
// import { getLeague } from '../../../../api/yahooApi';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';
import ModalWrapper from '../../ModalWrapper/ModalWrapper';
import { getForumPosts } from '../../../../util/requests';

export default function ForumTab({user, posts, setPosts}) {
  const [modalOpen, setModalOpen] = useState(false);

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
      Header: 'Date Posted',
      accessor: 'create_date',
      disableFilters: true,
      Cell: row => <div>{new Date(row.value).toString().toLocaleString()}</div>,
    },
  ]
  const tableState = { 
    hiddenColumns: ["body"],
    sortBy: [
      {
        id: 'create_date',
        desc: false
      }
    ]
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

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
