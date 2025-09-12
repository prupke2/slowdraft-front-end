import React, { useEffect, useState } from "react";
import Table from "../../../Table/Table";
import { SearchColumnFilter } from "../../../Table/FilterTypes/FilterTypes";
import Loading from "../../../Loading/Loading";
import { ViewRuleModal, NewRuleModal } from "../../ModalWrapper/ModalWrappers";
import { getRules } from "../../../../util/requests";
import "./RulesTab.css";
import Emoji from "../../Emoji";

export default function RulesTab({ getLatestData }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [needToUpdate, setNeedToUpdate] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const [ruleData, setRuleData] = useState({ id: null });
  const [rules, setRules] = useState([]);

  function viewRuleModalHandler(post) {
    setRuleData(post);
    setViewModalOpen(true);
  }

  function editRuleHandler(post) {
    setRuleData(post);
    setCreateModalOpen(true);
  }

  useEffect(() => {
    if (createModalOpen === false) {
      setRuleData(null);
    }
  }, [createModalOpen]);

  useEffect(() => {
    if (viewModalOpen === false) {
      setRuleData(null);
    }
  }, [viewModalOpen]);

  useEffect(() => {
    const localStorageRules = localStorage.getItem('rulesData');
    if (localStorageRules) {
      setRules(localStorageRules);
    } else {
      getRules();
    }
  }, []);

  const columns = [
    {
      Header: "",
      accessor: "order",
      disableFilters: true,
      width: "10px",
    },
    {
      Header: "Rule",
      accessor: "title",
      Filter: SearchColumnFilter,
      disableSortBy: true,
      width: "400px",
      Cell: (cell) => (
        <div className="rule-cell">
          <div className="post-title">
            <div onClick={() => viewRuleModalHandler(cell.row.original)}>
              {cell.value}
            </div>
          </div>
          {user.role === "admin" && (
            <button
              className="small-button"
              onClick={() => editRuleHandler(cell.row.original)}
            >
              <Emoji emoji="✏️" />&nbsp;
              Edit
            </button>
          )}
        </div>
      ),
    },
    {
      Header: "Body",
      accessor: "body",
    },
  ];
  const tableState = {
    hiddenColumns: ["body", "order"],
    sortBy: [
      {
        id: "order",
        desc: false,
      },
    ],
    sortable: false,
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (needToUpdate === true) {
      getRules();
      setTimeout(() => {
        const rules = JSON.parse(localStorage.getItem("rulesData"));
        if (rules) {
          setRules(rules);
        }
      }, 1000);
      setNeedToUpdate(false);
    }
    if (createModalOpen === true) {
      setNeedToUpdate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModalOpen]);

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    setTimeout(function () {}, 1500);
    const rulesData = localStorage.getItem("rulesData");
    if (rulesData && user) {
      console.log("Using cached data");
      let data = JSON.parse(rulesData);
      setRules(data);
    } else {
      if (user) {
        console.log("Getting new rules data");
        getRules();
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loading text="Loading rules..." />}
      {!isLoading && (
        <>
          {user?.role === "admin" && (
            <>
              <button
                className="margin-15"
                onClick={() => setCreateModalOpen(true)}
              >
                New rule
              </button>
              <NewRuleModal
                modalIsOpen={createModalOpen}
                setIsOpen={setCreateModalOpen}
                user={user}
                data={ruleData}
              />
            </>
          )}
          {viewModalOpen && (
            <ViewRuleModal
              modalIsOpen={viewModalOpen}
              setIsOpen={setViewModalOpen}
              data={ruleData}
            />
          )}
          <Table
            user={user}
            data={rules}
            columns={columns}
            tableState={tableState}
            defaultColumn="order"
            tableType="rules"
            paginationTop
            paginationBottom
          />
        </>
      )}
    </>
  );
}
