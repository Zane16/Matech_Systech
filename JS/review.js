import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getFirestore,
    collectionGroup,
    query,
    getDocs,
    deleteDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDe5nZSDQ-N5gTuoL2r7Q-9Z0oh7C_pc-k",
    authDomain: "matech-01.firebaseapp.com",
    projectId: "matech-01",
    storageBucket: "matech-01.appspot.com",
    messagingSenderId: "600983949439",
    appId: "1:600983949439:web:7ba30458ad99758c87af4a",
    measurementId: "G-MYLH77L240",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display tickets
async function fetchAndDisplayTickets() {
    try {
        const ticketsQuery = query(collectionGroup(db, "Tickets")); // Fetch all tickets from subcollections
        const ticketsSnapshot = await getDocs(ticketsQuery);

        const tableBody = document.querySelector(".title_body");
        tableBody.innerHTML = ""; // Clear the table

        ticketsSnapshot.forEach((docSnapshot) => {
            const ticket = docSnapshot.data();
            const ticketId = docSnapshot.id;
            const ticketPath = docSnapshot.ref.path; // Full path to the document
            const username = ticket.username || "Anonymous";
            const profileImage = ticket.profileImage || "https://via.placeholder.com/50";
            const ticketTitle = ticket.ticketTitle || "No Title";
            const ticketTime = ticket.timestamp
                ? new Date(ticket.timestamp.seconds * 1000).toLocaleString()
                : "Unknown Time";

            // Create a new table row
            const newRow = document.createElement("tr");

            newRow.innerHTML = `
                <td style="text-align: center;">
                    <img src="${profileImage}" alt="Profile Image" style="border-radius: 50%; width: 50px; height: 50px;">
                </td>
                <td style="text-align: center;">${username}</td>
                <td style="text-align: center;">${ticketTitle}</td>
                <td style="text-align: center;">${ticketTime}</td>
                <td style="text-align: center;">
                    <button class="review-btn" data-ticket-path="${ticketPath}">Review</button>
                </td>
                <td style="text-align: center;">
                    <button class="delete-btn" data-ticket-path="${ticketPath}">Delete</button>
                </td>
            `;

            tableBody.appendChild(newRow);
        });

        // Add event listeners to the buttons
        document.querySelectorAll(".review-btn").forEach((btn) =>
            btn.addEventListener("click", handleReview)
        );
        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", handleDelete)
        );
    } catch (error) {
        console.error("Error fetching tickets:", error);
    }
}

// Function to handle ticket review
function handleReview(event) {
    const ticketPath = event.target.dataset.ticketPath;
    alert(`Reviewing ticket: ${ticketPath}`);
}

// Function to handle ticket deletion
async function handleDelete(event) {
    const ticketPath = event.target.dataset.ticketPath;

    if (confirm("Are you sure you want to delete this ticket?")) {
        try {
            const ticketRef = doc(db, ticketPath); // Get the document reference from the path
            await deleteDoc(ticketRef); // Delete the document
            alert("Ticket deleted successfully.");
            fetchAndDisplayTickets(); // Refresh the table
        } catch (error) {
            console.error("Error deleting ticket:", error);
            alert("Failed to delete the ticket.");
        }
    }
}


document.addEventListener("DOMContentLoaded", fetchAndDisplayTickets);
