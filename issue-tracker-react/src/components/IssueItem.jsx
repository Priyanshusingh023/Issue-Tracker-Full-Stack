function IssueItem({ issue, toggleStatus, deleteIssue }) {
  const statusColor = issue.status === "open" 
    ? "bg-red-500/20 text-red-300 border-red-500/30" 
    : "bg-green-500/20 text-green-300 border-green-500/30";
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-md p-6 hover:shadow-xl hover:border-indigo-500/30 transition duration-200">
      <div className="mb-4 flex justify-between items-start gap-3">
        <h3 className="text-lg font-bold text-white flex-1">{issue.title}</h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor}`}>
          {issue.status}
        </span>
      </div>

      {issue.description && (
        <p className="text-slate-300 mb-3 text-sm">{issue.description}</p>
      )}

      {issue.place && (
        <p className="text-indigo-400 text-sm mb-4 italic">
          📍 {issue.place}
        </p>
      )}

      <div className="flex gap-2 pt-4 border-t border-slate-700">
        <button
          onClick={() => toggleStatus(issue._id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded transition duration-200 text-sm"
        >
          Mark as {issue.status === "open" ? "Resolved" : "Open"}
        </button>

        <button
          onClick={() => deleteIssue(issue._id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded transition duration-200 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default IssueItem;