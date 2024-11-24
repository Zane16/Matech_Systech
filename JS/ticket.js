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

let ticket_title = document.getElementById('ticket_title');
let ticket_body = document.getElementById('ticket_body');
let submit_btn = document.getElementById('submit_btn');

async function AddData() {
    if (!ticket_title.value || !ticket_body.value) {
        alert("Please fill in all fields!");
        return;
    }

    const user = auth.currentUser;

    if (!user) {
        alert("User not authenticated.");
        return;
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            alert("User data not found.");
            return;
        }

        const username = userDoc.data().username; 

        await addDoc(collection(db, `users/${user.uid}/Tickets`), {
            ticketTitle: ticket_title.value,
            ticketContent: ticket_body.value,
            timestamp: serverTimestamp(),
            username: username, 
        });

        alert("Ticket submitted successfully.");
    } catch (error) {
        console.error("Error adding ticket:", error);
        alert("Failed to submit ticket.");
    }
}

submit_btn.addEventListener('click', AddData);
