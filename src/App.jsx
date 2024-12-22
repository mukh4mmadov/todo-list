import React, { useState, useEffect } from "react";

const App = () => {
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [archived, setArchived] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem("todo")) || [];
    const savedInProgress =
      JSON.parse(localStorage.getItem("inProgress")) || [];
    const savedCompleted = JSON.parse(localStorage.getItem("completed")) || [];
    const savedArchived = JSON.parse(localStorage.getItem("archived")) || [];

    setTodo(savedTodo);
    setInProgress(savedInProgress);
    setCompleted(savedCompleted);
    setArchived(savedArchived);
  }, []);

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todo));
    localStorage.setItem("inProgress", JSON.stringify(inProgress));
    localStorage.setItem("completed", JSON.stringify(completed));
    localStorage.setItem("archived", JSON.stringify(archived));
  }, [todo, inProgress, completed, archived]);

  const addTask = () => {
    if (newTaskText.trim() !== "") {
      const newTask = { task: newTaskText, date: new Date().toLocaleString() };
      setTodo([...todo, newTask]);
      setNewTaskText("");
    }
  };

  const moveTask = (task, from, to, setFrom, setTo) => {
    setFrom(from.filter((t) => t !== task));
    setTo((prev) => [...prev, task]);
  };

  const editTask = (index, newTask) => {
    const updatedTasks = [...todo];
    updatedTasks[index].task = newTask;
    setTodo(updatedTasks);
    setIsModalOpen(false);
    setNewTaskText("");
  };

  const deleteTask = (task, from, setFrom) => {
    setFrom(from.filter((t) => t !== task));
  };

  const openModal = (task, index) => {
    setCurrentTask(index);
    setNewTaskText(task.task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTaskText("");
  };

  const Card = ({ task, from, to, setFrom, setTo, section, index }) => {
    const handleMove = () => {
      if (section === "todo") {
        moveTask(task, todo, inProgress, setTodo, setInProgress);
      } else if (section === "inProgress") {
        moveTask(task, inProgress, completed, setInProgress, setCompleted);
      } else if (section === "completed") {
        moveTask(task, completed, archived, setCompleted, setArchived);
      }
    };

    const handleEdit = () => {
      openModal(task, index);
    };

    const handleDelete = () => {
      deleteTask(task, from, setFrom);
    };

    return (
      <div className="border p-4 rounded-md my-2 bg-white">
        <div className="flex justify-between">
          <p>{task.task}</p>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="text-yellow-500 text-sm"
              title="Taskni tahrirlash"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 text-sm"
              title="Taskni o'chirish"
            >
              🗑️
            </button>
          </div>
        </div>
        <small className="text-gray-500">{task.date}</small>
        <div className="mt-2">
          <button onClick={handleMove} className="text-blue-500 text-sm">
            {section === "todo"
              ? "Jarayonda"
              : section === "inProgress"
              ? "Bajarilgan"
              : section === "completed"
              ? "Arxivga"
              : ""}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          id="todo"
          className="bg-gray-200 p-4 rounded-md flex flex-col"
          style={{ minHeight: "200px" }}
        >
          <h2 className="text-xl font-semibold">Tasklar</h2>
          {todo.map((task, index) => (
            <Card
              key={index}
              task={task}
              from={todo}
              to={inProgress}
              setFrom={setTodo}
              setTo={setInProgress}
              section="todo"
              index={index}
            />
          ))}
        </div>

        <div
          id="inProgress"
          className="bg-blue-200 p-4 rounded-md flex flex-col"
          style={{ minHeight: "200px" }}
        >
          <h2 className="text-xl font-semibold">Jarayonda</h2>
          {inProgress.map((task, index) => (
            <Card
              key={index}
              task={task}
              from={inProgress}
              to={completed}
              setFrom={setInProgress}
              setTo={setCompleted}
              section="inProgress"
              index={index}
            />
          ))}
        </div>

        <div
          id="completed"
          className="bg-green-200 p-4 rounded-md flex flex-col"
          style={{ minHeight: "200px" }}
        >
          <h2 className="text-xl font-semibold">Bajarilgan</h2>
          {completed.map((task, index) => (
            <Card
              key={index}
              task={task}
              from={completed}
              to={archived}
              setFrom={setCompleted}
              setTo={setArchived}
              section="completed"
              index={index}
            />
          ))}
        </div>

        <div
          id="archived"
          className="bg-gray-500 p-4 rounded-md flex flex-col"
          style={{ minHeight: "200px" }}
        >
          <h2 className="text-xl font-semibold">Arxivlangan</h2>
          {archived.map((task, index) => (
            <Card
              key={index}
              task={task}
              from={archived}
              to={archived}
              setFrom={setArchived}
              setTo={setArchived}
              section="archived"
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Yangi task"
          className="border p-2 w-full"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 mt-2 w-full rounded"
        >
          Task qo'shish
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-11/12 sm:w-1/3">
            <h2 className="text-xl mb-4">Taskni tahrirlash</h2>
            <input
              type="text"
              className="border p-2 w-full"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => editTask(currentTask, newTaskText)}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Saqlash
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded w-full sm:w-auto"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
