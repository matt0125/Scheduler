import React, { useState } from 'react';
import { List, ListItem, Checkbox, ListItemText, IconButton, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PositionList = ({ positions, onToggle, onAddPosition, onDeletePosition }) => {
  const [showInput, setShowInput] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');

  const listStyle = {
    maxHeight: '300px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: 0,
  };

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleSavePosition = () => {
    onAddPosition(newPositionName);
    setNewPositionName(''); // Reset the input field
    setShowInput(false); // Hide the input field again
  };

  return (
    <div style={{ margin: '10px', width: '300px' }}>
      <List style={listStyle}>
        {positions.map((position) => (
          <ListItem key={position.id} dense button>
            <Checkbox
              edge="start"
              checked={position.checked || false}
              tabIndex={-1}
              disableRipple
              onClick={() => onToggle(position.id)}
            />
            <ListItemText primary={position.name} />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDeletePosition(position.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
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
