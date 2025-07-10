import React, {useContext, useState} from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyContext } from "./MyContext";

async function addText({todo, token}) {
  const response = await axios.post(
      `api/create`,
      {
        todo: todo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  console.log(response.data);
  return response.data;
}

export default function NewTodo (){

  const [newTodo, setNewTodo] = useState("");

    const {token} = useContext(MyContext);
    console.log(token);

function handleChange(e){
  const info = e.target.value;
  setNewTodo(info);
}

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addText,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["otara"]});
        }
    });

    function handleSubmit(event){
        event.preventDefault();
        const todo = event.target.elements.newTask.value;
        console.log("Submitting todo ", todo);
        mutation.mutate({todo, token});
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="newTask" onChange={handleChange} className="newTaskInput"/>
            <button disabled={newTodo.length<=2}>Add Task</button>
        </form>
    )
}