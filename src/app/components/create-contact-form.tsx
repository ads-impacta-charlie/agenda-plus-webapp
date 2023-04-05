'use client';

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {ContactData} from "@/app/entity/contact-data";
import CreateContactData from "@/app/components/create-contact-data";
import {Button} from "@mui/material";
import {Contact} from "@/app/entity/contact";

interface CreateContactFormParams {
  onSave: (contact: Contact) => void
  contact?: Contact
}

export default function CreateContactForm({onSave, contact}: CreateContactFormParams) {
  const [name, setName] = useState<string>(contact?.name || '')
  const [data, setData] = useState<ContactData[]>(contact?.data || [])

  useEffect(() => {
    setName(contact?.name || '')
    setData(contact?.data || [])
  }, [contact])

  const handleAddDataClick = () => {
    setData(data => {
      return [...data, {}]
    })
  }

  const handleChangeContactData = (changedData: ContactData, index: number) => {
    const newData = [...data]
    newData[index] = changedData
    setData(newData)
  }

  const handleSaveClick = () => {
    const contactToSave: Contact = { name, data, uuid: contact?.uuid }
    const headers = new Headers()
    headers.set('accept', 'application/json')
    headers.set('content-type', 'application/json')
    let url = 'http://localhost:8080/contact'
    if (contact) {
      url += `/${contact.uuid}`
    }
    fetch(url, {
      method: contact ? 'PUT' : 'POST',
      cache: 'no-cache',
      mode: 'cors',
      body: JSON.stringify(contactToSave),
      headers,
    }).then(response => response.json())
      .then(jsonResponse => onSave(jsonResponse))
  }

  return (<Box component="form" autoComplete="off">
    <TextField required variant="outlined" label="Nome" value={name} onChange={e => setName(e.target.value)}></TextField>
    {data.map((d, i) => (
      <CreateContactData key={d.uuid} data={d} dataIndex={i} onChange={handleChangeContactData}></CreateContactData>
    ))}
    <Button onClick={handleAddDataClick} variant="outlined">Adicionar Dados</Button>
    <Button onClick={handleSaveClick} variant="contained">Salvar</Button>
  </Box>)
}
