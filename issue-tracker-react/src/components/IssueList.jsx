import IssueItem from "./IssueItem";

function IssueList({
  issues,
  newIssue,
  setNewIssue,
  newDescription,
  setNewDescription,
  newPlace,
  setNewPlace,
  handleAddinput,
  toggleStatus,
  deleteIssue,
  handleLogout
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg py-6 shadow-indigo-500/20">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h2 className="text-4xl font-bold">Issue Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Add Issue Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Report New Issue</h3>

          <input
            type="text"
            placeholder="Enter issue title"
            value={newIssue}
            onChange={(e) => setNewIssue(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <textarea
            placeholder="Issue description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            rows="4"
          />

          <input
            type="text"
            placeholder="Location / Place"
            value={newPlace}
            onChange={(e) => setNewPlace(e.target.value)}
            className="w-full px-4 py-2 mb-6 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button
            onClick={handleAddinput}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg"
          >
            Add Issue
          </button>
        </div>

        {/* Issues Grid */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">
            Issues ({issues.length})
          </h3>
          {issues.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8 text-center text-slate-300">
              <p className="text-lg">No issues reported yet. Be the first to contribute!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map(issue => (
                <IssueItem
                  key={issue._id}
                  issue={issue}
                  toggleStatus={toggleStatus}
                  deleteIssue={deleteIssue}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IssueList;