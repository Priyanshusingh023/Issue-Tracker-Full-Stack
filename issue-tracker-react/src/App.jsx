import Login from "./components/Login";
import Register from "./components/Register";
import IssueList from "./components/IssueList";
import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [showLogin,setShowLogin]=useState("");

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  // fetch issues
  useEffect(() => {
    fetch("http://localhost:5000/issues",{
      headers:{
        Authorization:localStorage.getItem("token")
      }
    })
      .then((response) => response.json())
      .then((data) => {
  if (Array.isArray(data)) {
    setIssues(data);
  } else {
    console.log("Unexpected response:", data);
  }
})
      .catch((error) => {
        console.error("Error fetching issues:", error);
      });
  }, []);

  function handleAddinput() {
    if (newIssue.trim() === "") return;

    fetch("http://localhost:5000/issues", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        title: newIssue,
        description: newDescription,
        place: newPlace
      })
    })
      .then(response => response.json())
      .then(() => {
        fetch("http://localhost:5000/issues",{headers: {
    Authorization: localStorage.getItem("token")}
  })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
          setIssues(data);
               } else {
                 console.log("Unexpected response:", data);
  }
            setNewIssue("");
            setNewDescription("");
            setNewPlace("");
          });
      })
      .catch(error => {
        console.log("Error adding issue:", error);
      });
  }

  function toggleStatus(id) {
    fetch(`http://localhost:5000/issues/${id}/status`, {
      method: "PATCH",
      headers: {
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("token")
},
    })
      .then(res => res.json())
      .then(() => {
        fetch("http://localhost:5000/issues",{
          headers: {
    Authorization: localStorage.getItem("token")
  }
        })
          .then(res => res.json())
          .then((data) => {
                if (Array.isArray(data)) {
    setIssues(data);
  } else {
    console.log("Unexpected response:", data);
  }
          });
      })
      .catch(err => console.error(err));
  }

  function deleteIssue(id) {
    fetch(`http://localhost:5000/issues/${id}`, {
      method: "DELETE",
      headers: {
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("token")
},
    })
      .then(() => {
        fetch("http://localhost:5000/issues",{
          headers: {
    Authorization: localStorage.getItem("token")
  }
        })
          .then(res => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
    setIssues(data);
  } else {
    console.log("Unexpected response:", data);
  }
          });
      })
      .catch(err => console.error(err));
  }
  function handleLogout() {
  localStorage.removeItem("token");  
  setLoggedIn(false);                 
}

  // If NOT logged in → show login page
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        {/* Yogdaan Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 shadow-xl">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">Yogdaan</h1>
            <p className="text-lg text-indigo-100">
              Contribute your feedback and help us improve. Report issues, suggest improvements, and be part of the community growth.
            </p>
          </div>
        </div>

        {/* Auth Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          {showLogin ? (
            <Login setLoggedIn={setLoggedIn} setShowLogin={setShowLogin} />
          ) : (
            <Register setLoggedIn={setLoggedIn} setShowLogin={setShowLogin} />
          )}
        </div>
      </div>
    );
  }

  // If logged in → show dashboard
  return (
   <IssueList
      issues={issues}
      newIssue={newIssue}
      setNewIssue={setNewIssue}
      newDescription={newDescription}
      setNewDescription={setNewDescription}
      newPlace={newPlace}
      setNewPlace={setNewPlace}
      handleAddinput={handleAddinput}
      toggleStatus={toggleStatus}
      deleteIssue={deleteIssue}
      handleLogout={handleLogout}
     
    />
  );
}

export default App;