import { BookType } from "lucide-react";


export default function Header({ children }) {
  return (
    <header className="w-full sticky top-0 px-4 py-2 border border-b flex items-center justify-between bg-white">
      <div className="flex gap-1">
        <BookType />
        <p>Sorbit</p>
      </div>
      <div className="h-fit flex justify-end items-center gap-4">
        {children}
      </div>
    </header>
  );
}
