import React from "react";
import axios from "axios";
import { useState } from "react";

export default function TodoList(props) {
  const [editId, setEditId] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  // const [editId, setEditId] = useState(null);

  const handleEditToggle = (todo) => {
    setEditId(todo.id);
    setNewTodo(todo.todo);
    console.log("New text: ", newTodo);
  };

  const handleChange = (event) => {
    setNewTodo(event.target.value);
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
    const result = await axios.delete(`/api/${props.URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    });
    const data = result.data;
    console.log(result);
    console.log(data);
    props.change();
  };

  const handleEdit = async (event, id) => {
    event.preventDefault();
    console.log("handleEdit started working");
    const result = await axios.patch(
      `/api/${props.URL}/update/${id}`,
      {
        newTodo: newTodo,
      },
      {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      }
    );
    console.log(result.data);
    setEditId(null);
    props.change();
  };

  const array = props.array;
  const list = array.map((todo, index) => {
    return (
      <div className="todoListDiv" key={todo.id}>
        {editId === todo.id ? (
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
                value={newTodo}
              />
              <div className="buttonClass">
                <button>Update</button>
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
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
