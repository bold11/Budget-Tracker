import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import ConfirmModal from './ConfirmModal';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [nameNew, setNameNew]       = useState('');
  const [editId, setEditId]         = useState(null);
  const [editName, setEditName]     = useState('');
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      setError('Failed to load categories.');
    }
  };

  // Clear messages after 3 seconds
  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };
  const flashError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  // Add
  const handleAdd = async () => {
    if (!nameNew.trim()) return flashError('Category name is required.');
    try {
      await createCategory({ name: nameNew });
      setNameNew('');
      fetchCategories();
      flashSuccess('Category added!');
    } catch {
      flashError('Failed to add category. Please try again.');
    }
  };

  // Allow Enter to add
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  // Edit
  const startEdit = (c) => { setEditId(c.id); setEditName(c.name); };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return flashError('Category name is required.');
    try {
      await updateCategory(id, { id, name: editName });
      setEditId(null);
      fetchCategories();
      flashSuccess('Category updated!');
    } catch {
      flashError('Failed to update category.');
    }
  };

  // Delete 
  const handleDeleteClick   = (id)  => setConfirmId(id);
  const handleCancelDelete  = ()    => setConfirmId(null);
  const handleConfirmDelete = async () => {
    const id = confirmId;
    setConfirmId(null); // close modal immediately
    try {
      await deleteCategory(id);
      fetchCategories();
      flashSuccess('Category deleted.');
    } catch {
      flashError('Failed to delete category.');
    }
  };

  return (
    <div className="page-content">
      {/* Confirm delete modal */}
      <ConfirmModal
        show={confirmId !== null}
        message="Delete this category? Any linked transactions or budgets may also be affected."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <h2 className="page-title">Categories <span>Management</span></h2>

      {/* Alerts */}
      {error   && <div className="alert alert-danger  py-2 rounded-3">{error}</div>}
      {success && <div className="alert alert-success py-2 rounded-3">{success}</div>}

      {/* Add form */}
      <div className="card bt-card mb-4">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Add New Category</h6>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              style={{ maxWidth: 320 }}
              placeholder="e.g. Groceries"
              value={nameNew}
              onChange={e => setNameNew(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-bt-primary" onClick={handleAdd}>
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bt-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Name</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">
                  No categories yet. Add one above!
                </td>
              </tr>
            ) : categories.map(cat => (
              <tr key={cat.id} className={editId === cat.id ? 'editing-row' : ''}>
                <td>{cat.id}</td>

                {/* Name: either read or edit input */}
                <td>
                  {editId === cat.id
                    ? <input
                        className="form-control form-control-sm"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                      />
                    : cat.name
                  }
                </td>

                {/* Actions */}
                <td>
                  {editId === cat.id ? (
                    <div className="d-flex gap-1">
                      <button className="btn btn-success btn-sm" style={{ borderRadius: 7 }}
                        onClick={() => handleUpdate(cat.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" style={{ borderRadius: 7 }}
                        onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="d-flex gap-1">
                      <button className="btn btn-bt-warning btn-sm"
                        onClick={() => startEdit(cat)}>Edit</button>
                      <button className="btn btn-bt-danger btn-sm"
                        onClick={() => handleDeleteClick(cat.id)}>Delete</button>
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

export default CategoryList;
