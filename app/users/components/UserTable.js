import Link from 'next/link'

export default function UserTable({ users }) {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Nome</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Cargo</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td className="border px-4 py-2">{user.id}</td>
            <td className="border px-4 py-2">{user.name}</td>
            <td className="border px-4 py-2">{user.email}</td>
            <td className="border px-4 py-2">{user.role}</td>
            <td className="border px-4 py-2">
              <Link href={`/users/${user.id}`} className="text-blue-500 hover:underline">Ver</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
