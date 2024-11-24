import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDe5nZSDQ-N5gTuoL2r7Q-9Z0oh7C_pc-k",
    authDomain: "matech-01.firebaseapp.com",
    projectId: "matech-01",
    storageBucket: "matech-01.appspot.com",
    messagingSenderId: "600983949439",
    appId: "1:600983949439:web:7ba30458ad99758c87af4a",
    measurementId: "G-MYLH77L240"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements for ticket inputs
let ticket_title = document.getElementById('ticket_title');
let ticket_body = document.getElementById('ticket_body');
let submit_btn = document.getElementById('submit_btn');

async function AddData() {
    // Check if the fields are empty
    if (!ticket_title.value || !ticket_body.value) {
        alert("Please fill in all fields!");
        return;
    }

    const user = auth.currentUser;  // Get the current user

    if (!user) {
        alert("User not authenticated.");
        return;
    }

    try {
        const userDocRef = doc(db, "users", user.uid);  // Reference to the user's document
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            alert("User data not found.");
            return;
        }

        const username = userDoc.data().username;  // Get the username
        const role = userDoc.data().role;  // Get the role of the user

        // Define the ticket data to store
        const ticketData = {
            ticketTitle: ticket_title.value,
            ticketContent: ticket_body.value,
            timestamp: serverTimestamp(),
            username: username,
            status: "submitted",  // Track the status as "submitted"
            submittedBy: user.uid,  // Store who submitted the ticket
            role: role  // Store the role for reference
        };

        // Add the ticket to the user's sub-tickets collection
        const subTicketsCollectionRef = collection(db, `users/${user.uid}/sub-tickets`);
        const ticketRef = await addDoc(subTicketsCollectionRef, ticketData);
        console.log("Ticket added to sub-tickets collection:", ticketRef.id);

        alert("Ticket submitted successfully.");
        ticket_title.value = "";  // Clear the title input
        ticket_body.value = "";   // Clear the body input

    } catch (error) {
        console.error("Error adding ticket:", error);
        alert("Failed to submit ticket.");
    }
}

// Event listener for the submit button
submit_btn.addEventListener('click', AddData);
