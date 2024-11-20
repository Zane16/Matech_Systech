document.addEventListener("DOMContentLoaded", function () {
    loadTickets();
});

function loadTickets() {
    let tickets = JSON.parse(localStorage.getItem("tickets")) || [];    
    let tableBody = document.getElementById("employeeList").getElementsByTagName("tbody")[0];

    tickets.forEach((ticket) => {
        let newRow = tableBody.insertRow();

        let cell1 = newRow.insertCell(0);
        cell1.innerHTML = `<i class="fa-solid fa-user"></i>`; 

        let cell2 = newRow.insertCell(1);
        cell2.innerHTML = ticket.ticket_title;

        let cell3 = newRow.insertCell(2);
        cell3.innerHTML = ticket.ticket_body;

        cell4 = newRow. insertCell(3);
        cell4.innerHTML = `<a>Review</a>
                            <a>Delete</a>`;
    });
}


function clearTickets() {
    localStorage.removeItem("tickets");
    location.reload(); // Reload the page to reflect changes
}


