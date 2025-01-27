import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './ParaEditor.css'

const ParaEditor = ({ isOpen, content, style, onSave, onClose }) => {
const [editorContent, setEditorContent] = useState(content);
  const apiKey = 'oadtdlupdyt9cw9ad66j97sac0tyb2li4xvrxzjtywmrpmrx'; // Replace with your TinyMCE API key


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <Editor
           apiKey={apiKey} // Add the API key here
                    value={editorContent}
                    init={{
                      menubar: true,
                      branding: false, // This removes the TinyMCE logo
                      plugins: ['link', 'lists', 'textcolor', 'colorpicker'],
                      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | forecolor backcolor',
                    }}
          onEditorChange={(newContent) => setEditorContent(newContent)}
        />
        <div className="button-group">
          <button className='para-btn' onClick={() => onSave(editorContent)}>Save</button>
          <button className='para-btn' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default ParaEditor;