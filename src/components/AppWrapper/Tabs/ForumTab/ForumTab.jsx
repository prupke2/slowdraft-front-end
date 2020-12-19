import React, {useEffect, useState} from 'react';
// import Table from '../../../Table/Table';
import Table from '../../../Table/Table';
// import { getLeague } from '../../../../api/yahooApi';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';

export default function ForumTab() {
  const [posts, setPosts] = useState([]);
  const columns = [
    {
      Header: 'Post Title',
      accessor: 'title',
      Filter: SearchColumnFilter,
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
    fetch('/get_forum_posts')
    .then(res => res.json())
    .then(data => {
      console.log("data: " + JSON.stringify(data.posts, null, 4));
      setPosts(data.posts);
    })
    .then(setIsLoading(false));
  }, [])

  return (
    <>
      { isLoading &&
        <Loading />
      }
      { !isLoading &&
        <Table
          data={posts}
          columns={columns}
          tableState={tableState}
          defaultColumn='create_date'
          tableType='forum'
        />
      }
    </>
  );
}
