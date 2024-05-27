import { useMemo, useEffect, useState } from 'react'
import { Autocomplete, Chip, TextField } from '@mui/material'
import { useChatStore, useXenForoApiStore } from '@app/store'
import { debounce } from '@mui/material/utils'
import { sxInput } from '@app/themes/components/input'
import { UserType } from '@app/api/xenforo/types'

// @TODO Decompose

export type MembersAutocompleteProps = {
  name?: string
  label?: string
  defaultValue?: UserType[]
  placeholder?: string
  required?: boolean
  onChange?: (users: UserType[]) => void
}

const MembersAutocomplete = ({
  name,
  label,
  placeholder,
  defaultValue,
  required,
  onChange,
}: MembersAutocompleteProps) => {
  const user = useChatStore(state => state.user)
  const findUser = useXenForoApiStore(state => state.findUser)

  const [value, setValue] = useState<UserType[]>(defaultValue || [])
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<UserType[]>([])

  const fetch = useMemo(
    () =>
      debounce((username: string, callback: (users: UserType[]) => void) => {
        findUser(username).then(response => callback(response.recommendations))
      }, 400),
    [],
  )

  useEffect(() => {
    let active = true

    if (inputValue === '') {
      setOptions([])

      return undefined
    }

    fetch(inputValue, (users: UserType[]) => {
      if (active) {
        let newOptions: UserType[] = []
        if (value) {
          newOptions = users.filter(
            responseUser =>
              responseUser.user_id !== user!.user_id &&
              !value.map(user => user.user_id).includes(responseUser.user_id),
          )
        }

        setOptions(newOptions)
      }
    })

    return () => {
      active = false
    }
  }, [value, inputValue, fetch])

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  return (
    <Autocomplete
      multiple
      disablePortal
      aria-required={required}
      id="add-conversation-recipients"
      options={options}
      getOptionLabel={option => option.username}
      filterOptions={x => x}
      filterSelectedOptions
      noOptionsText="No find users"
      value={value}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            fontSize: 12,
          },
        },
      }}
      sx={{
        mt: 2,
        ...sxInput,
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(event: any, newValue: UserType[] | null) => {
        setOptions(newValue ? [...newValue, ...options] : options)

        if (newValue) {
          setValue(newValue)

          if (typeof onChange === 'function') {
            onChange(newValue)
          }
        }
      }}
      renderTags={(value: UserType[], getTagProps) =>
        value.map((option: UserType, index: number) => (
          <Chip
            variant="outlined"
            label={option.username}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={params => (
        <TextField
          {...{
            ...params,
            autoComplete: 'new-password',
            required: required ? value.length === 0 : undefined,
          }}
          name={name || 'recipient_ids'}
          label={label || 'Recipients'}
          variant="outlined"
          placeholder={placeholder || 'Recipients'}
          sx={sxInput}
        />
      )}
    />
  )
}

export default MembersAutocomplete
