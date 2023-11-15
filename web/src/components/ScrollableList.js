import React from 'react';
import { List, ListItem, ListItemText, Box } from '@mui/material';

const ScrollableList = ({ items }) => (
  <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto', maxHeight: 300 }}>
    <List>
      {items.map((item, index) => (
        <ListItem key={index} button>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  </Box>
);

export default ScrollableList;
