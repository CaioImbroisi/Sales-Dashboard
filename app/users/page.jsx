'use client'

import { useState, useEffect } from 'react'
import UserTable from './components/UserTable'
import FilterInput from '../components/filterInput'

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState([])
  const [users, setUsers] = useState([]) 

  const [filterName, setFilterName] = useState('')
  const [filterEmail, setFilterEmail] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (Array.isArray(data)) {
        setAllUsers(data)
        setUsers(data)
      }
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setAllUsers([])
      setUsers([])
    }
  }

  const filterUsers = () => {
    let filtered = [...allUsers]
    if (filterName) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(filterName.toLowerCase())
      )
    }
    if (filterEmail) {
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(filterEmail.toLowerCase())
      )
    }
    if (filterRole) {
      filtered = filtered.filter(u =>
        u.role.toLowerCase() === filterRole.toLowerCase()
      )
    }
    setUsers(filtered)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
    setTypingTimeout(
      setTimeout(() => {
        filterUsers()
      }, 300)
    )
  }, [filterName, filterEmail, filterRole, allUsers])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <FilterInput label="Nome" value={filterName} onChange={setFilterName} />
        <FilterInput label="E-mail" value={filterEmail} onChange={setFilterEmail} />
        <FilterInput label="Cargo" value={filterRole} onChange={setFilterRole} />
      </div>

      <UserTable users={users} />
    </div>
  )
}
