"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { userCreateSchema } from "@/lib/validators";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function UserModal({ isOpen, onClose, onCreated }: Props) {
  const [tab, setTab] = useState<"create" | "delete">("create");
  const [subtab, setSubtab] = useState<"basic" | "clients">("basic");
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    idade: 30,
    tipoUsuario: "CONSULTOR",
    cep: "",
    estado: "",
    endereco: "",
    complemento: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsersList)
      .catch(() => setUsersList([]));

    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClientsList)
      .catch(() => setClientsList([]));
  }, [isOpen, tab]);

  if (!isOpen) return null;

  const handleChange = (k: string, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

const handleSubmit = async () => {
  setError(null);
  setLoading(true);

  try {
    // 1️⃣ validação
    const parsed = userCreateSchema.safeParse({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      cpf: form.cpf,
      idade: Number(form.idade),
      tipoUsuario: form.tipoUsuario,
      cep: form.cep,
      estado: form.estado,
      endereco: form.endereco,
      complemento: form.complemento || undefined,
      clientIds: form.tipoUsuario === "CONSULTOR" ? selectedClientIds : [], // enviar array de clientes
    });

    if (!parsed.success) {
      setError(
        "Verifique os campos: " + JSON.stringify(parsed.error.flatten())
      );
      setLoading(false);
      return;
    }

    // 2️⃣ criar usuário (consultor ou cliente) + já envia clientIds
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...parsed.data,
    clientIds: selectedClientIds, // ⚠️ adiciona os IDs selecionados
  }),
});

    const json = await res.json();

    if (!res.ok) {
      setError(json.error?.message || json.error || "Erro ao criar");
      setLoading(false);
      return;
    }

    // 3️⃣ finalizar
    setLoading(false);
    onCreated?.();
    onClose();
  } catch (err: any) {
    setError(err.message || "Erro");
    setLoading(false);
  }
};


  const handleDelete = async (id: string) => {
    if (!confirm("Confirma exclusão?")) return;
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    const refreshed = await fetch("/api/users").then((r) => r.json());
    setUsersList(refreshed);
    onCreated?.();
  };

  const toggleClientSelection = (id: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#222729] rounded-lg shadow-lg w-full max-w-3xl">
        {/* header tabs */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("create")}
              className={`px-3 py-1 rounded ${
                tab === "create"
                  ? "hover:bg-green-800 bg-green-900 text-lime-500 cursor-pointer"
                  : "bg-[#1C1C1C]"
              } cursor-pointer`}
            >
              Criar usuário
            </button>
            <button
              onClick={() => setTab("delete")}
              className={`px-3 py-1 rounded ${
                tab === "delete"
                  ? "hover:bg-green-800 bg-green-900 text-lime-500 cursor-pointer"
                  : "bg-[#1C1C1C]"
              } cursor-pointer`}
            >
              Deletar usuário
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded cursor-pointer bg-[#1C1C1C]"
          >
            X
          </button>
        </div>

        <div className="p-4">
          {tab === "create" ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Criar usuário</h2>

              {/* Tipo */}
              <div className="mb-3">
                <label className="block text-sm pb-1">Tipo de usuário</label>
                <select
                  value={form.tipoUsuario}
                  onChange={(e) => handleChange("tipoUsuario", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option className="text-black" value="CONSULTOR">
                    Consultor
                  </option>
                  <option className="text-black" value="CLIENTE">
                    Cliente
                  </option>
                </select>
              </div>

              {/* Nome / Telefone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Nome</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm">Telefone</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.telefone}
                    onChange={(e) => handleChange("telefone", e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mt-3">
                <label className="block text-sm">Email</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              {/* subtabs */}
              <div className="flex gap-2 my-4">
                <button
                  onClick={() => setSubtab("basic")}
                  className={`px-3 py-1 rounded ${
                    subtab === "basic"
                      ? "hover:bg-green-800 bg-green-900 text-lime-500 cursor-pointer"
                      : "bg-[#1C1C1C]"
                  } cursor-pointer`}
                >
                  Informações básicas
                </button>

                {form.tipoUsuario === "CONSULTOR" && (
                  <button
                    onClick={() => setSubtab("clients")}
                    className={`px-3 py-1 rounded ${
                      subtab === "clients"
                        ? "hover:bg-green-800 bg-green-900 text-lime-500 cursor-pointer"
                        : "bg-[#1C1C1C]"
                    } cursor-pointer`}
                  >
                    Adicionar clientes
                  </button>
                )}
              </div>

              {/* Subtab contents */}
              {subtab === "basic" && (
                <>
                  {/* campos básicos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm">Idade</label>
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-full"
                        value={form.idade}
                        onChange={(e) =>
                          handleChange("idade", Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm">CPF</label>
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={form.cpf}
                        onChange={(e) => handleChange("cpf", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm">CEP</label>
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={form.cep}
                        onChange={(e) => handleChange("cep", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Estado</label>
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={form.estado}
                        onChange={(e) => handleChange("estado", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm">Endereço</label>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={form.endereco}
                      onChange={(e) => handleChange("endereco", e.target.value)}
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm">Complemento</label>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={form.complemento}
                      onChange={(e) =>
                        handleChange("complemento", e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              {subtab === "clients" && form.tipoUsuario === "CONSULTOR" && (
                <div className="max-h-64 overflow-auto border rounded p-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">Selecionar</th>
                        <th className="p-2 text-left">Nome</th>
                        <th className="p-2 text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientsList.map((client) => {
                        const isSelected = selectedClientIds.includes(
                          client.id
                        );
                        return (
                          <tr key={client.id} className="border-t">
                            <td className="p-2">
                              <div
                                onClick={() => toggleClientSelection(client.id)}
                                className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer
                        ${
                          isSelected
                            ? "bg-lime-800 border-lime-500"
                            : "bg-white border-gray-400"
                        }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="p-2">{client.name}</td>
                            <td className="p-2">{client.email}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {error && (
                <div className="text-red-600 mt-2">{String(error)}</div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-800 cursor-pointer"
                >
                  Finalizar
                </button>
              </div>
            </>
          ) : (
            <>
              {/* delete tab */}
              <h2 className="text-xl font-semibold mb-2">DELETAR USUÁRIO</h2>
              <div className="max-h-64 overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-sm p-2">Nome</th>
                      <th className="text-left text-sm p-2">Email</th>
                      <th className="text-right text-sm p-2">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="p-2">{u.nome}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2 text-right">
                          <button
                            className="px-2 py-1 bg-red-600 text-white rounded"
                            onClick={() => handleDelete(u.id)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
