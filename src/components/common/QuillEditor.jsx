import React, { useRef, useEffect, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = forwardRef(({ value, onChange, modules, ...props }, ref) => {
  useEffect(() => {
    // Suppress DOM mutation warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('DOMNodeInserted')) {
        return; // Suppress this specific warning
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  const defaultModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    }
  };

  return (
    <ReactQuill
      ref={ref}
      value={value}
      onChange={onChange}
      modules={modules || defaultModules}
      theme="snow"
      className="bg-white"
      {...props}
    />
  );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor; 