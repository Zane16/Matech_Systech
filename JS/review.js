import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDe5nZSDQ-N5gTuoL2r7Q-9Z0oh7C_pc-k",
    authDomain: "matech-01.firebaseapp.com",
    databaseURL: "https://matech-01-default-rtdb.firebaseio.com",
    projectId: "matech-01",
    storageBucket: "matech-01.appspot.com",
    messagingSenderId: "600983949439",
    appId: "1:600983949439:web:7ba30458ad99758c87af4a",
    measurementId: "G-MYLH77L240"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to fetch and display tickets
function fetchAndDisplayTickets() {
    const dbRef = ref(db, "TicketContent");

    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const tickets = snapshot.val();
                const tableBody = document.querySelector(".title_body");

                tableBody.innerHTML = "";

                
                Object.keys(tickets).forEach((key) => {
                    const ticket = tickets[key];

                  
                    const username = ticket.username || "Anonymous";
                    const profileImage =
                        ticket.profileImage || "https://via.placeholder.com/50";
                    const ticketTitle = ticket.ticketTitle || "No Title";
                    const ticketTime = ticket.timestamp
                        ? new Date(ticket.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "Unknown Time";

                    
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td style="text-align: center;">
                            <img src="${profileImage}" alt="Profile Image" style="border-radius: 50%; width: 50px; height: 50px;">
                        </td>
                        <td style="text-align: center;">${username}</td>
                        <td style="text-align: center;">${ticketTitle}</td>
                        <td style="text-align: center;">${ticketTime}</td>
                        <td style="text-align: center;">
                            <button class="review-btn" data-id="${key}" style="padding: 5px 10px; background-color: navy; color: white; border: none; border-radius: 5px;">Review</button>
                        </td>
                        <td style="text-align: center;">
                            <button class="delete-btn" data-id="${key}" style="padding: 5px 10px; background-color: red; color: white; border: none; border-radius: 5px;">Delete</button>
                        </td>
                    `;

                    tableBody.appendChild(newRow);
                });

                document.querySelectorAll(".review-btn").forEach((btn) =>
                    btn.addEventListener("click", handleReview)
                );
                document.querySelectorAll(".delete-btn").forEach((btn) =>
                    btn.addEventListener("click", handleDelete)
                );
            } else {
                console.log("No tickets found in Firebase.");
            }
        })
        .catch((error) => {
            console.error("Error fetching tickets:", error);
        });
}


function handleReview(event) {
    const ticketId = event.target.dataset.id;
    alert(`Reviewing ticket ID: ${ticketId}`);
}


function handleDelete(event) {
    const ticketId = event.target.dataset.id;
    const ticketRef = ref(db, `TicketContent/${ticketId}`);

    if (confirm("Are you sure you want to delete this ticket?")) {
        remove(ticketRef)
            .then(() => {
                alert("Ticket deleted successfully.");
                fetchAndDisplayTickets(); 
            })
            .catch((error) => {
                console.error("Error deleting ticket:", error);
            });
    }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayTickets);
