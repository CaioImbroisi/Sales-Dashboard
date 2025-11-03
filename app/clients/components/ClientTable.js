export default function ClientTable({ clients }) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Nome</th>
          <th className="border px-2 py-1">E-mail</th>
          <th className="border px-2 py-1">Telefone</th>
          <th className="border px-2 py-1">CPF</th>
          <th className="border px-2 py-1">Idade</th>
          <th className="border px-2 py-1">Endereço</th>
          <th className="border px-2 py-1">Criado em</th>
          <th className="border px-2 py-1">Atualizado em</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr key={client.id}>
            <td className="border px-2 py-1">{client.name}</td>
            <td className="border px-2 py-1">{client.email}</td>
            <td className="border px-2 py-1">{client.phone}</td>
            <td className="border px-2 py-1">{client.cpf}</td>
            <td className="border px-2 py-1">{client.age}</td>
            <td className="border px-2 py-1">{client.address}</td>
            <td className="border px-2 py-1">{new Date(client.createdAt).toLocaleDateString()}</td>
            <td className="border px-2 py-1">{new Date(client.updatedAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
