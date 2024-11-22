import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, child, get, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

let ticket_title = document.getElementById('ticket_title');
let ticket_body = document.getElementById('ticket_body');
let submit_btn = document.getElementById('submit_btn');

function AddData() {
    if (!ticket_title.value || !ticket_body.value) {
        alert("Please fill in all fields!");
        return;
    }

    const timestamp = serverTimestamp();  

    
    set(ref(db, 'TicketContent/' + ticket_title.value), {
        ticketTitle: ticket_title.value,
        ticketContent: ticket_body.value,
        timestamp: timestamp  
    })
    .then(() => {
        alert("Data Added Successfully");
    })
    .catch((error) => {
        alert("Data could not be added: " + error.message);
    });
}

function RetData() {
    if (!ticket_title.value) {
        alert("Please provide a ticket title to search.");
        return;
    }

    const dbRef = ref(db);

    get(child(dbRef, 'TicketContent/' + ticket_title.value))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const timestamp = new Date(data.timestamp).toLocaleString();  // Format the timestamp
                alert(`Title: ${data.ticketTitle}\nContent: ${data.ticketContent}\nSubmitted At: ${timestamp}`);
            } else {
                alert("No data found for the given title.");
            }
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
}

submit_btn.addEventListener('click', AddData);

