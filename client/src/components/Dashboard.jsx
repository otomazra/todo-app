import axios from "axios";
import React, { useState, useEffect, useReducer, useContext, createContext } from "react";
import TodoList from "./TodoList.jsx";
// import Create from "./Create.jsx";
import NewTodo from "./NewTodo.jsx";
import {useQuery} from "@tanstack/react-query";
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
  console.log("List print", data);
  return data;
};

// const initialState = { list: [], error: "", change: null };

// function reducer(state, action) {
//   switch (action.type) {
//     case "changed": {
//       return { ...state, change: state.change + 1 };
//     }
//     case "listUpdated": {
//       return {...state, list: action.payload};
//     }
//     case 'gotError': {
//       return {...state, error: action.payload};
//     }
//     default: 
//     return state;
//   }
// }

// export default function Dashboard(props) {
export default function Dashboard() {

  // const [list, setList] = useState([]);
  // const [error, setError] = useState("");
  // const [change, setChange] = useState(null);
  // const [state, dispatch] = useReducer(reducer, initialState);
  const {token} = useContext(MyContext);

  const {data, isLoading, error} = useQuery({
    queryKey: ["todos"],
    queryFn: ()=>receive(token),
  })

  if(isLoading) return <p>Loading...</p>;
  if(error) return <p>Error: {error.message}</p>;


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // const data = await receive(token, props.URL);
  //       const data = await receive(token);
  //       console.log(data);
  //       console.log("Type: ", typeof data);

  //       // setList(data);
  //       dispatch({ type: "listUpdated", payload: data });
  //     } catch (err) {
  //       // setError(err.message);
  //       dispatch({type: 'gotError', payload: err});
  //       console.log({ error: err.message });
  //     }
  //   };
  //   fetchData();
  // }, [token, state.change]);

  // console.log("list", state.list);
  console.log(data);

  // const handleChange = () => {
    // setChange((prevChange) => prevChange + 1);
    // dispatch({ type: "changed" });
  // };

  return (
    <div className="dashboard">
      {/* {state.error ? (
        <p>{state.error}</p> */}
        {error ? (
        <p>{error.message}</p>
      ) : (
        <>
        {/* <DashContext.Provider value={{change: handleChange, array: state.list}}> */}
        <DashContext.Provider value={{ array: data}}>
          <TodoList
            // URL={props.URL}
            // token={token}
            // change={handleChange}
            // array={state.list}
          />
          <NewTodo
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
