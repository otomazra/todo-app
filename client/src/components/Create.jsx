import React, { useReducer, useState } from "react";
import axios from "axios";
// import circle from "../assets/add-circle.svg";

const initialState = { newText: "", inputToggle: false };

function reducer(state, action) {
  switch (action.type) {
    case "changed": {
      return { ...state, newText: action.payload };
    }
    case "toggled": {
      return { ...state, inputToggle: !state.inputToggle };
    }
    case "reset": {
      return { ...state, newText: "", inputToggle: false };
    }
    default:
      return state;
  }
}

function Create(props) {
  // const [newText, setNewText] = useState("");
  // const [inputToggle, setInputToggle] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (event) => {
    // setNewText(event.target.value);
    dispatch({ type: "changed", payload: event.target.value });
  };

  const handleCancel = () => {
    // setNewText("");
    // setInputToggle(false);
    dispatch({ type: "reset" });
  };

  const addText = async (event) => {
    event.preventDefault();
    try {
      // const result = await axios.post(
      //   props.URL + "/create",
      const result = await axios.post(
        `api/create`,
        {
          todo: state.newText,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );

      const data = result.data;
      if (data) {
        // setNewText("");
        dispatch({ type: "reset" });
        console.log("Success: ", data);
        // setInputToggle(false);
        // dispatch({type: 'toggled'});
        props.updateList();
      }
    } catch (error) {

      console.log("Error: ", error.message);
      
    }
  };

  return (
    <div className="create">
      {!state.inputToggle && (
        <button
          className="addButton"
          type="button"
          onClick={() => {
            dispatch({ type: "toggled" });
          }}
        >
          New Task
        </button>
      )}
      {state.inputToggle && (
        <form onSubmit={addText}>
          <input
            className="newTaskInput"
            type="text"
            onChange={handleChange}
            placeholder="Enter your task"
            value={state.newText}
          />
          <button type="submit" disabled={state.newText.length <= 1}>
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
