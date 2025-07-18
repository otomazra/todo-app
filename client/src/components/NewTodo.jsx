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
        onMutate: async(variables)=>{
          const {todo, token} = variables;
          await queryClient.cancelQueries(["todos"]);
          const previousTodos = queryClient.getQueryData(["todos"]);
          queryClient.setQueryData(["todos"], (old)=>{console.log("updating cache"); return [todo, ...old]});
          console.log("Here is updated cache: ", previousTodos);
          return {previousTodos};
        },
        onError: (err, variables, context) =>{
          queryClient.setQueryData(["todos"], context.previousTodos);
        },
        onSettled: ()=>{
            queryClient.invalidateQueries({queryKey: ["todos"]});
        }
    });

    function handleSubmit(event){
        event.preventDefault();
        const todo = event.target.elements.newTask.value;
        console.log("Submitting todo ", todo);
        mutation.mutate({todo, token});
        setNewTodo("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="newTask" onChange={handleChange} value={newTodo} className="newTaskInput"/>
            <button disabled={newTodo.length<=2}>Add Task</button>
        </form>
    )
}