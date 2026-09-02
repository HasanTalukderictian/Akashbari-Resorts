// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const FqaSettings = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [faqs, setFaqs] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [editingFaq, setEditingFaq] = useState(null);
//     const [formData, setFormData] = useState({
//         faq_question: '',
//         faq_answe: ''
//     });
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [totalItems, setTotalItems] = useState(0);

//     // Get API base URL from environment variables
//     const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '24px' },
//         footerWrapper: { flexShrink: 0 },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             backgroundColor: theme.card,
//             borderRadius: '8px',
//             overflow: 'hidden',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         },
//         th: {
//             backgroundColor: theme.isDarkMode ? '#2d3436' : '#f8f9fa',
//             color: theme.text,
//             padding: '12px',
//             textAlign: 'left',
//             borderBottom: `2px solid ${theme.border}`
//         },
//         td: {
//             padding: '12px',
//             color: theme.text,
//             borderBottom: `1px solid ${theme.border}`
//         },
//         button: {
//             padding: '8px 12px',
//             margin: '0 4px',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '4px'
//         },
//         addButton: {
//             backgroundColor: '#007bff',
//             color: '#fff',
//             padding: '10px 20px',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             marginBottom: '20px',
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '8px'
//         },
//         modal: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000
//         },
//         modalContent: {
//             backgroundColor: theme.card,
//             padding: '30px',
//             borderRadius: '8px',
//             maxWidth: '600px',
//             width: '90%',
//             maxHeight: '80vh',
//             overflowY: 'auto'
//         },
//         formGroup: {
//             marginBottom: '15px'
//         },
//         label: {
//             display: 'block',
//             marginBottom: '5px',
//             color: theme.text,
//             fontWeight: '500'
//         },
//         input: {
//             width: '100%',
//             padding: '10px',
//             border: `1px solid ${theme.border}`,
//             borderRadius: '4px',
//             backgroundColor: theme.isDarkMode ? '#2d3436' : '#fff',
//             color: theme.text,
//             fontSize: '14px'
//         },
//         textarea: {
//             width: '100%',
//             padding: '10px',
//             border: `1px solid ${theme.border}`,
//             borderRadius: '4px',
//             backgroundColor: theme.isDarkMode ? '#2d3436' : '#fff',
//             color: theme.text,
//             fontSize: '14px',
//             minHeight: '100px',
//             resize: 'vertical'
//         },
//         pagination: {
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: '20px 0',
//             gap: '10px'
//         },
//         pageButton: {
//             padding: '8px 12px',
//             border: `1px solid ${theme.border}`,
//             borderRadius: '4px',
//             backgroundColor: theme.card,
//             color: theme.text,
//             cursor: 'pointer'
//         },
//         activePageButton: {
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none'
//         },
//         actionButton: {
//             background: 'none',
//             border: 'none',
//             cursor: 'pointer',
//             padding: '4px 8px',
//             fontSize: '18px',
//             transition: 'transform 0.2s'
//         }
//     };

//     // Fetch FAQs
//     const fetchFaqs = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/faqs`);
            
//             // Check if response data is an array
//             let faqData = [];
//             if (Array.isArray(response.data)) {
//                 faqData = response.data;
//             } else if (response.data && typeof response.data === 'object') {
//                 // If response is an object with data property (common in Laravel API)
//                 if (Array.isArray(response.data.data)) {
//                     faqData = response.data.data;
//                 } else if (Array.isArray(response.data.faqs)) {
//                     faqData = response.data.faqs;
//                 } else {
//                     // Try to convert object values to array if they have numeric keys
//                     const values = Object.values(response.data);
//                     if (values.some(v => typeof v === 'object' && v !== null)) {
//                         faqData = values;
//                     } else {
//                         faqData = [response.data];
//                     }
//                 }
//             }
            
//             setFaqs(faqData);
//             setTotalItems(faqData.length);
//             setError(null);
//         } catch (err) {
//             setError('Failed to fetch FAQs');
//             console.error('Error fetching FAQs:', err);
//             setFaqs([]);
//             setTotalItems(0);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchFaqs();
//     }, []);

//     // Handle form input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     // Reset form
//     const resetForm = () => {
//         setFormData({
//             faq_question: '',
//             faq_answe: ''
//         });
//         setEditingFaq(null);
//     };

//     // Open modal for adding
//     const handleAddClick = () => {
//         resetForm();
//         setShowModal(true);
//     };

//     // Open modal for editing
//     const handleEditClick = (faq) => {
//         setEditingFaq(faq);
//         setFormData({
//             faq_question: faq.faq_question || '',
//             faq_answe: faq.faq_answe || ''
//         });
//         setShowModal(true);
//     };

//     // Submit form (Create or Update)
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         try {
//             if (editingFaq) {
//                 // Update existing FAQ
//                 await axios.put(`${API_BASE_URL}/faqs/${editingFaq.id}`, formData);
//             } else {
//                 // Create new FAQ
//                 await axios.post(`${API_BASE_URL}/faqs`, formData);
//             }
//             await fetchFaqs();
//             setShowModal(false);
//             resetForm();
//         } catch (err) {
//             setError('Failed to save FAQ');
//             console.error('Error saving FAQ:', err);
//             if (err.response && err.response.data && err.response.data.message) {
//                 setError(err.response.data.message);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete FAQ
//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this FAQ?')) {
//             try {
//                 await axios.delete(`${API_BASE_URL}/faqs/${id}`);
//                 await fetchFaqs();
//                 setError(null);
//             } catch (err) {
//                 setError('Failed to delete FAQ');
//                 console.error('Error deleting FAQ:', err);
//                 if (err.response && err.response.data && err.response.data.message) {
//                     setError(err.response.data.message);
//                 }
//             }
//         }
//     };

//     // Pagination logic - ensure faqs is an array
//     const faqsArray = Array.isArray(faqs) ? faqs : [];
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = faqsArray.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

//                 <div style={styles.mainArea} className="flex-grow-1">
//                     <Header 
//                         theme={theme} 
//                         isDarkMode={isDarkMode} 
//                         toggleDarkMode={toggleDarkMode} 
//                         toggleSidebar={toggleSidebar} 
//                     />

//                     <div style={styles.contentContainer}>
//                         <div style={styles.contentScroll}>
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <h2 style={{ color: theme.text }}>FAQ Management</h2>
//                                 <button 
//                                     style={styles.addButton}
//                                     onClick={handleAddClick}
//                                 >
//                                     <span>➕</span> Add New FAQ
//                                 </button>
//                             </div>

//                             {error && (
//                                 <div className="alert alert-danger" role="alert">
//                                     {error}
//                                 </div>
//                             )}

//                             {loading ? (
//                                 <div style={{ color: theme.text, textAlign: 'center', padding: '50px' }}>
//                                     Loading...
//                                 </div>
//                             ) : (
//                                 <>
//                                     <table style={styles.table}>
//                                         <thead>
//                                             <tr>
//                                                 <th style={styles.th}>#</th>
//                                                 <th style={styles.th}>Question</th>
//                                                 <th style={styles.th}>Answer</th>
//                                                 <th style={styles.th}>Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {currentItems.length > 0 ? (
//                                                 currentItems.map((faq, index) => (
//                                                     <tr key={faq.id || index}>
//                                                         <td style={styles.td}>
//                                                             {indexOfFirstItem + index + 1}
//                                                         </td>
//                                                         <td style={styles.td}>
//                                                             {faq.faq_question || 'N/A'}
//                                                         </td>
//                                                         <td style={styles.td}>
//                                                             {faq.faq_answe && faq.faq_answe.length > 100 
//                                                                 ? `${faq.faq_answe.substring(0, 100)}...` 
//                                                                 : faq.faq_answe || 'N/A'}
//                                                         </td>
//                                                         <td style={styles.td}>
//                                                             <button
//                                                                 style={{
//                                                                     ...styles.actionButton,
//                                                                     color: '#28a745'
//                                                                 }}
//                                                                 onClick={() => handleEditClick(faq)}
//                                                                 title="Edit FAQ"
//                                                             >
//                                                                 ✏️
//                                                             </button>
//                                                             <button
//                                                                 style={{
//                                                                     ...styles.actionButton,
//                                                                     color: '#dc3545'
//                                                                 }}
//                                                                 onClick={() => handleDelete(faq.id)}
//                                                                 title="Delete FAQ"
//                                                             >
//                                                                 🗑️
//                                                             </button>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan="4" style={{ 
//                                                         ...styles.td, 
//                                                         textAlign: 'center',
//                                                         padding: '40px'
//                                                     }}>
//                                                         No FAQs found. Click "Add New FAQ" to create one.
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </tbody>
//                                     </table>

//                                     {/* Pagination */}
//                                     {totalPages > 1 && (
//                                         <div style={styles.pagination}>
//                                             <button
//                                                 style={{
//                                                     ...styles.pageButton,
//                                                     ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' })
//                                                 }}
//                                                 onClick={() => paginate(currentPage - 1)}
//                                                 disabled={currentPage === 1}
//                                             >
//                                                 Previous
//                                             </button>
                                            
//                                             {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                                                 <button
//                                                     key={number}
//                                                     style={{
//                                                         ...styles.pageButton,
//                                                         ...(currentPage === number && styles.activePageButton)
//                                                     }}
//                                                     onClick={() => paginate(number)}
//                                                 >
//                                                     {number}
//                                                 </button>
//                                             ))}
                                            
//                                             <button
//                                                 style={{
//                                                     ...styles.pageButton,
//                                                     ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' })
//                                                 }}
//                                                 onClick={() => paginate(currentPage + 1)}
//                                                 disabled={currentPage === totalPages}
//                                             >
//                                                 Next
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>

//                         <div style={styles.footerWrapper}>
//                             <Footer theme={theme} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Modal */}
//             {showModal && (
//                 <div style={styles.modal} onClick={() => setShowModal(false)}>
//                     <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                             <h3 style={{ color: theme.text }}>
//                                 {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
//                             </h3>
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 style={{
//                                     background: 'none',
//                                     border: 'none',
//                                     fontSize: '24px',
//                                     color: theme.text,
//                                     cursor: 'pointer'
//                                 }}
//                             >
//                                 ×
//                             </button>
//                         </div>
                        
//                         <form onSubmit={handleSubmit}>
//                             <div style={styles.formGroup}>
//                                 <label style={styles.label}>Question *</label>
//                                 <input
//                                     type="text"
//                                     name="faq_question"
//                                     value={formData.faq_question}
//                                     onChange={handleInputChange}
//                                     style={styles.input}
//                                     required
//                                     placeholder="Enter the FAQ question"
//                                 />
//                             </div>

//                             <div style={styles.formGroup}>
//                                 <label style={styles.label}>Answer *</label>
//                                 <textarea
//                                     name="faq_answe"
//                                     value={formData.faq_answe}
//                                     onChange={handleInputChange}
//                                     style={styles.textarea}
//                                     required
//                                     placeholder="Enter the FAQ answer"
//                                 />
//                             </div>

//                             <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowModal(false)}
//                                     style={{
//                                         ...styles.button,
//                                         backgroundColor: '#6c757d',
//                                         color: '#fff'
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     style={{
//                                         ...styles.button,
//                                         backgroundColor: '#007bff',
//                                         color: '#fff'
//                                     }}
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Saving...' : (editingFaq ? 'Update' : 'Save')}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FqaSettings;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const EMPTY_FORM = { faq_question: '', faq_answe: '' };
const ITEMS_PER_PAGE = 10;

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';

// Normalizes whatever shape the API returns into a plain array
const extractFaqArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data.faqs)) return data.faqs;
        const values = Object.values(data);
        if (values.some(v => typeof v === 'object' && v !== null)) return values;
        return [data];
    }
    return [];
};

const Modal = ({ theme, title, icon, iconColor, onClose, children, footer }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(20,20,30,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, borderRadius: '18px', width: '100%', maxWidth: '600px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)', animation: 'slideIn .25s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ color: theme.text, margin: 0, fontWeight: 600 }}>
                    <i className={`bi ${icon} me-2`} style={{ color: iconColor }}></i>{title}
                </h5>
                <button onClick={onClose} style={{
                    background: 'transparent', border: 'none', fontSize: '22px',
                    color: theme.text, opacity: 0.6, cursor: 'pointer'
                }}>✕</button>
            </div>
            <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{
                    padding: '16px 22px', borderTop: `1px solid ${theme.border}`,
                    display: 'flex', justifyContent: 'flex-end', gap: '10px'
                }}>{footer}</div>
            )}
        </div>
    </div>
);

const FqaSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [deletingFaq, setDeletingFaq] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const [currentPage, setCurrentPage] = useState(1);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#15172b' : '#f5f3f7',
        card: isDarkMode ? '#1d2140' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#333a4d',
        border: isDarkMode ? '#2c2f4d' : '#e7e5ee',
        accent: '#6c5ce7'
    };

    const fieldStyle = {
        backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
        borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const fetchFaqs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/faqs`);
            setFaqs(extractFaqArray(res.data));
        } catch (err) {
            console.error('Error fetching FAQs:', err);
            setError('Failed to fetch FAQs');
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFaqs(); }, []);

    const closeModal = () => { setShowModal(false); setEditingFaq(null); setFormData(EMPTY_FORM); };

    const openAddModal = () => { setEditingFaq(null); setFormData(EMPTY_FORM); setShowModal(true); };

    const openEditModal = (faq) => {
        setEditingFaq(faq);
        setFormData({ faq_question: faq.faq_question || '', faq_answe: faq.faq_answe || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editingFaq) {
                await axios.put(`${API_BASE_URL}/faqs/${editingFaq.id}`, formData);
            } else {
                await axios.post(`${API_BASE_URL}/faqs`, formData);
            }
            await fetchFaqs();
            closeModal();
        } catch (err) {
            console.error('Error saving FAQ:', err);
            setError(err.response?.data?.message || 'Failed to save FAQ');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingFaq) return;
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/faqs/${deletingFaq.id}`);
            await fetchFaqs();
            setDeletingFaq(null);
        } catch (err) {
            console.error('Error deleting FAQ:', err);
            setError(err.response?.data?.message || 'Failed to delete FAQ');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(faqs.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = faqs.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>FAQ Management</h2>
                                    <p style={{ color: theme.text, opacity: 0.65 }}>Manage frequently asked questions</p>
                                </div>
                                <button className="btn" style={{ backgroundColor: theme.accent, color: '#fff' }} onClick={openAddModal}>
                                    <i className="bi bi-plus-circle me-2"></i>Add New FAQ
                                </button>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
                                    <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                        <tr>
                                            {['#', 'Question', 'Answer', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-5">
                                                <div className="spinner-border" style={{ color: theme.accent }} role="status"></div>
                                                <p className="mt-2" style={{ color: theme.text }}>Loading FAQs...</p>
                                            </td></tr>
                                        ) : currentItems.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-5" style={{ color: theme.text }}>
                                                <i className="bi bi-question-circle display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                <h5>No FAQs found</h5>
                                                <p style={{ opacity: 0.65 }}>Click "Add New FAQ" to create one.</p>
                                            </td></tr>
                                        ) : currentItems.map((faq, i) => (
                                            <tr key={faq.id || i} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{indexOfFirstItem + i + 1}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{faq.faq_question || 'N/A'}</strong></td>
                                                <td style={{ padding: '12px 16px', opacity: 0.85 }}>
                                                    {faq.faq_answe?.length > 100 ? `${faq.faq_answe.substring(0, 100)}...` : (faq.faq_answe || 'N/A')}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-primary" onClick={() => openEditModal(faq)} title="Edit FAQ"><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-outline-danger" onClick={() => setDeletingFaq(faq)} title="Delete FAQ"><i className="bi bi-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center align-items-center gap-2 py-4">
                                    <button
                                        className="btn btn-sm"
                                        style={{ border: `1px solid ${theme.border}`, color: theme.text, opacity: currentPage === 1 ? 0.5 : 1 }}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                        <button
                                            key={num}
                                            className="btn btn-sm"
                                            style={{
                                                border: `1px solid ${theme.border}`,
                                                backgroundColor: currentPage === num ? theme.accent : 'transparent',
                                                color: currentPage === num ? '#fff' : theme.text
                                            }}
                                            onClick={() => setCurrentPage(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button
                                        className="btn btn-sm"
                                        style={{ border: `1px solid ${theme.border}`, color: theme.text, opacity: currentPage === totalPages ? 0.5 : 1 }}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {showModal && (
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                        icon={editingFaq ? 'bi-pencil-square' : 'bi-plus-circle'}
                        iconColor={theme.accent}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                    : <><i className="bi bi-save me-2"></i>{editingFaq ? 'Update' : 'Save'}</>}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
                                Question <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.faq_question}
                                onChange={(e) => setFormData({ ...formData, faq_question: e.target.value })}
                                style={fieldStyle}
                                placeholder="Enter the FAQ question"
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
                                Answer <span className="text-danger">*</span>
                            </label>
                            <textarea
                                required
                                rows="4"
                                value={formData.faq_answe}
                                onChange={(e) => setFormData({ ...formData, faq_answe: e.target.value })}
                                style={{ ...fieldStyle, minHeight: '100px' }}
                                placeholder="Enter the FAQ answer"
                            />
                        </div>
                    </Modal>
                </form>
            )}

            {deletingFaq && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !loading && setDeletingFaq(null)}
                >
                    <div style={{
                        backgroundColor: theme.isDarkMode ? '#000' : '#fff',
                        color: theme.isDarkMode ? '#fff' : '#000',
                        border: `1px solid ${theme.isDarkMode ? '#333' : '#000'}`,
                        borderRadius: '14px', width: '100%', maxWidth: '380px',
                        padding: '28px 26px', textAlign: 'center',
                        animation: 'slideIn .2s ease'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.isDarkMode ? '#fff' : '#000'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '22px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this FAQ?</h5>
                        <p style={{ margin: '0 0 22px', opacity: 0.7, fontSize: '14px' }}>
                            "{deletingFaq.faq_question}" will be permanently removed. This can't be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setDeletingFaq(null)}
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
                                    backgroundColor: 'transparent',
                                    color: theme.isDarkMode ? '#fff' : '#000',
                                    border: `1px solid ${theme.isDarkMode ? '#fff' : '#000'}`,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
                                    backgroundColor: theme.isDarkMode ? '#fff' : '#000',
                                    color: theme.isDarkMode ? '#000' : '#fff',
                                    border: `1px solid ${theme.isDarkMode ? '#fff' : '#000'}`,
                                    cursor: 'pointer'
                                }}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(-24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .form-control, .form-select {
                    background-color: ${theme.bg} !important;
                    color: ${theme.text} !important;
                    border-color: ${theme.border} !important;
                }
                .table tbody tr:hover { background-color: ${theme.accent}0d !important; }
                .btn-group .btn { border-radius: 6px; padding: 4px 10px; margin: 0 2px; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: ${theme.accent}; }
            `}</style>
        </div>
    );
};

export default FqaSettings;