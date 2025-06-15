import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import TodoList from "./TodoList.jsx";
import Create from "./Create.jsx";

const receive = async (token, URL) => {
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
  }
}

export default function Dashboard(props) {
  // const [list, setList] = useState([]);
  // const [error, setError] = useState("");
  // const [change, setChange] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await receive(props.token, props.URL);
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
  }, [props.token, state.change]);

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
          <TodoList
            URL={props.URL}
            token={props.token}
            change={handleChange}
            array={state.list}
          />
          <Create
            URL={props.URL}
            updateList={handleChange}
            token={props.token}
          />
        </>
      )}
    </div>
  );
}
