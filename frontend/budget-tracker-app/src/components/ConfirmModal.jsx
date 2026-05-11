function ConfirmModal({ show, message = 'Are you sure you want to delete this?', onConfirm, onCancel }) {
  // If show is false, render nothing 
  if (!show) return null;

  return (
    // Full-screen 
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Modal box  */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bs-body-bg)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          border: '1px solid var(--bs-border-color)',
          animation: 'slideUp 0.18s ease',
        }}
      >
        {/* Icon  */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <span style={{ fontSize: '1.5rem' }}>🗑️</span>
          <h5 className="mb-0 fw-semibold">Confirm Delete</h5>
        </div>

        {/* Message */}
        <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>{message}</p>

        {/* Action buttons */}
        <div className="d-flex gap-2 justify-content-end">
          <button
            className="btn btn-outline-secondary"
            style={{ borderRadius: '8px', padding: '0.45rem 1.2rem' }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            style={{ borderRadius: '8px', padding: '0.45rem 1.2rem' }}
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97) }
                              to  { opacity: 1; transform: translateY(0)    scale(1)    } }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
