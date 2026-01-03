import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import materialService from '../services/materialService';
import subjectService from '../services/subjectService';

const BrowseMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    subjectId: '',
    department: '',
    semester: ''
  });

  useEffect(() => {
    fetchMaterials();
    fetchSubjects();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMaterials();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialService.getApprovedMaterials(filters);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await subjectService.getAllSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await subjectService.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      subjectId: '',
      department: '',
      semester: ''
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#333333',
    marginBottom: '1rem'
  };

  const filtersStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem'
  };

  const filterGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #d4d4d4',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    width: '100%',
    backgroundColor: 'white'
  };

  const buttonStyle = {
    backgroundColor: '#999999',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  };

  const secondaryButtonStyle = {
    backgroundColor: '#d4d4d4',
    color: '#333333',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: 'pointer'
  };

  const materialsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  };

  const materialCardStyle = {
    backgroundColor: 'white',
    border: '1px solid #d4d4d4',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const materialTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '0.5rem',
    textDecoration: 'none'
  };

  const materialMetaStyle = {
    color: '#666666',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  };

  const descriptionStyle = {
    color: '#666666',
    marginBottom: '1rem',
    lineHeight: '1.5'
  };

  const linkStyle = {
    color: '#666666',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const noMaterialsStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#666666'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Browse Materials</h1>
      </div>

      {/* Filters */}
      <div style={filtersStyle}>
        <div style={filterGridStyle}>
          <input
            type="text"
            name="keyword"
            placeholder="Search by title or description..."
            value={filters.keyword}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <select
            name="subjectId"
            value={filters.subjectId}
            onChange={handleFilterChange}
            style={inputStyle}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            style={inputStyle}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            style={inputStyle}
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button onClick={clearFilters} style={secondaryButtonStyle}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Materials List */}
      {loading ? (
        <div style={noMaterialsStyle}>Loading materials...</div>
      ) : materials.length === 0 ? (
        <div style={noMaterialsStyle}>
          <h3>No materials found</h3>
          <p>Try adjusting your filters or check back later for new uploads.</p>
        </div>
      ) : (
        <div style={materialsGridStyle}>
          {materials.map(material => (
            <div key={material.id} style={materialCardStyle}>
              <Link to={`/materials/${material.id}`} style={materialTitleStyle}>
                {material.title}
              </Link>
              
              <div style={materialMetaStyle}>
                <strong>Subject:</strong> {material.subjectName}<br />
                <strong>Department:</strong> {material.department || 'N/A'}<br />
                <strong>Semester:</strong> {material.semester || 'N/A'}<br />
                <strong>Uploaded by:</strong> {material.uploadedByFirstName} {material.uploadedByLastName}<br />
                <strong>File:</strong> {material.fileName} ({formatFileSize(material.fileSize)})<br />
                <strong>Downloads:</strong> {material.downloadCount}
              </div>

              {material.description && (
                <div style={descriptionStyle}>
                  {material.description.length > 150 
                    ? material.description.substring(0, 150) + '...' 
                    : material.description}
                </div>
              )}

              <Link to={`/materials/${material.id}`} style={linkStyle}>
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseMaterials;
