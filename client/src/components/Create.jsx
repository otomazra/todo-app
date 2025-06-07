import React, { useState } from "react";
import axios from "axios";
// import circle from "../assets/add-circle.svg";

function Create(props) {
  const [newText, setNewText] = useState("");
  const [inputToggle, setInputToggle] = useState(false);

  const handleChange = (event) => {
    setNewText(event.target.value);
  };

  const handleCancel = () => {
    setNewText("");
    setInputToggle(false);
  };

  const addText = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post(
        "/api/" + props.URL + "create",
        {
          todo: newText,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );

      const data = result.data;
      if (data) {
        setNewText("");
        console.log("Success: ", data);
        setInputToggle(false);
        props.updateList();
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  return (
    <div className="create">
      {!inputToggle && (
        <button
          className="addButton"
          type="button"
          onClick={() => {
            setInputToggle(true);
          }}
        >
          New Task
        </button>
      )}
      {inputToggle && (
        <form onSubmit={addText}>
          <input
            className="newTaskInput"
            type="text"
            onChange={handleChange}
            placeholder="Enter your task"
            value={newText}
          />
          <button type="submit" disabled={newText.length <= 1}>
            Add
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default Create;
