import React, { useEffect, useState } from 'react';
import Table from '../../../Table/Table';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';
import ModalWrapper from '../../ModalWrapper/ModalWrapper';
import { getRules } from '../../../../util/requests';

export default function RulesTab({user, rules, setRules, getLatestData}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const columns = [
    {
      Header: '',
      accessor: 'order',
      disableFilters: true,
      width: '10px',
    },
    {
      Header: 'Rule',
      accessor: 'title',
      Filter: SearchColumnFilter,
      width: '400px',
    },
    {
      Header: 'Body',
      accessor: 'body'
    },
  ]
  const tableState = { 
    hiddenColumns: ['body', 'order'],
    sortBy: [
      {
        id: 'order',
        desc: false
      }
    ],
    sortable: false
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (needToUpdate === true) {
      getRules(setRules);
      setNeedToUpdate(false);
    }
    if (modalOpen === true) {
      setNeedToUpdate(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen])
  
  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    setTimeout(function () {}, 1500) // set a delay so that the localStorage is available
    const rulesData = localStorage.getItem('rulesData');
    if (rulesData && user) {
      console.log("Using cached data");
      let data = JSON.parse(rulesData);
      setRules(data.rules);
    }
    else {
      console.log("Getting new forum data");
      if (user) {
        getRules(setRules);
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRules])


  function newRule() {
    setModalOpen(true);
  }

  return (
    <>
      { isLoading &&
        <Loading text="Loading rules..." />
      }
      { !isLoading &&
        <>
          { user.role === 'admin' && 
            <>
              <button className='margin-15' onClick = {() => newRule()}>New rule</button>
              <ModalWrapper 
                modalIsOpen={modalOpen}
                setIsOpen={setModalOpen}
                data=''
                modalType='newRule'
              />
            </>
          }
          <Table
            user={user}
            data={rules}
            columns={columns}
            tableState={tableState}
            defaultColumn='order'
            tableType='rules'
          />
        </>
      }
    </>
  );
}
