import React from 'react';
import { List, ListItem, ListItemText, Box } from '@mui/material';

const ScrollableList = ({ items, selectedItemIds, setSelectedItemIds }) => {
    const handleItemClick = (itemId) => {
        if (selectedItemIds.includes(itemId)) {
          setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
        } else {
          setSelectedItemIds([...selectedItemIds, itemId]);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto', maxHeight: 300 }}>
            <List>
            {items.map((item) => (
                <ListItem 
                    button 
                    key={item.id} 
                    selected={selectedItemIds.includes(item.id)} 
                    onClick={() => handleItemClick(item.id)}
                >
                <ListItemText primary={item.name} />
            </ListItem>
            ))}
            </List>
        </Box>
    )
}

export default ScrollableList;
