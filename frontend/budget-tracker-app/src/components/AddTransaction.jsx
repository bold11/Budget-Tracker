import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction, getCategories } from '../services/api';

function AddTransaction() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '', type: '', date: '', categoryId: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(() => setServerError('Could not load categories.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!form.description.trim()) err.description = 'Description is required.';
    else if (form.description.trim().length > 200) err.description = 'Max 200 characters.';
    if (!form.amount) err.amount = 'Amount is required.';
    else if (isNaN(form.amount) || Number(form.amount) <= 0) err.amount = 'Must be > 0.';
    else if (Number(form.amount) > 1000000) err.amount = 'Cannot exceed 1,000,000.';
    if (!form.type) err.type = 'Please select Income or Expense.';
    if (!form.date) err.date = 'Date is required.';
    if (!form.categoryId) err.categoryId = 'Please select a category.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await createTransaction({ ...form, amount: parseFloat(form.amount), categoryId: parseInt(form.categoryId) });
      navigate('/transactions');
    } catch (err) {
      const apiMsg = err.response?.data?.errors;
      if (apiMsg) {
        const mapped = {};
        Object.entries(apiMsg).forEach(([key, msgs]) => { mapped[key.toLowerCase()] = msgs[0]; });
        setErrors(prev => ({ ...prev, ...mapped }));
      } else {
        setServerError('Failed to add transaction. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 600 }}>
        <h2 className="page-title">Add <span>Transaction</span></h2>

        {serverError && <div className="alert alert-danger py-2 rounded-3">{serverError}</div>}

        <div className="card bt-card">
          <div className="card-body" style={{ padding: '1.75rem' }}>
            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Description</label>
              <input className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                name="description" value={form.description} onChange={handleChange}
                placeholder="e.g. Monthly rent" maxLength={200} />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            {/* Amount */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Amount ($)</label>
              <input type="number" className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                name="amount" value={form.amount} onChange={handleChange}
                placeholder="0.00" min="0.01" step="0.01" />
              {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
            </div>

            {/* Type */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Type</label>
              <select className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                name="type" value={form.type} onChange={handleChange}>
                <option value="">-- Select Type --</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              {errors.type && <div className="invalid-feedback">{errors.type}</div>}
            </div>

            {/* Date */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Date</label>
              <input type="date" className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                name="date" value={form.date} onChange={handleChange} />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Category</label>
              <select className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                name="categoryId" value={form.categoryId} onChange={handleChange}>
                <option value="">-- Select Category --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <button className="btn btn-bt-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving…' : '✓ Save Transaction'}
              </button>
              <button className="btn btn-outline-secondary" style={{ borderRadius: 8 }}
                onClick={() => navigate('/transactions')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
