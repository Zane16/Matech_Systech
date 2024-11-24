import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    where,
    setDoc,
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch and display tickets
async function fetchAndDisplayTickets() {
    try {
        const ticketsQuery = query(collection(db, "Tickets"));
        const ticketsSnapshot = await getDocs(ticketsQuery);

        const tableBody = document.querySelector(".title_body");
        tableBody.innerHTML = ""; // Clear the table

        if (ticketsSnapshot.empty) {
            const noTicketsRow = document.createElement("tr");
            noTicketsRow.innerHTML = `<td colspan="7">No tickets available</td>`;
            tableBody.appendChild(noTicketsRow);
            return;
        }

        ticketsSnapshot.forEach(async (docSnapshot) => {
            const ticket = docSnapshot.data();
            const ticketId = docSnapshot.id;
            const username = ticket.username || "Anonymous";
            const profileImage = ticket.profileImage || "https://via.placeholder.com/50";
            const ticketTitle = ticket.ticketTitle || "No Title";
            const ticketContent = ticket.ticketContent || "No Content Provided";
            const ticketTime = ticket.timestamp
                ? new Date(ticket.timestamp.seconds * 1000).toLocaleString()
                : "Unknown Time";
            const technicianId = ticket.technicianId;

            let technicianUsername = "Not Assigned";
            let technicianProfileImage = "https://via.placeholder.com/50";
            if (technicianId) {
                const technicianRef = doc(db, "users", technicianId);
                const technicianSnap = await getDoc(technicianRef);
                if (technicianSnap.exists()) {
                    const technicianData = technicianSnap.data();
                    technicianUsername = technicianData.username || "No Username";
                    technicianProfileImage = technicianData.profileImage || "https://via.placeholder.com/50";
                }
            }

            const newRow = document.createElement("tr");

            newRow.innerHTML = `
                <td><img src="${profileImage}" alt="Profile Image" style="border-radius: 50%; width: 50px; height: 50px;"></td>
                <td>${username}</td>
                <td>${ticketTitle}</td>
                <td>${ticketTime}</td>
                <td>${technicianUsername}</td>
                <td>
                    <button class="review-btn" 
                        data-ticket-id="${ticketId}" 
                        data-title="${ticketTitle}" 
                        data-content="${ticketContent}" 
                        data-username="${username}" 
                        data-time="${ticketTime}" 
                        data-technician="${technicianUsername}" 
                        data-technician-image="${technicianProfileImage}">
                        Review
                    </button>
                </td>
                <td>
                    <button class="delete-btn" data-ticket-id="${ticketId}">Delete</button>
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
    } catch (error) {
        console.error("Error fetching tickets:", error);
    }
}

// Review button handler
function handleReview(event) {
    const modal = document.getElementById("reviewModal");
    const ticketId = event.target.dataset.ticketId;
    const username = event.target.dataset.username;
    const ticketTitle = event.target.dataset.title;
    const ticketContent = event.target.dataset.content;
    const ticketTime = event.target.dataset.time;
    const technicianUsername = event.target.dataset.technician;
    const technicianProfileImage = event.target.dataset.technicianImage;

    document.getElementById("modalUsername").innerText = username;
    document.getElementById("modalTitle").innerText = ticketTitle;
    document.getElementById("modalContent").innerText = ticketContent;
    document.getElementById("modalTimestamp").innerText = ticketTime;
    document.getElementById("modalTechnician").innerText = technicianUsername;
    document.getElementById("modalTechnicianImage").src = technicianProfileImage;

    modal.style.display = "flex";
    modal.dataset.ticketId = ticketId;

    fetchTechnicians();
}

// Technician select handler
document.getElementById("confirmTechnicianButton").addEventListener("click", async () => {
    const technicianSelect = document.getElementById("technicianSelect");
    const technicianId = technicianSelect.value;
    const modal = document.getElementById("reviewModal");
    const ticketId = modal.dataset.ticketId;

    if (technicianId) {
        try {
            const ticketRef = doc(db, "Tickets", ticketId);
            await updateDoc(ticketRef, {
                technicianId,
                status: "assigned",
                technicianAssignedAt: new Date(),
            });

            alert("Technician assigned successfully.");
            fetchAndDisplayTickets();
            modal.style.display = "none";
        } catch (error) {
            console.error("Error assigning technician:", error);
            alert("Failed to assign technician.");
        }
    } else {
        alert("Please select a technician.");
    }
});

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("reviewModal").style.display = "none";
});

// Delete ticket handler
async function handleDelete(event) {
    const ticketId = event.target.dataset.ticketId;

    if (confirm("Are you sure you want to delete this ticket?")) {
        try {
            const ticketRef = doc(db, "Tickets", ticketId);
            await deleteDoc(ticketRef);
            alert("Ticket deleted successfully.");
            fetchAndDisplayTickets();
        } catch (error) {
            console.error("Error deleting ticket:", error);
            alert("Failed to delete the ticket.");
        }
    }
}

// Fetch and display tickets when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayTickets);
