import axios from "axios";
import React, { useState, useEffect, useReducer, useContext, createContext } from "react";
import TodoList from "./TodoList.jsx";
import Create from "./Create.jsx";
import { MyContext } from "./MyContext.js";
import {DashContext} from "./DashContext.js";

// const receive = async (token, URL) => {
const receive = async (token) => {

  console.log(token);
  const result = await axios.get(`api/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = result.data;
  console.log(data);
  return data;
};

const initialState = { list: [], error: "", change: null };

function reducer(state, action) {
  switch (action.type) {
    case "changed": {
      return { ...state, change: state.change + 1 };
    }
    case "listUpdated": {
      return {...state, list: action.payload};
    }
    case 'gotError': {
      return {...state, error: action.payload};
    }
    default: 
    return state;
  }
}

// export default function Dashboard(props) {
export default function Dashboard() {

  // const [list, setList] = useState([]);
  // const [error, setError] = useState("");
  // const [change, setChange] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {token} = useContext(MyContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await receive(token, props.URL);
        const data = await receive(token);
        console.log(data);
        console.log("Type: ", typeof data);

        // setList(data);
        dispatch({ type: "listUpdated", payload: data });
      } catch (err) {
        // setError(err.message);
        dispatch({type: 'gotError', payload: err});
        console.log({ error: err.message });
      }
    };
    fetchData();
  }, [token, state.change]);

  console.log("list", state.list);

  const handleChange = () => {
    // setChange((prevChange) => prevChange + 1);
    dispatch({ type: "changed" });
  };

  return (
    <div className="dashboard">
      {state.error ? (
        <p>{state.error}</p>
      ) : (
        <>
        <DashContext.Provider value={{change: handleChange, array: state.list}}>
          <TodoList
            // URL={props.URL}
            // token={token}
            // change={handleChange}
            // array={state.list}
          />
          <Create
            // URL={props.URL}
            // updateList={handleChange}
            // token={token}
          />
          </DashContext.Provider>
        </>
      )}
    </div>
  );
}
