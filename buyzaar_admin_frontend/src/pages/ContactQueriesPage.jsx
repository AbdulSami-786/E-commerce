import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelopeOpenText, FaReply, FaCheckCircle } from "react-icons/fa";

const API = "http://127.0.0.1:5000/api";

export default function ContactQueriesPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyingId, setReplyingId] = useState(null);

  // 🔹 Fetch queries
  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${API}/contact-queries`);
      setQueries(res.data);
    } catch (err) {
      alert("Error loading contact queries: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // 🔹 Update query status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/contact-queries/${id}`, { status });
      fetchQueries();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  // 🔹 Reply (simulate)
  const handleReply = async (id) => {
    if (!replyText.trim()) return alert("Please enter a reply message.");
    try {
      await axios.post(`${API}/contact-queries/${id}/reply`, { reply: replyText });
      alert("✅ Reply sent successfully!");
      setReplyingId(null);
      setReplyText("");
      fetchQueries();
    } catch (err) {
      alert("Error sending reply: " + err.message);
    }
  };

  // 🔹 Color-coded status
  const statusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-lg py-10">
        Loading Contact Queries...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FaEnvelopeOpenText className="text-blue-600" /> Contact Queries
      </h2>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No queries found.
                </td>
              </tr>
            ) : (
              queries.map((q) => (
                <tr
                  key={q.id}
                  className="border-t hover:bg-gray-50 transition text-gray-700"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    #{q.id}
                  </td>
                  <td className="py-3 px-4">{q.name}</td>
                  <td className="py-3 px-4">{q.email}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{q.message}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    {q.status !== "in_progress" && (
                      <button
                        onClick={() => updateStatus(q.id, "in_progress")}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Mark In Progress"
                      >
                        <FaReply />
                      </button>
                    )}
                    {q.status !== "resolved" && (
                      <button
                        onClick={() => updateStatus(q.id, "resolved")}
                        className="text-green-600 hover:text-green-800"
                        title="Mark Resolved"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setReplyingId(replyingId === q.id ? null : q.id)
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="Reply"
                    >
                      <FaEnvelopeOpenText />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✉️ Reply Box */}
      {replyingId && (
        <div className="bg-white shadow rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Reply to Query #{replyingId}
          </h3>
          <textarea
            rows={4}
            placeholder="Type your reply message..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-blue-500 mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleReply(replyingId)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Send Reply
            </button>
            <button
              onClick={() => setReplyingId(null)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
