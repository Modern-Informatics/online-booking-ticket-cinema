async function showAllBookings() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://[::1]:3333/bookings',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        
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
};

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
    data.forEach(booking => {
        const dataRow = document.createElement('tr');
        for (const key in booking) {
            const value = booking[key];
            const dataCell = document.createElement('td');

            // Check if the current key is 'url_image'
            if (key === 'createdAt' || key === 'updateAt') {
                if (value){
                    dataCell.textContent = formatDateTime(value);
                }
            } else {
                dataCell.textContent = value;
            }

            dataRow.appendChild(dataCell);
        }

        // Add delete and edit buttons
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteRow(booking.booking_id));
        
        actionsCell.appendChild(deleteButton);
        dataRow.appendChild(actionsCell);
        table.appendChild(dataRow);
    });

    // Append the table to the container
    dataContainer.appendChild(table);
}

function deleteRow(booking_id) {
    // Confirm deletion with the user
    const confirmDelete = confirm('Are you sure you want to delete this movie?');
    const token = localStorage.getItem('token');

    if (confirmDelete) {
        // Make DELETE request to the backend
        fetch(`http://[::1]:3333/bookings/booking/${booking_id}`, {
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
            console.log(`Booking with ID ${booking_id} deleted successfully.`);
            // Reload the data after deletion
            reloadbookingData();
        })
        .catch(error => {
            console.error('Error deleting booking:', error);
        });
    }
}

async function reloadbookingData() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://[::1]:3333/bookings',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        
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
}

function formatDateTime(dateTimeString) {
    // Tạo đối tượng Date từ chuỗi thời gian
    const date = new Date(dateTimeString);

    // Lấy giờ, phút và giây
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Lấy ngày, tháng và năm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Tạo chuỗi định dạng mới
    const formattedDateTime = `${hours}:${minutes}:${seconds} - ${day}.${month}.${year}`;

    return formattedDateTime;
}