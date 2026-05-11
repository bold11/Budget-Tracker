import { useEffect, useState } from 'react';
import { getBudgets, createBudget, updateBudget, deleteBudget, getCategories, getTransactions } from '../services/api';
import ConfirmModal from './ConfirmModal';

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ categoryId: '', limit: '', dates: '' });
  const [errors, setErrors] = useState({ categoryId: '', limit: '', dates: '' });
  const [confirmId, setConfirmId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ categoryId: '', limit: '', dates: '' });
  const [editErrors, setEditErrors] = useState({ limit: '', dates: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [bRes, cRes, tRes] = await Promise.all([getBudgets(), getCategories(), getTransactions()]);
      setBudgets(bRes.data);
      setCategories(cRes.data);
      setTransactions(tRes.data);
      setFetchError('');
    } catch {
      setFetchError('Failed to load budgets.');
    }
  };

  const flashSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const validate = () => {
    const e = { categoryId: '', limit: '', dates: '' };
    let ok = true;
    if (!form.categoryId) { e.categoryId = 'Please select a category.'; ok = false; }
    if (!form.limit) { e.limit = 'Budget limit is required.'; ok = false; }
    else if (isNaN(form.limit) || Number(form.limit) <= 0) { e.limit = 'Must be > 0.'; ok = false; }
    else if (Number(form.limit) > 100000000) { e.limit = 'Cannot exceed 100,000,000.'; ok = false; }
    if (!form.dates) { e.dates = 'Please select a date.'; ok = false; }
    setErrors(e);
    return ok;
  };

  const validateEdit = () => {
    const e = { limit: '', dates: '' };
    let ok = true;
    if (!editForm.limit) { e.limit = 'Required.'; ok = false; }
    else if (isNaN(editForm.limit) || Number(editForm.limit) <= 0) { e.limit = 'Must be > 0.'; ok = false; }
    else if (Number(editForm.limit) > 100000000) { e.limit = 'Cannot exceed 100,000,000.'; ok = false; }
    if (!editForm.dates) { e.dates = 'Required.'; ok = false; }
    setEditErrors(e);
    return ok;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      await createBudget({
        categoryId: parseInt(form.categoryId),
        limit: parseFloat(form.limit),
        dates: form.dates
      });
      setForm({ categoryId: '', limit: '', dates: '' });
      setErrors({ categoryId: '', limit: '', dates: '' });
      fetchAll();
      flashSuccess('Budget added!');
    } catch {
      setFetchError('Failed to add budget. Please try again.');
    }
  };

  const handleEditClick = (b) => {
    setEditId(b.id || b.ID);
    setEditForm({
      categoryId: b.categoryId || b.CategoryId,
      limit: String(b.limit || b.Limit),
      dates: (b.dates || b.Dates)
        ? new Date(b.dates || b.Dates).toISOString().split('T')[0]
        : ''
    });
    setEditErrors({ limit: '', dates: '' });
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setEditErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSaveEdit = async () => {
    if (!validateEdit()) return;
    try {
      await updateBudget(editId, {
        ID: editId,
        CategoryId: parseInt(editForm.categoryId),
        Limit: parseFloat(editForm.limit),
        Dates: editForm.dates
      });
      setEditId(null);
      fetchAll();
      flashSuccess('Budget updated!');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || '';
      setFetchError(`Failed to update budget.${msg ? ' ' + msg : ' Please try again.'}`);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditErrors({ limit: '', dates: '' });
  };

  const handleDeleteClick = (id) => setConfirmId(id);
  const handleCancelDelete = () => setConfirmId(null);
  const handleConfirmDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await deleteBudget(id);
      fetchAll();
      flashSuccess('Budget deleted.');
    } catch {
      setFetchError('Failed to delete budget.');
    }
  };

  const getBudgeBadge = (b) => {
    const budgetDate = new Date(b.dates || b.Dates);
    const limit = b.limit || b.Limit;

    const spent = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return (
          t.categoryId === (b.categoryId || b.CategoryId) &&
          t.type?.toLowerCase() === 'expense' &&
          tDate.getMonth() === budgetDate.getMonth() &&
          tDate.getFullYear() === budgetDate.getFullYear()
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const pct = limit > 0 ? (spent / limit) * 100 : 0;

    if (pct > 100) return <span className="badge bg-danger ms-2">Over Budget</span>;
    if (pct >= 80) return <span className="badge bg-warning text-dark ms-2">⚠️ {pct.toFixed(0)}% used</span>;
    return <span className="badge bg-success ms-2">{pct.toFixed(0)}% used</span>;
  };

  return (
    <div className="page-content">
      <ConfirmModal
        show={confirmId !== null}
        message="Delete this budget? This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <h2 className="page-title">Budgets <span>Overview</span></h2>

      {fetchError && <div className="alert alert-danger py-2 rounded-3">{fetchError}</div>}
      {success && <div className="alert alert-success py-2 rounded-3">{success}</div>}

      {/* Add form */}
      <div className="card bt-card mb-4">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Add New Budget</h6>
          <div className="row g-2 align-items-start">

            {/* Category */}
            <div className="col-md-4">
              <select
                className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                value={form.categoryId}
                onChange={e => handleChange('categoryId', e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {categories.map(c => (
                  <option key={c.id || c.ID} value={c.id || c.ID}>{c.name || c.Name}</option>
                ))}
              </select>
              {errors.categoryId && <div className="invalid-feedback d-block">{errors.categoryId}</div>}
            </div>

            {/* Limit */}
            <div className="col-md-3">
              <input
                type="number"
                className={`form-control ${errors.limit ? 'is-invalid' : ''}`}
                placeholder="Budget Limit ($)"
                value={form.limit}
                min="0.01" step="0.01"
                onChange={e => handleChange('limit', e.target.value)}
              />
              {errors.limit && <div className="invalid-feedback d-block">{errors.limit}</div>}
            </div>

            {/* Date */}
            <div className="col-md-3">
              <input
                type="date"
                className={`form-control ${errors.dates ? 'is-invalid' : ''}`}
                value={form.dates}
                onChange={e => handleChange('dates', e.target.value)}
              />
              {errors.dates && <div className="invalid-feedback d-block">{errors.dates}</div>}
            </div>

            {/* Add button */}
            <div className="col-md-2">
              <button className="btn btn-bt-primary w-100" onClick={handleAdd}>+ Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bt-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Category</th>
              <th>Limit</th>
              <th>Date</th>
              <th style={{ width: 150 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No budgets yet. Add one above!
                </td>
              </tr>
            ) : budgets.map((b, i) => {
              const id = b.id || b.ID;
              const isEditing = editId === id;

              return (
                <tr key={id}>
                  <td>{i + 1}</td>

                  {/* Category — read-only in edit mode */}
                  <td>
                    {b.categoryDTO?.name ||
                      categories.find(c => (c.id || c.ID) === (b.categoryId || b.CategoryId))?.name ||
                      '—'}
                  </td>

                  {/* Limit */}
                  <td>
                    {isEditing ? (
                      <div>
                        <input
                          type="number"
                          className={`form-control form-control-sm ${editErrors.limit ? 'is-invalid' : ''}`}
                          value={editForm.limit}
                          min="0.01" step="0.01"
                          style={{ width: 130 }}
                          onChange={e => handleEditChange('limit', e.target.value)}
                        />
                        {editErrors.limit && <div className="invalid-feedback d-block">{editErrors.limit}</div>}
                      </div>
                    ) : (
                      <>
                        <span className="amount-income">${(b.limit || b.Limit).toFixed(2)}</span>
                        {getBudgeBadge(b)}
                      </>
                    )}
                  </td>

                  {/* Date */}
                  <td>
                    {isEditing ? (
                      <div>
                        <input
                          type="date"
                          className={`form-control form-control-sm ${editErrors.dates ? 'is-invalid' : ''}`}
                          value={editForm.dates}
                          onChange={e => handleEditChange('dates', e.target.value)}
                        />
                        {editErrors.dates && <div className="invalid-feedback d-block">{editErrors.dates}</div>}
                      </div>
                    ) : (
                      (b.dates || b.Dates)
                        ? new Date(b.dates || b.Dates).toLocaleDateString()
                        : '—'
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    {isEditing ? (
                      <div className="d-flex gap-1">
                        <button className="btn btn-bt-primary btn-sm" onClick={handleSaveEdit}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-bt-secondary btn-sm"
                          onClick={() => handleEditClick(b)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-bt-danger btn-sm"
                          onClick={() => handleDeleteClick(id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BudgetList;