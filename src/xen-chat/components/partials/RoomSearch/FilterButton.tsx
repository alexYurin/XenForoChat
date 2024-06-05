import { Badge, IconButton } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useChatStore } from '@app/store'

export type FilterMenuButtonProps = {
  isOpen: boolean
  onPress: (event: React.MouseEvent<HTMLElement>) => void
  disabled?: boolean
}

const FilterMenuButton = ({
  isOpen,
  onPress,
  disabled,
}: FilterMenuButtonProps) => {
  const searchFilter = useChatStore(state => state.searchFilter)

  const isActive = searchFilter.unread === '1'

  return (
    <IconButton
      onClick={onPress}
      size="small"
      style={{ marginLeft: 'auto' }}
      disabled={disabled}
      color={isActive ? 'warning' : 'default'}
      aria-controls={isOpen ? 'filter-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={isOpen ? 'true' : undefined}
    >
      <Badge badgeContent={isActive ? 1 : 0}>
        <FilterAltIcon sx={{ width: 18, height: 18 }} />
      </Badge>
    </IconButton>
  )
}

export default FilterMenuButton
