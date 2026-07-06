import { useEffect, useState } from "react";
import { api } from "./api";
import SummaryCard from "./components/SummaryCard.jsx";

export default function App() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUrl, setNewUrl] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.list();
      setSummaries(data.reverse());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await api.create(newUrl.trim());
      setNewUrl("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id, url, summary) => {
    try {
      await api.update(id, url, summary);
      await load();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(id);
      setSummaries((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <div className="shell">
      <div className="masthead">
        <h1>Summaries</h1>
        <span className="count">{summaries.length} saved</span>
      </div>
      <p className="subhead">
        Paste a link. It's fetched, read, and reduced to what matters.
      </p>

      <form className="new-form" onSubmit={handleCreate}>
        <input
          type="url"
          required
          placeholder="https://example.com/article"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={creating}>
          {creating ? "Summarizing…" : "Add"}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="subhead">Loading…</p>
      ) : summaries.length === 0 ? (
        <div className="empty-state">
          <p>Nothing here yet.</p>
          <p>Add a link above to generate your first summary.</p>
        </div>
      ) : (
        <div className="list">
          {summaries.map((s) => (
            <SummaryCard
              key={s.id}
              summary={s}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
