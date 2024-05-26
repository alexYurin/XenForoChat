import { useMemo, useEffect, useState, ChangeEventHandler } from 'react'
import {
  IconButton,
  Paper,
  InputBase,
  debounce,
  CircularProgress,
} from '@mui/material'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import { useChatStore } from '@app/store'

const RoomSearch = () => {
  const isReady = useChatStore(state => state.isReady)
  const rooms = useChatStore(state => state.rooms)
  const getRooms = useChatStore(state => state.getRooms)

  const [searchString, setSearchString] = useState('')
  const [isLoading, setLoading] = useState(false)

  const isDisableSearch =
    rooms === null || (rooms?.length === 0 && searchString.length === 0)

  const search = useMemo(
    () =>
      debounce((query: string) => {
        getRooms({ search: query }).finally(() => setLoading(false))
      }, 400),
    [],
  )

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    setSearchString(event.target.value)
  }

  useEffect(() => {
    if (searchString.length > 0) {
      setLoading(true)
    }

    search(searchString)
  }, [searchString])

  return (
    <Paper
      component="form"
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        paddingX: 1.4,
        paddingY: 1.5,
        transition: 'background-color 0.2s linear',
        '&:not(:disabled)hover': {
          bgcolor: 'rgba(213, 213, 213, 0.2)',
        },
        '&:focus-within': {
          bgcolor: 'rgba(213, 213, 213, 0.2)',
        },
      }}
    >
      <IconButton
        sx={{
          bgcolor: 'rgba(0,0,0,0.1)',
          pointerEvents: 'none',
          opacity: isDisableSearch ? 0.3 : 1,
        }}
      >
        <ManageSearchIcon sx={{ width: 20, height: 20, color: 'GrayText' }} />
      </IconButton>
      <InputBase
        sx={{ ml: 2, mr: 1, flex: 1, fontSize: 16 }}
        type="search"
        placeholder="Search conversations"
        disabled={isDisableSearch}
        inputProps={{ 'aria-label': 'Search Conversations' }}
        onChange={onChange}
      />
      <CircularProgress
        color="info"
        size={20}
        sx={{ visibility: isLoading ? 'visible' : 'hidden' }}
      />
    </Paper>
  )
}

export default RoomSearch
