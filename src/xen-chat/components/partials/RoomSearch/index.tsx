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
  Box,
} from '@mui/material'
import FilterMenuButton from './FilterButton'
import FilterMenu from './FilterMenu'
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
  const searchStoreFilter = useChatStore(state => state.searchFilter)

  const [searchString, setSearchString] = useState(searchStoreString)

  const [anchorFilterElement, setAnchorFilterElement] =
    useState<null | HTMLElement>(null)

  const [filter, setFilter] = useState<string[]>(
    searchStoreFilter.unread === '1' ? ['unread'] : [],
  )

  const [isLoading, setLoading] = useState(false)

  const isOpenFilterMenu = Boolean(anchorFilterElement)

  const isDisableSearch =
    rooms === null ||
    (rooms?.length === 0 && searchString.length === 0 && filter.length === 0)

  const search = useMemo(
    () =>
      debounce((query: string) => {
        isTouched = true
        getRooms({
          search: query,
          unread: filter.includes('unread') ? '1' : '0',
        }).finally(() => {
          setLoading(false)
        })
      }, 400),
    [filter],
  )

  const onPressFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilterElement(event.currentTarget)
  }

  const onCloseFilterMenu = () => {
    setAnchorFilterElement(null)
  }

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    setSearchString(event.target.value)
  }

  const onPressUnread = () => {
    const isUnread = filter.includes('unread')

    setFilter(isUnread ? [] : ['unread'])

    getRooms({
      search: searchString,
      unread: !isUnread ? '1' : '0',
    })
  }

  useEffect(() => {
    if (searchString.length > 0) {
      setLoading(true)

      search(searchString)
    }

    if (isTouched && searchString.length === 0) {
      getRooms({
        search: searchString,
        unread: filter.includes('unread') ? '1' : '0',
      })
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
        position: 'relative',
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
          position: 'relative',
          bgcolor: 'rgba(0,0,0,0.1)',
          pointerEvents: 'none',
          opacity: isDisableSearch ? 0.3 : 1,
        }}
      >
        <ManageSearchIcon sx={{ width: 20, height: 20, color: 'GrayText' }} />
        <CircularProgress
          color="info"
          size={40}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            marginTop: '-2px',
            marginLeft: '-2px',
            visibility: isLoading ? 'visible' : 'hidden',
          }}
        />
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
        endAdornment={
          <Box display="flex" alignItems="center">
            <FilterMenuButton
              isOpen={isOpenFilterMenu}
              onPress={onPressFilter}
              disabled={isDisableSearch}
            />
          </Box>
        }
      />
      <FilterMenu
        anchorElement={anchorFilterElement}
        isOpen={isOpenFilterMenu}
        onClose={onCloseFilterMenu}
        onPressUnread={onPressUnread}
      />
    </Paper>
  )
})

export default RoomSearch
