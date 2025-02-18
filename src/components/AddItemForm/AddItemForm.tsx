import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import { AddBox } from '@mui/icons-material'

type AddItemFormProps = {
  addItem: (title: string) => void
  disabled?: boolean
}

export const AddItemForm = React.memo(function ({
  addItem,
  disabled = false,
}: AddItemFormProps) {
  let [title, setTitle] = useState('')
  let [error, setError] = useState<string | null>(null)

  const addItemHandler = () => {
    if (title.trim() !== '') {
      addItem(title)
      setTitle('')
    } else {
      setError('Title is required')
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.key === 'Enter') {
      addItemHandler()
    }
  }

  return (
    <div>
      <TextField
        variant='outlined'
        disabled={disabled}
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyDown={onKeyPressHandler}
        label='Title'
        helperText={error}
      />
      <IconButton
        color='primary'
        onClick={addItemHandler}
        disabled={disabled}
      >
        <AddBox />
      </IconButton>
    </div>
  )
})
