export default function FilterInput({ label, value, onChange }) {
  return (
    <div className="mb-2">
      <label className="block text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
    </div>
  )
}
