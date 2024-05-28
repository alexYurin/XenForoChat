import {
  memo,
  useMemo,
  useEffect,
  useState,
  ChangeEventHandler,
  RefObject,
} from 'react'
import {
  IconButton,
  Paper,
  InputBase,
  debounce,
  CircularProgress,
} from '@mui/material'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import { useChatStore } from '@app/store'

export type RoomSearchProps = {
  elRef?: RefObject<HTMLFormElement>
}

let isTouched = false

const RoomSearch = memo(({ elRef }: RoomSearchProps) => {
  const rooms = useChatStore(state => state.rooms)
  const getRooms = useChatStore(state => state.getRooms)
  const searchStoreString = useChatStore(state => state.searchString)

  const [searchString, setSearchString] = useState(searchStoreString)
  const [isLoading, setLoading] = useState(false)

  const isDisableSearch =
    rooms === null || (rooms?.length === 0 && searchString.length === 0)

  const search = useMemo(
    () =>
      debounce((query: string) => {
        isTouched = true
        getRooms({ search: query }).finally(() => {
          setLoading(false)
        })
      }, 400),
    [],
  )

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    setSearchString(event.target.value)
  }

  useEffect(() => {
    if (searchString.length > 0) {
      setLoading(true)

      search(searchString)
    }

    if (isTouched && searchString.length === 0) {
      getRooms({ search: searchString })
        .finally(() => {
          setLoading(false)
        })
        .finally(() => {
          isTouched = false
        })
    }
  }, [searchString])

  return (
    <Paper
      ref={elRef}
      component="form"
      elevation={0}
      onSubmit={event => {
        event.preventDefault()
      }}
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
        defaultValue={searchStoreString}
        value={searchString}
      />
      <CircularProgress
        color="info"
        size={20}
        sx={{ visibility: isLoading ? 'visible' : 'hidden' }}
      />
    </Paper>
  )
})

export default RoomSearch
