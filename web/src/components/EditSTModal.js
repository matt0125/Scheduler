import React, { useState } from 'react';
import '../styles/Dashboard.css';
import ScrollableList from './ScrollableList';

function EditSTModal() {

    const dummyList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
    ];

    return (
        <div className='editSTModal'>
            <h3>Assign Shift Template</h3>
            <ScrollableList items={dummyList} />
            <button onClick={() => {console.log("dummy")}}>Assign Employee to Shift</button>
        </div>
    );
}

export default EditSTModal;
