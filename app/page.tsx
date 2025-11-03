import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/users" className="p-4 bg-blue-100 rounded hover:bg-blue-200">
          Usuários
        </Link>
        <Link href="/clients" className="p-4 bg-green-100 rounded hover:bg-green-200">
          Clientes
        </Link>
      </div>
    </div>
  )
}
