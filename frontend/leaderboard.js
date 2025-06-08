fetch("http://127.0.0.1:5000/leaderboard")
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById("leaderboard-body");
    data.forEach(entry => {
      const row = `<tr>
        <td class="p-2 border">${entry.name}</td>
        <td class="p-2 border">${entry.wins}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  })
  .catch(err => console.error("Error loading leaderboard", err));
