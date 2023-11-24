document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://[::1]:3333/cinemas');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Data from server:', data);

        // Display data on the HTML page
        renderData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function renderData(data) {
    // Clear previous content of the container
    dataContainer.innerHTML = '';

    // Create and append HTML elements to display the data as a styled table
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped', 'text-center');

    // Create header row
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const headerCell = document.createElement('th');
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
    });
    // Add extra columns for delete and edit actions
    headerRow.innerHTML += '<th>Actions</th>';
    table.appendChild(headerRow);

    // Create data rows
    data.forEach(cinema => {
        const dataRow = document.createElement('tr');
        Object.values(cinema).forEach(value => {
            const dataCell = document.createElement('td');
            dataCell.textContent = value;
            dataRow.appendChild(dataCell);
        });

        // Add delete and edit buttons
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteRow(cinema.cinema_id));
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editRow(cinema.cinema_id));

        const addScreenButton = document.createElement('button');
        addScreenButton.textContent = 'Add screen';
        addScreenButton.addEventListener('click', () => addScreen(cinema.cinema_id));

        actionsCell.appendChild(deleteButton);
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(addScreenButton);
        dataRow.appendChild(actionsCell);

        // Add button for managing screens
        const screensCell = document.createElement('td');
        const manageScreensButton = document.createElement('button');
        manageScreensButton.textContent = 'Manage Screens';
        manageScreensButton.addEventListener('click', () => openScreenModal(cinema.cinema_id));

        screensCell.appendChild(manageScreensButton);
        dataRow.appendChild(screensCell);

        table.appendChild(dataRow);
    });

    // Append the table to the container
    dataContainer.appendChild(table);
}

function deleteRow(cinema_id) {
    // Confirm deletion with the user
    const confirmDelete = confirm('Are you sure you want to delete this cinema?');
    const token = localStorage.getItem('token');

    if (confirmDelete) {
        // Make DELETE request to the backend
        fetch(`http://[::1]:3333/cinemas/cinema/${cinema_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(`Cinema with ID ${cinema_id} deleted successfully.`);
            // Reload the data after deletion
            reloadCinemaData();
        })
        .catch(error => {
            console.error('Error deleting cinema:', error);
        });
    }
}

// Function to open the modal
function editRow(cinemaId) {
    // Set cinemaId in the modal
    document.getElementById('editModal').dataset.cinemaId = cinemaId;

    // Show the modal
    document.getElementById('editModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Function to submit the form within the modal
function submitEditForm() {
    const cinemaId = document.getElementById('editModal').dataset.cinemaId;
    const newName = document.getElementById('newName').value;
    const newEmail = document.getElementById('newEmail').value;
    const newPhoneNumber = document.getElementById('newPhoneNumber').value;

    const token = localStorage.getItem('token');

    // Make PATCH request to the backend
    fetch(`http://[::1]:3333/cinemas/cinema/${cinemaId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: newName,
            email: newEmail,
            phone_number: newPhoneNumber,
            // Include other properties as needed
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`Cinema with ID ${cinemaId} edited successfully.`);
        // Close the modal
        closeModal();
        // Reload the data after editing
        reloadCinemaData();
    })
    .catch(error => {
        console.error('Error editing cinema:', error);
    });
}

function reloadCinemaData() {
    // Reload cinema data after delete or edit
    fetch('http://[::1]:3333/cinemas')
        .then(response => response.json())
        .then(data => {
            console.log('Data reloaded after delete or edit:', data);
            // Display reloaded data on the HTML page
            renderData(data);
        })
        .catch(error => {
            console.error('Error reloading data:', error);
        });
}

async function populateSelect() {
    const addressCinema = document.getElementById('addressCinema');

    try {
        const response = await fetch('http://[::1]:3333/cities');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data)

        // Add new options based on API data
        data.forEach(city => {
            const optionElement = document.createElement('option');
            optionElement.value = city.city_id.toString(); // Set the value
            optionElement.text = city.name;   // Set the display text
            addressCinema.appendChild(optionElement);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateSelect();
});

async function addNewCinema() {
    const newCinemaName = document.getElementById('new_cinema_name').value;
    const newCinemaEmail = document.getElementById('new_cinema_email').value;
    const newCinemaPhoneNumber = document.getElementById('new_cinema_phonenumber').value;
    const selectedCityId = document.getElementById('addressCinema').value;

    const token = localStorage.getItem('token');

    const newCinema = {
        "name": newCinemaName,
        "city_id": parseInt(selectedCityId),
        "email": newCinemaEmail,
        "phone_number": newCinemaPhoneNumber
    };

    console.log(newCinema)

    try {
        const response = await fetch('http://[::1]:3333/cinemas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newCinema),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const addedCinema = await response.json();
        console.log('New Cinema added:', addedCinema);

        reloadCinemaData()
    } catch (error) {
        console.error('Error adding new cinema:', error);
    }
}

document.getElementById('addScreenFormInModal').addEventListener('submit', function (event) {
    event.preventDefault();

    const cinemaId = document.getElementById('addScreenModal').dataset.cinemaId;
    const token = localStorage.getItem('token');

    // Make a POST request to your API endpoint
    fetch('http://[::1]:3333/screens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            cinema_id: parseInt(cinemaId),
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Screen added successfully:', data);

        addSeats(data["screen_id"]);
    })
    .catch(error => {
        console.error('Error adding screen:', error);
    });
});

function addSeats(screenId) {
    // Add seats logic
    const numRows = parseInt(document.getElementById('numRows').value);
    const seatsPerRow = parseInt(document.getElementById('seatsPerRow').value);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const seats = [];

    for (let i = 1; i <= numRows; i++) {
        // Convert row number to alphabet letter
        const rowLabel = alphabet[i - 1];

        for (let j = 1; j <= seatsPerRow; j++) {
            const row = rowLabel;
            const seat_number = j;
            seats.push({ screenId, row, seat_number });
        }
    }

    console.log(seats);
    const token = localStorage.getItem('token');

    fetch('http://[::1]:3333/seats/many', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(seats),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Seat added successfully:', data);
        // Optionally, redirect to another page or perform additional actions
    })
    .catch(error => {
        console.error('Error adding seat:', error);
    });

    closeAddScreenModal();
}

// function addSeat() {
//     const seatsContainer = document.getElementById('seatsContainer');

//     const seatDiv = document.createElement('div');
//     seatDiv.classList.add('seat');

//     // Create label for Row
//     const rowLabel = document.createElement('label');
//     rowLabel.textContent = 'Row:';
//     seatDiv.appendChild(rowLabel);

//     const rowInput = document.createElement('input');
//     rowInput.classList.add('form-control', 'mb-2', 'row-input'); // Add 'row-input' class
//     rowInput.setAttribute('placeholder', 'Row');
//     rowInput.type = 'text';
//     seatDiv.appendChild(rowInput);

//     // Create label for Seat Number
//     const seatNumberLabel = document.createElement('label');
//     seatNumberLabel.textContent = 'Seat Number:';
//     seatDiv.appendChild(seatNumberLabel);

//     const seatNumberInput = document.createElement('input');
//     seatNumberInput.classList.add('form-control', 'mb-2', 'seat-number-input'); // Add 'seat-number-input' class
//     seatNumberInput.setAttribute('placeholder', 'Seat Number');
//     seatNumberInput.type = 'text';
//     seatDiv.appendChild(seatNumberInput);

//     seatsContainer.appendChild(seatDiv);
// }

function addScreen(cinemaId) {
    document.getElementById('addScreenModal').dataset.cinemaId = cinemaId;

    const addScreenModal = document.getElementById('addScreenModal');
    addScreenModal.classList.add('show');
    addScreenModal.style.display = 'block';
}

function closeAddScreenModal() {
    document.getElementById("addScreenModal").style.display = 'none';
}

async function openScreenModal(cinemaId) {
    const token = localStorage.getItem('token');

    // Fetch screens for the selected cinema
    const screensResponse = await fetch(`http://[::1]:3333/screens/screensbycinemaid/${cinemaId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!screensResponse.ok) {
        console.error('Error fetching screens:', screensResponse.status);
        return;
    }

    const screensData = await screensResponse.json();
    const screenList = document.getElementById('screenList');

    const seatCountElement = document.getElementById('screenCount');
    seatCountElement.textContent = `Total: ${screensData.length}`;

    // Clear previous content
    screenList.innerHTML = '';

    // Populate screen list
    screensData.forEach(screen => {
        const screenButton = document.createElement('button');
        screenButton.textContent = `Sc ${screen.screen_id}`;
        screenButton.onclick = () => openSeatModal(screen.screen_id);
        const listItem = document.createElement('li');
        listItem.appendChild(screenButton);
        screenList.appendChild(listItem);
    });


    // Show the modal
    document.getElementById('screenModal').classList.add('show');
    document.getElementById('screenModal').style.display = 'block';
}

function closeScreenModal() {
    document.getElementById('screenModal').style.display = 'none';
}

async function openSeatModal(screenId) {
    const token = localStorage.getItem('token');

    // Fetch seats for the selected screen
    const seatsResponse = await fetch(`http://[::1]:3333/seats/seatsbyscreenid/${screenId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!seatsResponse.ok) {
        console.error('Error fetching seats:', seatsResponse.status);
        return;
    }

    const seatsData = await seatsResponse.json();
    const seatList = document.getElementById('seatList');

    // Clear previous content
    seatList.innerHTML = '';

    const seatCountElement = document.getElementById('seatCount');
    seatCountElement.textContent = `Seat Count: ${seatsData.length}`;

    // Populate seat list
    seatsData.forEach(seat => {
        const listItem = document.createElement('li');
        listItem.textContent = `${seat.row}${seat.seat_number}`;
        seatList.appendChild(listItem);
    });

    // Show the modal
    document.getElementById('seatModal').style.display = 'flex';
}

function closeSeatModal() {
    document.getElementById('seatModal').style.display = 'none';
}

