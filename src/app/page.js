import TodoList from "@/components/TodoList";
import Image from "next/image";


export default function Home() {
  return (
    <div className="">
      <main className="">
      <TodoList />
       {/* <img src="/images/bg-desktop-light.jpg" alt="bg" className="w-full"></img> */}
      </main>
  
    </div>
  );
}
