import React from "react"
import Modal from "react-aria-modal"

interface Props {
  isOpen: boolean
  onExit: () => void
  onSubmit: (value: string) => void
}
const NewGroupModal: React.FC<Props> = ({ isOpen, onExit, onSubmit }) => {
  const [value, setValue] = React.useState("")
  function handleSubmit(e: any) {
    e.preventDefault()

    onSubmit(value)
    onExit()
  }
  if (!isOpen) {
    return <></>
  }
  return (
    <Modal titleText="Delete message" onExit={onExit} verticallyCenter>
      <form
        style={{
          width: "50%",
          height: "50%",
          minWidth: 400,
          minHeight: 400,
          backgroundColor: "#f5f5f5",
        }}
        onSubmit={handleSubmit}>
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
      </form>
    </Modal>
  )
}
export default NewGroupModal
