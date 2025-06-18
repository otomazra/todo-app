import React from "react";
import axios from "axios";
import { useState, useReducer, useContext } from "react";
import {DashContext} from "./DashContext.js";
import { MyContext } from "./MyContext.js";

const initialState={editId: null, newTodo: ''};

function reducer(state, action){
  switch (action.type){
    case 'toggledEdit': {
      console.log("New text: ", state.newTodo);
      return ({...state, editId: action.id, newTodo: action.todo});
    }
    case "changed": {
      return ({...state, newTodo: action.value});
    }
    case 'reset': {
      return ({...state, editId: null});
    }
    default: {
      return state;
    }
  }

}

// export default function TodoList(props) {
export default function TodoList() {

  const {change, array} = useContext(DashContext);
  const {token} = useContext(MyContext);
  // const [editId, setEditId] = useState(null);
  // const [newTodo, setNewTodo] = useState("");
  // const [editId, setEditId] = useState(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEditToggle = (todo) => {
    dispatch({type: 'toggledEdit', id: todo.id, todo: todo.todo});
    // setNewTodo(todo.todo);
    dispatch({type: 'edited', todo: todo.todo});
    console.log("New text: ", newTodo);
  };

  const handleChange = (event) => {
    // setNewTodo(event.target.value);
    dispatch({type: 'changed', value: event.target.value});
  };

  // const passEditId = (id)=>{
  //   setEditId(id);
  // }

  // const removeEditId = ()=>{
  //   setEditId(null);
  // }

  console.log("TodoList is working");

  const handleDelete = async (id) => {
    console.log("handleDelete is working");
    const result = await axios.delete(`api/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = result.data;
    console.log(result);
    console.log(data);
    change();
  };

  const handleEdit = async (event, id) => {
    event.preventDefault();
    console.log("handleEdit started working");
    const result = await axios.patch(
      `api/update/${id}`,
      {
        newTodo: state.newTodo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result.data);
    // setEditId(null);
    dispatch({type: "reset"});
    change();
  };

  // const array = props.array;
  const list = array.map((todo) => {
    return (
      <div className="todoListDiv" key={todo.id}>
        {state.editId === todo.id ? (
          <>
            <form
              onSubmit={(event) => {
                handleEdit(event, todo.id);
              }}
            >
              <input
                className="updateIntup"
                name="updateInput"
                onChange={handleChange}
                value={state.newTodo}
              />
              <div className="buttonClass">
                <button>Update</button>
                <button
                  type="button"
                  onClick={() => {
                    // setEditId(null);
                    dispatch({type: 'reset'});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p>{todo.todo}</p>
            <button
              onClick={() => {
                handleEditToggle(todo);
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                handleDelete(todo.id);
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    );
  });

  return <>{list}</>;
}
