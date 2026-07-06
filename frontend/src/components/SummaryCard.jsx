import { useState } from "react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SummaryCard({ summary, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [urlDraft, setUrlDraft] = useState(summary.url);
  const [summaryDraft, setSummaryDraft] = useState(summary.summary || "");
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    setBusy(true);
    try {
      await onUpdate(summary.id, urlDraft, summaryDraft);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await onDelete(summary.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="card-head" onClick={() => setOpen((v) => !v)}>
        <div>
          <div className="card-url">{summary.url}</div>
          <div className="card-meta">
            #{summary.id} · {formatDate(summary.created_at)}
          </div>
        </div>
        <span className="card-toggle">{open ? "–" : "+"}</span>
      </div>

      {open && (
        <div className="card-body">
          {editing ? (
            <div className="edit-form" onClick={(e) => e.stopPropagation()}>
              <input
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="URL"
              />
              <textarea
                value={summaryDraft}
                onChange={(e) => setSummaryDraft(e.target.value)}
                placeholder="Summary"
              />
              <div className="card-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={busy}
                >
                  {busy ? "Saving…" : "Save changes"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setEditing(false)}
                  disabled={busy}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {summary.summary ? (
                <p className="summary-text">{summary.summary}</p>
              ) : (
                <p className="summary-empty">No summary generated yet.</p>
              )}
              <div className="card-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={busy}
                >
                  {busy ? "Removing…" : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
