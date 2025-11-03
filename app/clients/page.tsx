'use client'

import { useState, useEffect } from 'react'
import ClientTable from './components/ClientTable'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function ClientsPage() {
  const [allClients, setAllClients] = useState([])
  const [clients, setClients] = useState([])
  const [consultants, setConsultants] = useState([])
  const [consultantsEmail, setConsultantsEmail] = useState([])

  const [filterConsultant, setFilterConsultant] = useState(null) // { value, label }
  const [filterPeriod, setFilterPeriod] = useState([null, null])
  const [typingTimeout, setTypingTimeout] = useState(null)

  const [startDate, endDate] = filterPeriod

  // Busca todos os clientes e consultores
  const fetchData = async () => {
    try {
      // Clientes
      const clientsRes = await fetch('/api/clients')
      const clientsData = await clientsRes.json()

      // Consultores
      const consultantsRes = await fetch('/api/users') // ajusta sua rota
      const consultantsData = await consultantsRes.json()

      setAllClients(clientsData)
      setClients(clientsData)
      setConsultants(
        consultantsData.map(c => ({
          value: c.id,
          label: c.name,
        }))
      )
      setConsultantsEmail(
        consultantsData.map(c => ({
          value: c.id,
          label: c.email,
        }))
      )
    } catch (err) {
      console.error(err)
      setAllClients([])
      setClients([])
      setConsultants([])
    }
  }
  const filterClients = () => {
    let filtered = [...allClients]

    // Filtra pelo consultor selecionado
    if (filterConsultant) {
      filtered = filtered.filter(c => c.consultantId === filterConsultant.value)
    }

    // Filtro por período
    if (startDate && endDate) {
      filtered = filtered.filter(c => {
        const createdAt = new Date(c.createdAt)
        return createdAt >= startDate && createdAt <= endDate
      })
    }

    setClients(filtered)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(filterClients, 300))
  }, [filterConsultant, startDate, endDate, allClients])
 console.log("a" ,consultants)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      {/* Filtros */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-black-700 mb-1">Consultor</label>
          <Select
            options={consultants}
            value={filterConsultant}
            onChange={setFilterConsultant}
            isClearable
            placeholder="Selecione um consultor"
          />
        </div>

        <div>
          <label className="block text-black mb-1">Email</label>
          <Select
            options={consultantsEmail}
            value={filterConsultant}
            onChange={setFilterConsultant}
            isClearable
            placeholder="Selecione um consultor"
          />
        </div>

        <div>
          <label className="block text-black mb-1">Período</label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={setFilterPeriod}
            isClearable
            placeholderText="Selecione um período"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      {/* Tabela */}
      <ClientTable clients={clients} />
    </div>
  )
}
