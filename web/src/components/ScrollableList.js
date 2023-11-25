import React from 'react';
import { List, ListItem, ListItemText, Box } from '@mui/material';

const ScrollableList = ({ items, selectedItemIds, setSelectedItemIds }) => {
    const handleItemClick = (itemId) => {
        if (selectedItemIds.includes(itemId)) {
          setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
          
        } else {
          setSelectedItemIds([...selectedItemIds, itemId]);
          console.log("New selected item ids: " + selectedItemIds);
          console.log("Item id was: " + itemId);
          console.log(items);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto', maxHeight: 300 }}>
            <List>
            {items.map((item) => (
                <ListItem 
                    button 
                    key={item._id} 
                    selected={selectedItemIds.includes(item._id)} 
                    onClick={() => handleItemClick(item._id)}
                >
                <ListItemText primary={`${item.firstName} ${item.lastName}`} />
            </ListItem>
            ))}
            </List>
        </Box>
    )
}

export default ScrollableList;
