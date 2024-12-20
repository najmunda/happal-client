import { Link } from "react-router-dom";
import { useRef } from "react";
import { Inbox, LayoutDashboard, Pickaxe, RefreshCcw, Repeat, Settings } from "lucide-react"

export default function Navigation() {
  const dropdownRef = useRef(null);

  function handleBrackdropClick(e) {
    if (e.target == dropdownRef.current) {
      dropdownRef.current.close();
    };
  }

  return (
    <>
      <header className="px-10 py-2 border border-b flex justify-between items-center">
        <div>SorbIt</div>
        <nav>
          <ul className="flex justify-between items-center gap-10">
            <li>
              <Link to={"/"} className="flex items-center gap-3"><LayoutDashboard />Home</Link>
            </li>
            <li>
              <Link to={"/mine"} className="flex items-center gap-3"><Pickaxe />Mine</Link>
            </li>
            <li>
              <Link to={"/sorb"} className="flex items-center gap-3"><Repeat />Sorb</Link>
            </li>
            <li>
              <Link to={"/cards"} className="flex items-center gap-3"><Inbox />Cards</Link>
            </li>
          </ul>
        </nav>
        <div className="flex justify-between items-center gap-5">
          <button><RefreshCcw /></button>
          <button onClick={() => dropdownRef.current.showModal()}>
            <img src="/profile.png" alt="" className="size-8 rounded-full" />
          </button>
        </div>
      </header>
      <dialog ref={dropdownRef} onClick={handleBrackdropClick}>
        <ul className="bg-white border rounded p-3 flex flex-col gap-3 fixed top-2 right-10">
          <li>
            <Link className="flex items-center gap-3">
              <img src="/profile.png" alt="" className="size-12  rounded-full" />
              <p>Hello, Lulu!</p>
            </Link>
          </li>
          <li><Link className="flex items-center gap-3"><Settings size={20} />Settings</Link></li>
          {/*<li><Link className="flex items-center gap-3"><LogOut size={20} />Log Out</Link></li>*/}
        </ul>
      </dialog>
    </>
  );
}
