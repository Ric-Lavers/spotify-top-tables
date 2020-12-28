import React from "react";
import Modal from "react-aria-modal";

import * as S from "./Modal.style";

interface Props {
  isOpen: boolean;
  onExit: () => void;
  onSubmit: (value: string) => void;
}
const NewGroupModal: React.FC<Props> = ({ isOpen, onExit, onSubmit }) => {
  const [value, setValue] = React.useState("");
  function handleSubmit(e: any) {
    e.preventDefault();

    onSubmit(value);
    onExit();
  }
  if (!isOpen) {
    return <></>;
  }
  return (
    <Modal titleText="Delete message" onExit={onExit} verticallyCenter>
      <S.Form onSubmit={handleSubmit}>
        <label>
          <p>
            Enter new group name <i>(one word)</i>?
          </p>
          <input
            type="text"
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
          />
        </label>
        <input id="new-group__submit" type="submit" />
      </S.Form>
    </Modal>
  );
};
export default NewGroupModal;
