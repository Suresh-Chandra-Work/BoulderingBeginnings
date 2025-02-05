const holdsData = [
  { type: "jug", image: "jug.png", weight: { easy: 5, medium: 3, hard: 1 } },
  { type: "crimp", image: "crimp.png", weight: { easy: 1, medium: 3, hard: 5 } },
  { type: "sloper", image: "sloper.png", weight: { easy: 2, medium: 3, hard: 4 } },
  { type: "pinch", image: "pinch.png", weight: { easy: 2, medium: 3, hard: 4 } },
  { type: "pocket", image: "pocket.png", weight: { easy: 1, medium: 2, hard: 4 } }
];

// Function to generate random hold based on difficulty
function getWeightedHold(difficulty) {
  let choices = [];
  holdsData.forEach(hold => {
    for (let i = 0; i < hold.weight[difficulty]; i++) {
      choices.push(hold);
    }
  });
  return choices[Math.floor(Math.random() * choices.length)];
}

// Function to generate the board dynamically
function generateBoard() {
  const difficulty = document.getElementById("difficulty").value;
  const board = document.getElementById("board");
  board.innerHTML = ""; // Clear the current board

  for (let row = 1; row <= 18; row++) {
    for (let col = 1; col <= 10; col++) {
      let hold = getWeightedHold(difficulty);
      let div = document.createElement("div");
      div.classList.add("hold");
      div.style.backgroundImage = `url('images/${hold.image}')`;

      // Add random rotation
      const randomRotation = Math.floor(Math.random() * 360); // Random rotation
      div.style.transform = `rotate(${randomRotation}deg)`;

      // Add click event to highlight the boulder (hold)
      div.addEventListener('click', () => {
        div.classList.toggle('highlighted');
      });

      board.appendChild(div);
    }
  }
}
// Function to load saved boards from localStorage and generate buttons for them
function updateSavedSlots() {
  const savedBoards = JSON.parse(localStorage.getItem("savedBoards")) || [];
  const saveSlotsContainer = document.getElementById("saveSlotsContainer");
  saveSlotsContainer.innerHTML = ""; // Clear previous buttons

  savedBoards.forEach((board, index) => {
    const button = document.createElement("button");
    button.classList.add("mui-btn", "mui-btn--raised", "anotherColor");
    button.classList.add("saved-board-button");
    button.innerText = board.name;

    // Add event listener to load the saved board when clicked
    button.onclick = () => loadSavedBoard(index);

    // Add a small delete icon/button
    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-icons", "delete-icon");
    deleteIcon.innerText = "close";
    deleteIcon.onclick = (event) => {
      event.stopPropagation(); // Prevent the button click from firing
      openDeleteModal(index);
    };

    // Append the delete icon to the button
    button.appendChild(deleteIcon);

    // Append the button to the container
    saveSlotsContainer.appendChild(button);
  });
}


// Function to load a specific saved board layout from localStorage
function loadSavedBoard(index) {
  const savedBoards = JSON.parse(localStorage.getItem("savedBoards")) || [];
  const boardState = savedBoards[index].state;

  const board = document.getElementById("board");
  board.innerHTML = ""; // Clear the current board

  boardState.forEach(holdState => {
    let div = document.createElement("div");
    div.classList.add("hold");
    div.style.backgroundImage = holdState.backgroundImage;
    div.style.transform = holdState.transform;
    div.addEventListener('click', () => {
      div.classList.toggle('highlighted');
    });
    board.appendChild(div);
  });
}

// Function to open the modal for saving a board
function openSaveModal() {
  document.getElementById("saveModal").style.display = "flex";
}

// Function to close the save modal
function closeModal() {
  document.getElementById("saveModal").style.display = "none";
}

// Function to save the current board layout to localStorage
function saveBoard() {
  const boardName = document.getElementById("boardName").value.trim();
  if (!boardName) {
    alert("Please enter a board name");
    return;
  }

  const board = document.getElementById("board");
  const boardState = [];

  // Get all the hold elements and their styles (backgroundImage and transform)
  const holds = board.getElementsByClassName("hold");
  for (let hold of holds) {
    boardState.push({
      backgroundImage: hold.style.backgroundImage,
      transform: hold.style.transform
    });
  }

  // Get existing saved boards from localStorage
  let savedBoards = JSON.parse(localStorage.getItem("savedBoards")) || [];

  // Save the current board layout as a new slot
  savedBoards.push({ name: boardName, state: boardState });

  // Limit saved boards to 5
  if (savedBoards.length > 5) {
    savedBoards.shift(); // Remove the first board if there are more than 5
  }

  // Store the updated list of saved boards back to localStorage
  localStorage.setItem("savedBoards", JSON.stringify(savedBoards));

  // Update the saved slots UI
  updateSavedSlots();

  // Close the modal
  closeModal();
}

// Function to open the delete confirmation modal
function openDeleteModal(index) {
  // Store the index of the board to delete
  window.selectedBoardIndex = index;
  document.getElementById("deleteModal").style.display = "flex";
}

// Function to close the delete confirmation modal
function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

// Function to delete the selected saved board
function deleteSavedBoard() {
  const savedBoards = JSON.parse(localStorage.getItem("savedBoards")) || [];

  // Remove the selected board from the array
  savedBoards.splice(window.selectedBoardIndex, 1);

  // Update localStorage with the new list
  localStorage.setItem("savedBoards", JSON.stringify(savedBoards));

  // Close the delete modal
  closeDeleteModal();

  // Update saved slots UI
  updateSavedSlots();
}

// Function to change the background color
function changeBackgroundColor(event) {
  document.body.style.backgroundColor = event.target.value;
}

// Function to toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Load the saved boards on page load and generate the board
window.onload = () => {
  updateSavedSlots(); // Update the saved slots on page load
  generateBoard(); // Generate the board based on default difficulty
};
