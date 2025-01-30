import React from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

interface DrawerProp {
  toggleIsOpen: (prev: boolean) => void
}

const DrawerList = ({
  toggleIsOpen
}: DrawerProp) => {
  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={(prev) => toggleIsOpen(!prev)}>
    <List className='flex flex-col'>
      {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
        <ListItem key={text} disablePadding>
          <ListItemButton>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
  )
}

export default DrawerList
