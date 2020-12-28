import React from "react";

import * as S from "./TopTables.style";

const GroupSelect: React.FC<{
  isLoading: boolean;
  groupList: { id: string; name: string }[];
  isGroupModalOpen: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  send: (str: string, data?: object) => void;
}> = ({ isLoading, groupList, isGroupModalOpen, onChange, send }) => {
  const toggleEvent = isGroupModalOpen ? "CLOSE_MODAL" : "OPEN_MODAL";
  const toggleLabel = isGroupModalOpen ? "CLOSE" : "New Group";

  const handleOpenModal = () => {
    console.log(toggleEvent);

    send(toggleEvent);
  };
  const OpenButton = () =>
    isLoading ? (
      <></>
    ) : (
      <S.Button onClick={handleOpenModal}>{toggleLabel}</S.Button>
    );
  if (groupList.length)
    return (
      <>
        <OpenButton />
        <select onChange={onChange}>
          <option value={""}>yours</option>
          {groupList.map(({ id, name }) => (
            <option value={id}>{name + " " + id}</option>
          ))}
        </select>
      </>
    );

  return <OpenButton />;
};

export default GroupSelect;
