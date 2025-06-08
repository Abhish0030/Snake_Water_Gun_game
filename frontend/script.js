// Select all choice buttons and input/display elements
const buttons = document.querySelectorAll(".choice-btn");
const resultDiv = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const clearBtn = document.getElementById("clearBtn");

// Handle game play
buttons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const userChoice = btn.getAttribute("data-choice");
    const name = playerNameInput.value.trim();

    if (!name) {
      alert("Please enter your name first!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ choice: userChoice, name: name })
      });

      const data = await res.json();

      resultDiv.innerHTML = `
        You (<strong>${data.name}</strong>) chose <strong>${data.user}</strong>, 
        Computer chose <strong>${data.computer}</strong><br />
        <span class="text-lg font-bold">
          ${data.result === "draw" ? "It's a draw!" :
            data.result === "user" ? "You win!" : "You lose!"}
        </span>
      `;
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});

// Fetch leaderboard and display
leaderboardBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("http://127.0.0.1:5000/leaderboard");
    const data = await res.json();

    leaderboardList.innerHTML = ""; // Clear previous list

    if (data.length === 0) {
      leaderboardList.innerHTML = "<li>No data available.</li>";
      return;
    }

    data.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${entry.name} - ${entry.wins} win(s)`;
      leaderboardList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
    alert("Could not load leaderboard.");
  }
});

// Clear history
clearBtn.addEventListener("click", async () => {
  const confirmDelete = confirm("Are you sure you want to clear all game history?");
  if (!confirmDelete) return;

  try {
    const res = await fetch("http://127.0.0.1:5000/clear", {
      method: "DELETE"
    });

    const data = await res.json();
    alert(data.message);
    leaderboardList.innerHTML = ""; // Clear leaderboard UI
  } catch (err) {
    console.error("Failed to clear history:", err);
    alert("Could not clear history.");
  }
});
