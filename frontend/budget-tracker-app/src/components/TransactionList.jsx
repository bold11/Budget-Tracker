import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions, updateTransaction, deleteTransaction, getCategories } from '../services/api';
import ConfirmModal from './ConfirmModal';
import { FaSearch } from "react-icons/fa";

function TransactionList() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState(null); // delete modal

  // Edit form
  const empty = { description: '', amount: '', type: 'Income', date: '', categoryId: '' };
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(empty);
  const [editErrors, setEditErrors] = useState({});

  //Search
  const [searchDesc, setSearchDesc] = useState('');
  // Filtering & sorting
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [sortDir, setSortDir] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [tRes, cRes] = await Promise.all([getTransactions(), getCategories()]);
      setTransactions(tRes.data);
      setCategories(cRes.data);
    } catch {
      setError('Failed to load data.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setEditErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.description.trim()) e.description = 'Description is required.';
    else if (editForm.description.trim().length > 200) e.description = 'Max 200 characters.';
    if (!editForm.amount) e.amount = 'Amount is required.';
    else if (Number(editForm.amount) <= 0) e.amount = 'Must be > 0.';
    else if (Number(editForm.amount) > 1000000) e.amount = 'Cannot exceed 1,000,000.';
    if (!editForm.date) e.date = 'Date is required.';
    if (!editForm.categoryId) e.categoryId = 'Please select a category.';
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setEditForm({
      description: t.description,
      amount: t.amount,
      type: t.type,
      date: t.date.slice(0, 10),
      categoryId: t.categoryId
    });
    setEditErrors({});
  };

  const handleUpdate = async (id) => {
    if (!validateEdit()) return;
    try {
      await updateTransaction(id, { id, ...editForm, amount: parseFloat(editForm.amount), categoryId: parseInt(editForm.categoryId) });
      setEditId(null);
      setError('');
      fetchAll();
    } catch {
      setError('Failed to update transaction.');
    }
  };

  // Delete 
  const handleDeleteClick = (id) => setConfirmId(id);
  const handleCancelDelete = () => setConfirmId(null);
  const handleConfirmDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await deleteTransaction(id);
      fetchAll();
    } catch {
      setError('Failed to delete transaction.');
    }
  };

  // Filter + sort
  const getDisplay = () => {
    let result = [...transactions];
    if (searchDesc.trim()) result = result.filter(t =>
      t.description?.toLowerCase().includes(searchDesc.toLowerCase())
    );
    if (filterType !== 'All') result = result.filter(t => t.type.toLowerCase() === filterType.toLowerCase());
    if (filterCategory) result = result.filter(t => t.categoryId === parseInt(filterCategory));
    if (filterFrom) result = result.filter(t => t.date.slice(0, 10) >= filterFrom);
    if (filterTo) result = result.filter(t => t.date.slice(0, 10) <= filterTo);
    result.sort((a, b) => {
      if (sortDir === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortDir === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortDir === 'amt-desc') return b.amount - a.amount;
      if (sortDir === 'amt-asc') return a.amount - b.amount;
      return 0;
    });
    return result;
  };

  const displayed = getDisplay();

  const resetFilters = () => {
    setFilterType('All'); setFilterCategory(''); setFilterFrom(''); setFilterTo(''); setSortDir('date-desc');
    setSortDir('date-desc'); setSearchDesc('');
  };

  return (
    <div className="page-content">
      {/* Confirm modal */}
      <ConfirmModal
        show={confirmId !== null}
        message="Delete this transaction? This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <h2 className="page-title">Transactions <span>History</span></h2>
      {error && <div className="alert alert-danger py-2 rounded-3">{error}</div>}

      {/* Top bar: filters toggle + add button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          style={{ borderRadius: 8, fontWeight: 500 }}
          onClick={() => setShowFilters(prev => !prev)}
        >

          {showFilters ? 'Hide Filters' : 'Filter & Sort'}
        </button>

        {/* Description search  */}
        <div style={{ position: 'relative', maxWidth: 240 }}>
          <FaSearch size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search description..."
            style={{ borderRadius: 8, paddingLeft: 28 }}
            value={searchDesc}
            onChange={e => setSearchDesc(e.target.value)}
          />
        </div>
        <button className="btn btn-bt-primary" onClick={() => navigate('/transactions/add')}>
          + Add Transaction
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card filter-card mb-3">
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Type</label>
                <select className="form-select form-select-sm" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="col">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Category</label>
                <select className="form-select form-select-sm" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>From</label>
                <input className="form-control form-control-sm" type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
              </div>
              <div className="col">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>To</label>
                <input className="form-control form-control-sm" type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} />
              </div>
              <div className="col">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Sort</label>
                <select className="form-select form-select-sm" value={sortDir} onChange={e => setSortDir(e.target.value)}>
                  <option value="date-desc">Date: Newest First</option>
                  <option value="date-asc">Date: Oldest First</option>
                  <option value="amt-desc">Amount: High → Low</option>
                  <option value="amt-asc">Amount: Low → High</option>
                </select>
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-danger btn-sm" style={{ borderRadius: 8 }} onClick={resetFilters}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
        Showing <strong>{displayed.length}</strong> of {transactions.length} transactions
      </p>

      {/* Table */}
      <div className="bt-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted py-4">No transactions found.</td></tr>
            ) : displayed.map(t => (
              <tr key={t.id} className={editId === t.id ? 'editing-row' : ''}>
                <td>{t.id}</td>

                {/* Description */}
                <td>
                  {editId === t.id ? (
                    <div>
                      <input className={`form-control form-control-sm ${editErrors.description ? 'is-invalid' : ''}`}
                        name="description" value={editForm.description} onChange={handleChange} />
                      {editErrors.description && <div className="invalid-feedback d-block" style={{ fontSize: '0.75rem' }}>{editErrors.description}</div>}
                    </div>
                  ) : t.description}
                </td>

                {/* Amount */}
                <td>
                  {editId === t.id ? (
                    <div>
                      <input className={`form-control form-control-sm ${editErrors.amount ? 'is-invalid' : ''}`}
                        type="number" name="amount" value={editForm.amount} onChange={handleChange} />
                      {editErrors.amount && <div className="invalid-feedback d-block" style={{ fontSize: '0.75rem' }}>{editErrors.amount}</div>}
                    </div>
                  ) : (
                    <span className={t.type?.toLowerCase() === 'income' ? 'amount-income' : 'amount-expense'}>
                      {t.type?.toLowerCase() === 'income' ? '+' : '−'}${t.amount.toFixed(2)}
                    </span>
                  )}
                </td>

                {/* Type */}
                <td>
                  {editId === t.id ? (
                    <select className="form-select form-select-sm" name="type" value={editForm.type} onChange={handleChange}>
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                    </select>
                  ) : (
                    <span className={t.type?.toLowerCase() === 'income' ? 'badge-income' : 'badge-expense'}>
                      {t.type}
                    </span>
                  )}
                </td>

                {/* Date */}
                <td>
                  {editId === t.id ? (
                    <div>
                      <input className={`form-control form-control-sm ${editErrors.date ? 'is-invalid' : ''}`}
                        type="date" name="date" value={editForm.date} onChange={handleChange} />
                      {editErrors.date && <div className="invalid-feedback d-block" style={{ fontSize: '0.75rem' }}>{editErrors.date}</div>}
                    </div>
                  ) : t.date.slice(0, 10)}
                </td>

                {/* Category */}
                <td>
                  {editId === t.id ? (
                    <div>
                      <select className={`form-select form-select-sm ${editErrors.categoryId ? 'is-invalid' : ''}`}
                        name="categoryId" value={editForm.categoryId} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {editErrors.categoryId && <div className="invalid-feedback d-block" style={{ fontSize: '0.75rem' }}>{editErrors.categoryId}</div>}
                    </div>
                  ) : t.categoryDTO?.name}
                </td>

                {/* Actions */}
                <td>
                  {editId === t.id ? (
                    <div className="d-flex gap-1">
                      <button className="btn btn-success btn-sm" style={{ borderRadius: 7 }}
                        onClick={() => handleUpdate(t.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" style={{ borderRadius: 7 }}
                        onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="d-flex gap-1">
                      <button className="btn btn-bt-warning btn-sm" onClick={() => startEdit(t)}>Edit</button>
                      <button className="btn btn-bt-danger btn-sm" onClick={() => handleDeleteClick(t.id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionList;
