import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar({searchParams}) {

  const [searchKey, setSearchKey] = useState(searchParams?.q ?? '');

  function handleSearchChange(e) {
    setSearchKey(e.currentTarget.value);
  }

  useEffect(() => {
    if (!searchParams?.q) {
      setSearchKey('');
    }
  }, [searchParams]);

  return (
    <Form className="w-full px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded-lg">
      <input type="text" name="q" id="q" value={searchKey} onChange={handleSearchChange} placeholder="Cari kartu..." className="p-0 flex-1 border-0 focus:ring-0" />
      <Search />
    </Form>
  )
}