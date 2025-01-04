import { useEffect, useRef } from "react"

export default function Toast({ message }) {

  const toastRef = useRef();
  useEffect(() => {
    const toast = toastRef.current;
    toast.show();
    return () => {
      setTimeout(() => {
        toast.close();
      }, 3000);
    }
  })

  return (
    <dialog ref={toastRef} className="p-2 fixed bottom-20 rounded-lg">
      <p className="text-sm">{message}</p>
    </dialog>
  );
}