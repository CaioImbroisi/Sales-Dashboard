'use client'

import { useState, useEffect } from 'react'
import ClientTable from './clients/components/ClientTable'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import UserModal from './clients/components/userModal'

export default function ClientsPage() {
  const [allClients, setAllClients] = useState([])
  const [clients, setClients] = useState([])
  const [consultantsList, setConsultantsList] = useState([])

  const [last7DaysCount, setLast7DaysCount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const [selectedConsultant, setSelectedConsultant] = useState(null)
  const [filterPeriod, setFilterPeriod] = useState([null, null])
  const [typingTimeout, setTypingTimeout] = useState(null)

  const [startDate, endDate] = filterPeriod

  const fetchData = async () => {
    try {
      const clientsRes = await fetch('/api/clients')
      const clientsData = await clientsRes.json()

      const consultantsRes = await fetch('/api/users')
      const consultantsData = await consultantsRes.json()

      setAllClients(clientsData)
      setClients(clientsData)
      setConsultantsList(consultantsData)

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const recentClients = clientsData.filter(c => new Date(c.createdAt) >= sevenDaysAgo)
      setLast7DaysCount(recentClients.length)
    } catch (err) {
      console.error(err)
    }
  }

  const onCreated = () => {
    fetchData()
  }

  const filterClients = () => {
    let filtered = [...allClients]

    if (selectedConsultant) {
      filtered = filtered.filter(c => c.consultantId === selectedConsultant.id)
    }

    if (startDate && endDate) {
      filtered = filtered.filter(c => {
        const createdAt = new Date(c.createdAt)
        return createdAt >= startDate && createdAt <= endDate
      })
    }

    setClients(filtered)
  }

  const handleSelectByName = (option) => {
    if (!option) return setSelectedConsultant(null)
    setSelectedConsultant(consultantsList.find(c => c.id === option.value))
  }

  const handleSelectByEmail = (option) => {
    if (!option) return setSelectedConsultant(null)
    setSelectedConsultant(consultantsList.find(c => c.id === option.value))
  }

  const dropdownStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
        ? '#bfdbfe'
        : 'white',
      color: state.isSelected ? 'white' : '#0f172a',
      padding: 10,
      fontSize:'14px'
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: 8,
      borderColor: '#cbd5e1',
      boxShadow: 'none',
      minWidth: '210px',
      fontSize:'14px',
      width: '100%'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#0f172a',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 8,
      overflow: 'hidden',
      width: 'fit-content',
      minWidth: '300px'
    }),
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(filterClients, 300))
  }, [selectedConsultant, startDate, endDate, allClients])

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* md: absolute top-[235px] right-[40px] */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-4 gap-4">
        <div className="bg-zinc-800 shadow rounded-lg p-4 border hidden md:block">
          <p className="text-sm text-gray-200">Total de clientes</p>
          <p className="text-3xl font-bold">{last7DaysCount}</p>
          <p className="text-xs text-gray-200">
            nos últimos <span className="text-green-400">7 dias</span>
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end w-full md:w-auto">
          <button
            className="max-w-max cursor-pointer bg-green-900 hover:bg-green-800 text-lime-500 px-4 py-2 rounded-lg hidden md:block"
            onClick={() => setModalOpen(true)}
          >
            Criar usuário +
          </button>

          <div className="flex w-full">
            <div className="flex flex-row-reverse justify-between pl-4 pr-4 md:flex-row gap-4 bg-neutral-800 p-2 border rounded-md w-full">
              <div className="sm:flex flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full md: max-w-[210px]">
                <label className="font-instrument text-sm text-black-400">Nome do consultor</label>
                <Select
                  options={consultantsList.map((c) => ({
                    value: c.id,
                    label: c.nome,
                  }))}
                  value={
                    selectedConsultant
                      ? {
                          value: selectedConsultant.id,
                          label: selectedConsultant.nome,
                        }
                      : null
                  }
                  onChange={handleSelectByName}
                  isClearable
                  placeholder="Selecione um consultor"
                  styles={dropdownStyles}
                />
              </div>

              <div className="flex flex-col w-full md: max-w-[210px]">
                <label className='font-instrument text-sm text-black-400'>Email do consultor</label>
                <Select
                  options={consultantsList.map((c) => ({
                    value: c.id,
                    label: c.email,
                  }))}
                  value={
                    selectedConsultant
                      ? {
                          value: selectedConsultant.id,
                          label: selectedConsultant.email,
                        }
                      : null
                  }
                  onChange={handleSelectByEmail}
                  isClearable
                  placeholder="Selecione um email"
                  styles={dropdownStyles}
                />
              </div>

              <div className="flex flex-col w-full md: max-w-[210px]">
                <label className='font-instrument text-sm text-black-400'>Período</label>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={setFilterPeriod}
                  isClearable
                  placeholderText="Selecione um período"
                  className="bg-white text-black border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              </div>
              <div className="flex flex-col justify-center gap-2 md:hidden">
                <button
                  className="max-w-max cursor-pointer bg-green-900 hover:bg-green-800 text-lime-500 px-4 py-2 rounded-lg"
                  onClick={() => setModalOpen(true)}
                >
                  Criar usuário +
                </button>
                <div className="bg-zinc-800 shadow rounded-lg p-4 border">
                  <p className="text-sm text-gray-200">Total de clientes</p>
                  <p className="text-3xl font-bold">{last7DaysCount}</p>
                  <p className="text-xs text-gray-200">
                    nos últimos <span className="text-green-400">7 dias</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={onCreated}
      />

      <ClientTable clients={clients} />
    </div>
  );
}
