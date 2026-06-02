import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';

const Query = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

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

    // Get current date
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Month list
    const months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' }
    ];

    // Years list (last 5 years to next 5 years)
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push(i);
    }

    // Fetch queries from API
    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`${API_BASE_URL}/queries`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (response.data.status === true) {
                setQueries(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch queries');
            }
        } catch (err) {
            console.error('Error fetching queries:', err);
            let errorMsg = 'Network error. Please try again.';
            if (err.response) {
                errorMsg = err.response.data?.message || 'Server error occurred';
            } else if (err.request) {
                errorMsg = 'No response from server. Please check your connection.';
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Get month name
    const getMonthName = (monthNumber) => {
        const month = months.find(m => m.value === monthNumber);
        return month ? month.name : '';
    };

    // Filter by month and year
    const filterByMonthYear = (query) => {
        const queryDate = new Date(query.created_at);
        const queryMonth = queryDate.getMonth() + 1;
        const queryYear = queryDate.getFullYear();

        if (selectedMonth && selectedYear) {
            return queryMonth === parseInt(selectedMonth) && queryYear === parseInt(selectedYear);
        } else if (selectedMonth) {
            return queryMonth === parseInt(selectedMonth);
        } else if (selectedYear) {
            return queryYear === parseInt(selectedYear);
        }
        return true;
    };

    // Search and filter logic
    const filteredQueries = queries
        .filter(query => 
            query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            query.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            query.message?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(filterByMonthYear);

    // Get statistics by month/year
    const getQueriesByMonthYear = (month, year) => {
        return queries.filter(query => {
            const queryDate = new Date(query.created_at);
            const queryMonth = queryDate.getMonth() + 1;
            const queryYear = queryDate.getFullYear();
            return queryMonth === month && queryYear === year;
        }).length;
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedMonth('');
        setSelectedYear('');
        setSearchTerm('');
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQueries.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pageNumbers.push(i);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="query" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            {/* Header Section */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div>
                                    <h2 style={{ color: theme.text, marginBottom: '5px' }}>
                                        <i className="bi bi-chat-dots-fill me-2"></i>
                                        Customer Queries
                                    </h2>
                                    <p style={{ color: theme.text === '#3e4b5b' ? '#6c757d' : '#a0aec0', margin: 0 }}>
                                        Manage and respond to customer inquiries
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <div className="input-group" style={{ width: '250px' }}>
                                        <span className="input-group-text" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search queries..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            style={{
                                                backgroundColor: theme.card,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                        />
                                    </div>
                                 
                                </div>
                            </div>

                            {/* Filter Section */}
                            <div className="card mb-4" style={{ 
                                backgroundColor: theme.card, 
                                border: `1px solid ${theme.border}`,
                                borderRadius: '12px'
                            }}>
                                <div className="card-body">
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-4">
                                            <label className="form-label mb-1" style={{ color: theme.text, fontSize: '13px', fontWeight: '500' }}>
                                                <i className="bi bi-calendar-month me-1"></i> Filter by Month
                                            </label>
                                            <select 
                                                className="form-select"
                                                value={selectedMonth}
                                                onChange={(e) => {
                                                    setSelectedMonth(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                style={{
                                                    backgroundColor: theme.card,
                                                    borderColor: theme.border,
                                                    color: theme.text
                                                }}
                                            >
                                                <option value="">All Months</option>
                                                {months.map(month => (
                                                    <option key={month.value} value={month.value}>
                                                        {month.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label mb-1" style={{ color: theme.text, fontSize: '13px', fontWeight: '500' }}>
                                                <i className="bi bi-calendar-year me-1"></i> Filter by Year
                                            </label>
                                            <select 
                                                className="form-select"
                                                value={selectedYear}
                                                onChange={(e) => {
                                                    setSelectedYear(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                style={{
                                                    backgroundColor: theme.card,
                                                    borderColor: theme.border,
                                                    color: theme.text
                                                }}
                                            >
                                                <option value="">All Years</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex gap-2">
                                               
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Active Filters Display */}
                                    {(selectedMonth || selectedYear || searchTerm) && (
                                        <div className="mt-3 pt-2">
                                            <small className="text-muted">Active filters:</small>
                                            <div className="d-flex flex-wrap gap-2 mt-1">
                                                {selectedMonth && (
                                                    <span className="badge" style={{ backgroundColor: '#3b82f6', padding: '5px 10px' }}>
                                                        <i className="bi bi-calendar-month me-1"></i>
                                                        {months.find(m => m.value === parseInt(selectedMonth))?.name}
                                                        <button 
                                                            onClick={() => setSelectedMonth('')}
                                                            className="btn-close btn-close-white ms-2"
                                                            style={{ fontSize: '8px', width: '8px', height: '8px' }}
                                                        ></button>
                                                    </span>
                                                )}
                                                {selectedYear && (
                                                    <span className="badge" style={{ backgroundColor: '#3b82f6', padding: '5px 10px' }}>
                                                        <i className="bi bi-calendar-year me-1"></i>
                                                        {selectedYear}
                                                        <button 
                                                            onClick={() => setSelectedYear('')}
                                                            className="btn-close btn-close-white ms-2"
                                                            style={{ fontSize: '8px', width: '8px', height: '8px' }}
                                                        ></button>
                                                    </span>
                                                )}
                                                {searchTerm && (
                                                    <span className="badge" style={{ backgroundColor: '#3b82f6', padding: '5px 10px' }}>
                                                        <i className="bi bi-search me-1"></i>
                                                        "{searchTerm}"
                                                        <button 
                                                            onClick={() => setSearchTerm('')}
                                                            className="btn-close btn-close-white ms-2"
                                                            style={{ fontSize: '8px', width: '8px', height: '8px' }}
                                                        ></button>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-3">
                                    <div className="card h-100" style={{ 
                                        backgroundColor: theme.card, 
                                        border: `1px solid ${theme.border}`,
                                        borderRadius: '12px',
                                        transition: 'transform 0.3s ease'
                                    }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="text-muted mb-2">Total Queries</h6>
                                                    <h3 className="mb-0" style={{ color: theme.text }}>{queries.length}</h3>
                                                </div>
                                                <div className="rounded-circle p-3" style={{ backgroundColor: '#3b82f620' }}>
                                                    <i className="bi bi-chat-dots-fill fs-3" style={{ color: '#3b82f6' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card h-100" style={{ 
                                        backgroundColor: theme.card, 
                                        border: `1px solid ${theme.border}`,
                                        borderRadius: '12px'
                                    }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="text-muted mb-2">This Month</h6>
                                                    <h3 className="mb-0" style={{ color: theme.text }}>
                                                        {getQueriesByMonthYear(currentMonth, currentYear)}
                                                    </h3>
                                                </div>
                                                <div className="rounded-circle p-3" style={{ backgroundColor: '#10b98120' }}>
                                                    <i className="bi bi-calendar-check fs-3" style={{ color: '#10b981' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card h-100" style={{ 
                                        backgroundColor: theme.card, 
                                        border: `1px solid ${theme.border}`,
                                        borderRadius: '12px'
                                    }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="text-muted mb-2">Filtered Results</h6>
                                                    <h3 className="mb-0" style={{ color: theme.text }}>{filteredQueries.length}</h3>
                                                </div>
                                                <div className="rounded-circle p-3" style={{ backgroundColor: '#f59e0b20' }}>
                                                    <i className="bi bi-funnel-fill fs-3" style={{ color: '#f59e0b' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card h-100" style={{ 
                                        backgroundColor: theme.card, 
                                        border: `1px solid ${theme.border}`,
                                        borderRadius: '12px'
                                    }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="text-muted mb-2">Response Rate</h6>
                                                    <h3 className="mb-0" style={{ color: theme.text }}>100%</h3>
                                                </div>
                                                <div className="rounded-circle p-3" style={{ backgroundColor: '#ef444420' }}>
                                                    <i className="bi bi-check-circle-fill fs-3" style={{ color: '#10b981' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Section */}
                            <div className="card" style={{ 
                                backgroundColor: theme.card, 
                                border: `1px solid ${theme.border}`,
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                                <div className="card-header" style={{ 
                                    backgroundColor: theme.card, 
                                    borderBottom: `1px solid ${theme.border}`,
                                    padding: '16px 20px'
                                }}>
                                    <h5 className="mb-0" style={{ color: theme.text }}>
                                        <i className="bi bi-table me-2"></i>
                                        Query List
                                        {filteredQueries.length > 0 && (
                                            <span className="ms-2 badge bg-primary">{filteredQueries.length} records</span>
                                        )}
                                    </h5>
                                </div>
                                <div className="card-body p-0">
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-3" style={{ color: theme.text }}>Loading queries...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center py-5">
                                            <i className="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
                                            <p className="mt-3" style={{ color: theme.text }}>{error}</p>
                                            <button className="btn btn-primary mt-2" onClick={fetchQueries}>
                                                <i className="bi bi-arrow-repeat me-1"></i> Try Again
                                            </button>
                                        </div>
                                    ) : currentItems.length === 0 ? (
                                        <div className="text-center py-5">
                                            <i className="bi bi-inbox-fill fs-1" style={{ color: theme.text === '#3e4b5b' ? '#cbd5e1' : '#475569' }}></i>
                                            <p className="mt-3" style={{ color: theme.text }}>
                                                {searchTerm || selectedMonth || selectedYear ? 'No matching queries found for selected filters' : 'No queries found'}
                                            </p>
                                            {(searchTerm || selectedMonth || selectedYear) && (
                                                <button className="btn btn-outline-secondary" onClick={clearFilters}>
                                                    Clear All Filters
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0" style={{ color: theme.text }}>
                                                <thead style={{ backgroundColor: theme.bg }}>
                                                    <tr>
                                                        <th style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>#</th>
                                                        <th style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                            <i className="bi bi-person me-1"></i> Name
                                                        </th>
                                                        <th style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                            <i className="bi bi-envelope me-1"></i> Email
                                                        </th>
                                                        <th style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                            <i className="bi bi-telephone me-1"></i> Phone
                                                        </th>
                                                        <th style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                            <i className="bi bi-chat-text me-1"></i> Message
                                                        </th>
                                                        <th style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                            <i className="bi bi-calendar me-1"></i> Date
                                                        </th>
                                                        <th style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                            <i className="bi bi-three-dots me-1"></i> Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentItems.map((query, index) => {
                                                        const queryDate = new Date(query.created_at);
                                                        const queryMonth = queryDate.getMonth() + 1;
                                                        const queryYear = queryDate.getFullYear();
                                                        return (
                                                            <tr key={query.id} style={{ transition: 'background-color 0.3s ease' }}>
                                                                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                                    {indexOfFirstItem + index + 1}
                                                                </td>
                                                                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="rounded-circle me-2 d-flex align-items-center justify-content-center" style={{
                                                                            width: '32px',
                                                                            height: '32px',
                                                                            backgroundColor: '#3b82f620',
                                                                            color: '#3b82f6'
                                                                        }}>
                                                                            {query.name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <strong>{query.name}</strong>
                                                                            {selectedMonth && queryMonth === parseInt(selectedMonth) && (
                                                                                <div>
                                                                                    <span className="badge bg-primary" style={{ fontSize: '10px' }}>
                                                                                        {getMonthName(queryMonth)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                                    <a href={`mailto:${query.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                                                                        {query.email}
                                                                    </a>
                                                                </td>
                                                                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                                    <a href={`tel:${query.phone}`} style={{ color: theme.text, textDecoration: 'none' }}>
                                                                        {query.phone}
                                                                    </a>
                                                                </td>
                                                                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                                    <div style={{ maxWidth: '250px' }}>
                                                                        <p className="mb-0 text-truncate" style={{ cursor: 'pointer' }} title={query.message}>
                                                                            {query.message.length > 50 ? query.message.substring(0, 50) + '...' : query.message}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                                    <small>{formatDate(query.created_at)}</small>
                                                                    <div>
                                                                        <small className="text-muted">
                                                                            {getMonthName(queryMonth)} {queryYear}
                                                                        </small>
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                                                                    <div className="btn-group btn-group-sm">
                                                                        <button 
                                                                            className="btn btn-outline-primary" 
                                                                            title="View Details"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target={`#viewModal${query.id}`}
                                                                        >
                                                                            <i className="bi bi-eye"></i>
                                                                        </button>
                                                                        <a 
                                                                            href={`mailto:${query.email}`} 
                                                                            className="btn btn-outline-success"
                                                                            title="Reply by Email"
                                                                        >
                                                                            <i className="bi bi-envelope-paper"></i>
                                                                        </a>
                                                                    </div>

                                                                    {/* View Modal */}
                                                                    <div className="modal fade" id={`viewModal${query.id}`} tabIndex="-1">
                                                                        <div className="modal-dialog modal-dialog-centered">
                                                                            <div className="modal-content" style={{ backgroundColor: theme.card }}>
                                                                                <div className="modal-header" style={{ borderBottomColor: theme.border }}>
                                                                                    <h5 className="modal-title" style={{ color: theme.text }}>
                                                                                        <i className="bi bi-chat-dots-fill me-2"></i>
                                                                                        Query Details
                                                                                    </h5>
                                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <div className="mb-3">
                                                                                        <label className="fw-bold mb-1">Name:</label>
                                                                                        <p className="mb-0">{query.name}</p>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                        <label className="fw-bold mb-1">Email:</label>
                                                                                        <p className="mb-0">
                                                                                            <a href={`mailto:${query.email}`}>{query.email}</a>
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                        <label className="fw-bold mb-1">Phone:</label>
                                                                                        <p className="mb-0">{query.phone}</p>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                        <label className="fw-bold mb-1">Message:</label>
                                                                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{query.message}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="fw-bold mb-1">Received:</label>
                                                                                        <p className="mb-0">
                                                                                            {formatDate(query.created_at)}
                                                                                            <br />
                                                                                            <small className="text-muted">
                                                                                                {getMonthName(queryMonth)} {queryYear}
                                                                                            </small>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="modal-footer" style={{ borderTopColor: theme.border }}>
                                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                                    <a href={`mailto:${query.email}`} className="btn btn-primary">
                                                                                        <i className="bi bi-envelope-paper me-1"></i> Reply
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {!loading && !error && filteredQueries.length > 0 && (
                                    <div className="card-footer" style={{ 
                                        backgroundColor: theme.card, 
                                        borderTop: `1px solid ${theme.border}`,
                                        padding: '16px 20px'
                                    }}>
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                            <div>
                                                <small style={{ color: theme.text }}>
                                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredQueries.length)} of {filteredQueries.length} entries
                                                </small>
                                            </div>
                                            <div>
                                                <ul className="pagination mb-0">
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button 
                                                            className="page-link" 
                                                            onClick={() => paginate(currentPage - 1)}
                                                            style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
                                                        >
                                                            <i className="bi bi-chevron-left"></i>
                                                        </button>
                                                    </li>
                                                    {getPageNumbers().map((page, index) => (
                                                        <li key={index} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                                                            {page === '...' ? (
                                                                <span className="page-link" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>...</span>
                                                            ) : (
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => paginate(page)}
                                                                    style={{
                                                                        backgroundColor: page === currentPage ? '#3b82f6' : theme.card,
                                                                        borderColor: theme.border,
                                                                        color: page === currentPage ? '#fff' : theme.text
                                                                    }}
                                                                >
                                                                    {page}
                                                                </button>
                                                            )}
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button 
                                                            className="page-link" 
                                                            onClick={() => paginate(currentPage + 1)}
                                                            style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
                                                        >
                                                            <i className="bi bi-chevron-right"></i>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Query;