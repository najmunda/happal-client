export default function Toast({message, color}) {
  return (
    <div className={`p-2 w-fit bg-${color}-200 shadow rounded-lg`}>
      <p className="text-center">{message}</p>
    </div>
  );
}
