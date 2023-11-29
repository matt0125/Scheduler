import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem from @mui/material

import { getShiftTemplate, updateShiftTemplate, fetchPositions, getPositionName } from '../services/api';

export default function EditSTModal(props) {
  const { isOpen, templateId, empId, template, closeEditSTModal } = props;
  const [shiftTemplate, setShiftTemplate] = useState(null);
  const [editedShiftTemplate, setEditedShiftTemplate] = useState({
    positionId: '',
    startTime: '',
    endTime: ''
  });
  const [positions, setPositions] = useState([]);
  const [selectedPositionName, setSelectedPositionName] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch positions
        const fetchedPositions = await fetchPositions(); // Assuming fetchPositions returns positions as an array of objects { _id, name }
        setPositions(fetchedPositions);

        // Fetch shift template
        const fetchedShiftTemplate = await getShiftTemplate(templateId);
        setShiftTemplate(fetchedShiftTemplate);
        setSelectedPositionName(await getPositionName(fetchedShiftTemplate.positionId));
        setEditedShiftTemplate({
          positionId: fetchedShiftTemplate.positionId,
          startTime: fetchedShiftTemplate.startTime,
          endTime: fetchedShiftTemplate.endTime
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    if (isOpen && templateId) {
      fetchData();
    }
  }, [isOpen, templateId]);

  
  const handleEdit = async () => {
    try {
      // Find position ID based on selectedPositionName
      const selectedPosition = positions.find((pos) => pos.name === selectedPositionName);
      if (!selectedPosition) {
        console.error('Position not found');
        return;
      }

      // Update the shift template with the selected position ID
      await updateShiftTemplate(
        shiftTemplate._id,
        selectedPosition._id,
        editedShiftTemplate.startTime,
        editedShiftTemplate.endTime,
        shiftTemplate.dayOfWeek
      );
      // Optionally, close the modal after successful update
      closeEditSTModal();
    } catch (error) {
      console.error('Error updating shift template:', error);
      // Handle error state or display error message to the user
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedShiftTemplate({
      ...editedShiftTemplate,
      [name]: value
    });
  };

  const handlePositionChange = (event) => {
    setSelectedPositionName(event.target.value);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeEditSTModal}>
      <h2>Edit Shift Template</h2>
      {shiftTemplate && (
        <>
          <TextField
            label="Position"
            select
            value={selectedPositionName}
            onChange={handlePositionChange}
            fullWidth
            margin="normal"
          >
            {positions.map((position) => (
              <MenuItem key={position._id} value={position.name}>
                {position.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={editedShiftTemplate.startTime}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              value={editedShiftTemplate.endTime}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Stack>
          <Button variant="contained" onClick={handleEdit}>
            Save Changes
          </Button>
        </>
      )}
    </Modal>
  );
}
