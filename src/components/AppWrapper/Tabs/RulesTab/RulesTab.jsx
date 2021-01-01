import React, {useEffect, useState} from 'react';
import Table from '../../../Table/Table';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';
import ModalWrapper from '../../ModalWrapper/ModalWrapper';

export default function RulesTab({role}) {
  const [rules, setRules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

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
    setIsLoading(true);
    fetch('/get_all_rules')
    .then(res => res.json())
    .then(data => {
      console.log("data: " + JSON.stringify(data.rules, null, 4));
      setRules(data.rules);
    })
    .then(setIsLoading(false));
  }, [])

  function newRule() {
    setModalOpen(true);
  }

  return (
    <>
      { isLoading &&
        <Loading />
      }
      { !isLoading &&
        <>
          { role === 'admin' && 
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
