"use client";
import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  TODO: "todo",
};


const TodoItem = ({ todo, index, toggleTodo, moveTodo, theme }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TODO,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TODO,
    hover: (item) => {
      if (item.index !== index) {
        moveTodo(item.index, index);
        item.index = index;
      }
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center p-4 border-b border-gray-200 ${
        theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div
        onClick={() => toggleTodo(todo.id)}
        className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center mr-4 ${
          todo.completed
            ? "bg-gradient-to-r from-blue-400 to-purple-500 border-none"
            : theme === "dark"
            ? "border-gray-500"
            : "border-gray-300"
        }`}
      >
        {todo.completed && (
          <img src={"/images/icon-check.svg"} alt="check" className="w-3 h-3" />
        )}
      </div>

      <span
        className={`flex-1 ${
          todo.completed
            ? "line-through text-gray-400"
            : theme === "dark"
            ? "text-gray-300"
            : "text-gray-700"
        }`}
      >
        {todo.text}
      </span>
    </div>
  );
};

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete online JavaScript course", completed: false },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
    { id: 6, text: "Complete Todo App on Frontend Mentor", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(() => {
 
    return typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light";
  });


  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    setTodos([
      ...todos,
      { id: todos.length + 1, text: newTodo, completed: false },
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const moveTodo = (fromIndex, toIndex) => {
    const updatedTodos = [...todos];
    const [movedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedTodo);
    setTodos(updatedTodos);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`relative min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
 
        <div className="absolute inset-0">
          <img
            src={
               "/images/bg-desktop-light.jpg"
            }
            alt="background"
            className="w-full h-64 object-cover"
          />
        </div>

     
        <div className="relative max-w-xl mx-auto pt-16 px-4">
      
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white tracking-widest">
              TODO
            </h1>
            <button onClick={toggleTheme}>
              <img
                src={
                  theme === "dark"
                    ? "/images/icon-sun.svg"
                    : "/images/icon-moon.svg"
                }
                alt={theme === "dark" ? "sun" : "moon"}
                className="w-6 h-6"
              />
            </button>
          </div>

         
          <form onSubmit={addTodo} className="mb-4">
            <div
              className={`flex items-center rounded-lg shadow-md p-4 transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 ${
                  theme === "dark" ? "border-gray-500" : "border-gray-300"
                }`}
              ></div>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Create a new todo..."
                className={`flex-1 outline-none transition-colors duration-300 ${
                  theme === "dark" ? "bg-gray-800 text-gray-300" : "text-gray-700"
                }`}
              />
            </div>
          </form>

      
          <div
            className={`rounded-lg shadow-md transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            {filteredTodos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                index={todos.indexOf(todo)}
                toggleTodo={toggleTodo}
                moveTodo={moveTodo}
                theme={theme}
              />
            ))}

     
            <div
              className={`flex justify-between items-center p-4 text-sm transition-colors duration-300 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <span>
                {todos.filter((todo) => !todo.completed).length} items left
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`${
                    filter === "all" ? "text-blue-500" : ""
                  } hover:text-blue-500`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`${
                    filter === "active" ? "text-blue-500" : ""
                  } hover:text-blue-500`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`${
                    filter === "completed" ? "text-blue-500" : ""
                  } hover:text-blue-500`}
                >
                  Completed
                </button>
              </div>
              <button
                onClick={clearCompleted}
                className="hover:text-blue-500"
              >
                Clear Completed
              </button>
            </div>
          </div>

          <p
            className={`text-center text-sm mt-4 transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Drag and drop to reorder list
          </p>
        </div>
      </div>
    </DndProvider>
  );
}