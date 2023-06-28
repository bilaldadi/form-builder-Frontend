import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "tachyons";
import axios from 'axios';


const FormBuilder = () => {
  const [form_elements, setFormElements] = useState([]);
  const [availableElements] = useState([
    { id: '1', label: 'Text Input', type: 'text' },
    { id: '2', label: 'Textarea' , type: 'textarea' },
    { id: '3', label: 'Checkbox' , type: 'checkbox' },
    { id: '4', label: 'Radio', type: 'radio' },
  ]);

  const handleSave = async (event) => {
    try {
      event.preventDefault();
      console.log({form_elements});
     
     await axios.post('http://127.0.0.1:8000/api/forms',{form_elements});
     console.log('Form data saved successfully!');

    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };
  
  const handleRetrieve = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/forms');
      const retrievedElements = response.data;
      setFormElements(retrievedElements);
      console.log('Form data retrieved successfully!');
      console.log({retrievedElements});
    } catch (error) {
      console.error('Error retrieving form data:', error);
    }
  };
  
  const handleDelete = async (index) => {
    try {
      const updatedElements = [...form_elements];
      updatedElements.splice(index, 1);
      setFormElements(updatedElements);
  
      await axios.delete(`http://localhost:8000/api/forms/${index}`);
      console.log('Form element deleted successfully!');
    } catch (error) {
      console.error('Error deleting form element:', error);
    }
  };
  

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Reorder the form elements
    const updatedElements = Array.from(form_elements);
    const [draggedElement] = updatedElements.splice(source.index, 1);
    updatedElements.splice(destination.index, 0, draggedElement);

    setFormElements(updatedElements);
  };

  const handleAddElement = (element) => {
    const updatedElements = [...form_elements, element];
    setFormElements(updatedElements);
  };

  return (
    <div className='ma4 tc shadow-5'>
      <h1>Form Builder</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="formElements">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {form_elements.map((element, index) => (
                <Draggable key={element.id} draggableId={element.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>{element.label}</div>
                      <input type={element.type} />
                      <button onClick={() => handleDelete(index)}>Delete</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div>
        <h2>Add Element</h2>
        {availableElements.map((element) => (
            <div>
          <button key={element.id} onClick={() => handleAddElement(element)}>
            Add {element.label}
          </button>
          </div>
        ))}
      </div>
      <div>
      <h2>Actions</h2>
      <button onClick={handleSave}>Save Form</button>
      <button onClick={handleRetrieve}>Retrieve Form</button>
    </div>
    </div>
  );
};

export default FormBuilder;
