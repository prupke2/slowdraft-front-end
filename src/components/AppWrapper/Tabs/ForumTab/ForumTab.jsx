import React, {useEffect, useState} from 'react';
// import Table from '../../../Table/Table';
import Table from '../../../Table/Table';
// import { getLeague } from '../../../../api/yahooApi';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';

export default function ForumTab() {
  const empty = {"": ""};
  const [posts, setPosts] = useState([empty]);
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
      Filter: SearchColumnFilter,
    },
  ]
  const tableState = { 
    hiddenColumns: ["body"]
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
    <React.Fragment>
      <Table
        data={posts}
        columns={columns}
        tableState={tableState}
        defaultColumn='create_date'
      />
      {/* <button onClick={}>test</button> */}
    </React.Fragment>
  );
}
