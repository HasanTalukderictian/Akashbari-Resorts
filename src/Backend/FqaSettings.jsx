import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const FqaSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({
        faq_question: '',
        faq_answe: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Get API base URL from environment variables
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: theme.card,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        th: {
            backgroundColor: theme.isDarkMode ? '#2d3436' : '#f8f9fa',
            color: theme.text,
            padding: '12px',
            textAlign: 'left',
            borderBottom: `2px solid ${theme.border}`
        },
        td: {
            padding: '12px',
            color: theme.text,
            borderBottom: `1px solid ${theme.border}`
        },
        button: {
            padding: '8px 12px',
            margin: '0 4px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
        },
        addButton: {
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: theme.card,
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            color: theme.text,
            fontWeight: '500'
        },
        input: {
            width: '100%',
            padding: '10px',
            border: `1px solid ${theme.border}`,
            borderRadius: '4px',
            backgroundColor: theme.isDarkMode ? '#2d3436' : '#fff',
            color: theme.text,
            fontSize: '14px'
        },
        textarea: {
            width: '100%',
            padding: '10px',
            border: `1px solid ${theme.border}`,
            borderRadius: '4px',
            backgroundColor: theme.isDarkMode ? '#2d3436' : '#fff',
            color: theme.text,
            fontSize: '14px',
            minHeight: '100px',
            resize: 'vertical'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px 0',
            gap: '10px'
        },
        pageButton: {
            padding: '8px 12px',
            border: `1px solid ${theme.border}`,
            borderRadius: '4px',
            backgroundColor: theme.card,
            color: theme.text,
            cursor: 'pointer'
        },
        activePageButton: {
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none'
        },
        actionButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '18px',
            transition: 'transform 0.2s'
        }
    };

    // Fetch FAQs
    const fetchFaqs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/faqs`);
            
            // Check if response data is an array
            let faqData = [];
            if (Array.isArray(response.data)) {
                faqData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // If response is an object with data property (common in Laravel API)
                if (Array.isArray(response.data.data)) {
                    faqData = response.data.data;
                } else if (Array.isArray(response.data.faqs)) {
                    faqData = response.data.faqs;
                } else {
                    // Try to convert object values to array if they have numeric keys
                    const values = Object.values(response.data);
                    if (values.some(v => typeof v === 'object' && v !== null)) {
                        faqData = values;
                    } else {
                        faqData = [response.data];
                    }
                }
            }
            
            setFaqs(faqData);
            setTotalItems(faqData.length);
            setError(null);
        } catch (err) {
            setError('Failed to fetch FAQs');
            console.error('Error fetching FAQs:', err);
            setFaqs([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            faq_question: '',
            faq_answe: ''
        });
        setEditingFaq(null);
    };

    // Open modal for adding
    const handleAddClick = () => {
        resetForm();
        setShowModal(true);
    };

    // Open modal for editing
    const handleEditClick = (faq) => {
        setEditingFaq(faq);
        setFormData({
            faq_question: faq.faq_question || '',
            faq_answe: faq.faq_answe || ''
        });
        setShowModal(true);
    };

    // Submit form (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editingFaq) {
                // Update existing FAQ
                await axios.put(`${API_BASE_URL}/faqs/${editingFaq.id}`, formData);
            } else {
                // Create new FAQ
                await axios.post(`${API_BASE_URL}/faqs`, formData);
            }
            await fetchFaqs();
            setShowModal(false);
            resetForm();
        } catch (err) {
            setError('Failed to save FAQ');
            console.error('Error saving FAQ:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete FAQ
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await axios.delete(`${API_BASE_URL}/faqs/${id}`);
                await fetchFaqs();
                setError(null);
            } catch (err) {
                setError('Failed to delete FAQ');
                console.error('Error deleting FAQ:', err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                }
            }
        }
    };

    // Pagination logic - ensure faqs is an array
    const faqsArray = Array.isArray(faqs) ? faqs : [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = faqsArray.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 style={{ color: theme.text }}>FAQ Management</h2>
                                <button 
                                    style={styles.addButton}
                                    onClick={handleAddClick}
                                >
                                    <span>➕</span> Add New FAQ
                                </button>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div style={{ color: theme.text, textAlign: 'center', padding: '50px' }}>
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>#</th>
                                                <th style={styles.th}>Question</th>
                                                <th style={styles.th}>Answer</th>
                                                <th style={styles.th}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.length > 0 ? (
                                                currentItems.map((faq, index) => (
                                                    <tr key={faq.id || index}>
                                                        <td style={styles.td}>
                                                            {indexOfFirstItem + index + 1}
                                                        </td>
                                                        <td style={styles.td}>
                                                            {faq.faq_question || 'N/A'}
                                                        </td>
                                                        <td style={styles.td}>
                                                            {faq.faq_answe && faq.faq_answe.length > 100 
                                                                ? `${faq.faq_answe.substring(0, 100)}...` 
                                                                : faq.faq_answe || 'N/A'}
                                                        </td>
                                                        <td style={styles.td}>
                                                            <button
                                                                style={{
                                                                    ...styles.actionButton,
                                                                    color: '#28a745'
                                                                }}
                                                                onClick={() => handleEditClick(faq)}
                                                                title="Edit FAQ"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                style={{
                                                                    ...styles.actionButton,
                                                                    color: '#dc3545'
                                                                }}
                                                                onClick={() => handleDelete(faq.id)}
                                                                title="Delete FAQ"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" style={{ 
                                                        ...styles.td, 
                                                        textAlign: 'center',
                                                        padding: '40px'
                                                    }}>
                                                        No FAQs found. Click "Add New FAQ" to create one.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div style={styles.pagination}>
                                            <button
                                                style={{
                                                    ...styles.pageButton,
                                                    ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' })
                                                }}
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                            
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                                <button
                                                    key={number}
                                                    style={{
                                                        ...styles.pageButton,
                                                        ...(currentPage === number && styles.activePageButton)
                                                    }}
                                                    onClick={() => paginate(number)}
                                                >
                                                    {number}
                                                </button>
                                            ))}
                                            
                                            <button
                                                style={{
                                                    ...styles.pageButton,
                                                    ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' })
                                                }}
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 style={{ color: theme.text }}>
                                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    color: theme.text,
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Question *</label>
                                <input
                                    type="text"
                                    name="faq_question"
                                    value={formData.faq_question}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                    placeholder="Enter the FAQ question"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Answer *</label>
                                <textarea
                                    name="faq_answe"
                                    value={formData.faq_answe}
                                    onChange={handleInputChange}
                                    style={styles.textarea}
                                    required
                                    placeholder="Enter the FAQ answer"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        ...styles.button,
                                        backgroundColor: '#6c757d',
                                        color: '#fff'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        ...styles.button,
                                        backgroundColor: '#007bff',
                                        color: '#fff'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (editingFaq ? 'Update' : 'Save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FqaSettings;