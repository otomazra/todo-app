import axios from "axios";
import React, { useState, useEffect } from "react";
import TodoList from "./TodoList.jsx";
import Create from "./Create.jsx";

const receive = async (token, URL) => {
  console.log(token);
  const result = await axios.get("/api/"+URL+"/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = result.data;
  console.log(data);
  return data;
};

export default function Dashboard(props) {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [change, setChange] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await receive(props.token, props.URL);
        console.log(data);
        console.log("Type: ", typeof data);

        setList(data);
      } catch (err) {
        setError(err.message);
        console.log({ error: err.message });
      }
    };
    fetchData();
  }, [props.token, change]);

  //   useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await receive(props.token);
  //       console.log(data);
  //       console.log("Type: ",typeof(data));

  //       setList(data);
  //     } catch (err) {
  //       setError(err.message);
  //       console.log({ error: err.message });
  //     }
  //   };
  //   fetchData();
  // }, [change]);

  console.log("list", list);

  const handleChange = () => {
    setChange((prevChange) => prevChange + 1);
  };

  return (
    <div className="dashboard">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <TodoList URL={props.URL} token={props.token} change={handleChange} array={list} />
          <Create URL={props.URL} updateList={handleChange} token={props.token} />
        </>
      )}
    </div>
  );
}
