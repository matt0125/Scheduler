import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PositionList = ({ positions, onToggle, onAddPosition, onDeletePosition }) => {
  const [showInput, setShowInput] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');

  const listStyle = {
    display: 'grid', // Using CSS Grid
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', // Creating columns
    gridGap: '10px', // Space between grid items
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    padding: '10px',
  };

  const listItemStyle = {
    display: 'flex', // Using Flexbox for the list item layout
    alignItems: 'center',
    gap: '10px',
  };

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleSavePosition = () => {
    onAddPosition(newPositionName);
    setNewPositionName(''); // Reset the input field
  };

  return (
    <div style={{ margin: '10px', width: '100%' }}>
      <div style={listStyle}>
        {positions.map((position) => (
          <div key={position.id} style={listItemStyle}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: position.color,
                borderRadius: '50%',
              }}
            />
            <ListItemText 
              primary={position.name}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDeletePosition(position.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
      {showInput ? (
        <div>
          <TextField
            fullWidth
            value={newPositionName}
            onChange={(e) => setNewPositionName(e.target.value)}
            placeholder="Enter position name"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePosition}
            fullWidth
          >
            Save Position
          </Button>
        </div>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddClick}
          fullWidth
        >
          Add Position
        </Button>
      )}
    </div>
  );
};

export default PositionList;