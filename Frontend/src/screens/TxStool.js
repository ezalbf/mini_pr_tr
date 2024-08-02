import React, { useState,useRef } from 'react';
import '../App.css';
import NavBar from '../components/navbar'
import axios from 'axios';

const TxStool = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [mode, setMode] = useState('Paragraph');
  const [length, setLength] = useState('Concise');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/summarize', {
        text: text,
        mode: mode,
        length: length
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error.response ? error.response.data : error.message);
      setSummary(`An error occurred while summarizing the text: ${error.response ? error.response.data.detail : error.message}`);
    }
    setIsLoading(false);
  };

  const handleClearText = () => {
    setText('');
  };

  const handleClearSummary = () => {
    setSummary('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (['txt', 'pdf', 'docx', 'pptx'].includes(fileExtension)) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await axios.post('http://localhost:8000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setText(response.data.text);
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
        }
      } else {
        alert('Please upload a TXT, PDF, DOCX, or PPTX file.');
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleLengthChange = (newLength) => {
    setLength(newLength);
  };
  
  return (
    <>
    <NavBar />
    <div className='container'>
        
    <h1 class='top-sec'>Text Summarizer Tool</h1>
    <p class='top-secp'>Why read more when you can read less?</p>
      
      <div className="summarizer-tool">
        <div className="controls">
          <div className="modes">
            <p><b>Modes:</b></p>
            <p
                className={mode === 'Paragraph' ? 'active' : ''}
                onClick={() => handleModeChange('Paragraph')}
              >Paragraph</p>

             <p
                className={mode === 'Bullet Points' ? 'active' : ''}
                onClick={() => handleModeChange('Bullet Points')}
              >Bullet Points</p>
          </div>
          <div className="length">
            <p><b>Lengths:</b></p>
            <p
                className={length === 'Concise' ? 'active' : ''}
                onClick={() => handleLengthChange('Concise')}
              >Concise</p>

            <p
                className={length === 'Standard' ? 'active' : ''}
                onClick={() => handleLengthChange('Standard')}
              >Standard</p>
          </div>
        </div>
        <div className="textareas-container">
          <div className="textarea-wrapper">
            <textarea
              placeholder="Enter / paste your text"
              value={text}
              onChange={handleTextChange}
              className="text-input"
            />
            <div className="input-buttons">
              <div className='icons'>
                <lord-icon className='upload'
                  src="https://cdn.lordicon.com/smwmetfi.json"
                  trigger="hover"
                  onClick={triggerFileInput}></lord-icon> {/* Upload Icon */}

                <lord-icon className='upload image'
                    src="https://cdn.lordicon.com/baxknfaw.json"
                    trigger="hover">
                </lord-icon> {/* Upload Image Icon */}

                <lord-icon className='delete'
                    src="https://cdn.lordicon.com/wpyrrmcq.json"
                    trigger="morph"
                    state="morph-trash-full-to-empty"
                    onClick={handleClearText}> 
                </lord-icon> {/* Delete Icon */}
              </div>

              <button onClick={handleSummarize} className="summarize-button" disabled={isLoading}>
              {isLoading ? 'Summarizing...' : 'Summarize'}</button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept=".txt,.pdf,.docx,.pptx"
            />

          </div>

          <div className="textarea-wrapper">
            <textarea readOnly value={summary} className="summary-output" />

            <div className="sum-icons">
            <lord-icon className='delete'
                  src="https://cdn.lordicon.com/wpyrrmcq.json"
                  trigger="morph"
                  state="morph-trash-full-to-empty"
                  onClick={handleClearSummary}> 
              </lord-icon> {/* Delete Icon */}

              
              {/*<button>&#128194;</button> {/* Copy Icon */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TxStool;
