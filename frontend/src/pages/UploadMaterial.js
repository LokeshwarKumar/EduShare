import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import materialService from '../services/materialService';
import subjectService from '../services/subjectService';

const UploadMaterial = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    department: '',
    semester: ''
  });
  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await subjectService.getAllSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await materialService.uploadMaterial(formData, file);
      navigate('/my-materials');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#333333',
    marginBottom: '2rem',
    textAlign: 'center'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const inputGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333333'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d4d4d4',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    backgroundColor: 'white'
  };

  const textareaStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d4d4d4',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
    backgroundColor: 'white'
  };

  const fileInputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '2px dashed #d4d4d4',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: 'white'
  };

  const buttonStyle = {
    backgroundColor: '#999999',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    width: '100%',
    opacity: loading ? 0.7 : 1
  };

  const errorStyle = {
    backgroundColor: '#f5f5f5',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '0.25rem',
    marginBottom: '1rem',
    border: '1px solid #d4d4d4'
  };

  const fileInfoStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '0.25rem',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#666666'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Upload Material</h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={inputGroupStyle}>
          <label htmlFor="title" style={labelStyle}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter material title"
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="description" style={labelStyle}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={textareaStyle}
            placeholder="Provide a brief description of the material"
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="subjectId" style={labelStyle}>
            Subject *
          </label>
          <select
            id="subjectId"
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select a subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div style={rowStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="department" style={labelStyle}>
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Computer Science"
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="semester" style={labelStyle}>
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="file" style={labelStyle}>
            File * (PDF, DOC, PPT, ZIP - Max 10MB)
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
            style={fileInputStyle}
          />
          {file && (
            <div style={fileInfoStyle}>
              <strong>Selected file:</strong> {file.name}<br />
              <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Material'}
        </button>
      </form>
    </div>
  );
};

export default UploadMaterial;
