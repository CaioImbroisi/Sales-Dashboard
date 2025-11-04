export default function ClientTable({ clients }) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">Nome</th>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">E-mail</th>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">Telefone</th>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">CPF</th>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">Idade</th>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">Endereço</th>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">Criado em</th>
          <th className="text-left bg-[#131313] border px-2 py-1 text-xs md:text-sm">Atualizado em</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr key={client.id}>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{client.name}</td>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{client.email}</td>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{client.phone}</td>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{client.cpf}</td>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{client.age}</td>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{client.address}</td>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{new Date(client.createdAt).toLocaleDateString()}</td>
            <td className="bg-[#222729] border px-2 py-1 text-xs md:text-sm">{new Date(client.updatedAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
