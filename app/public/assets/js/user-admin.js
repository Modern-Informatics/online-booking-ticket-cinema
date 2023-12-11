async function showAllUsers() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://[::1]:3333/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
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
        if (key !== 'password_hash') {
            const headerCell = document.createElement('th');
            headerCell.textContent = key;
            headerRow.appendChild(headerCell);
        }
    });
    // Add extra columns for delete and edit actions
    headerRow.innerHTML += '<th>Actions</th>';
    headerRow.classList.add('header-table-admin');

    table.appendChild(headerRow);

    // Create data rows
    data.forEach(user => {
        const dataRow = document.createElement('tr');
        for (const key in user) {
            const value = user[key];
            const dataCell = document.createElement('td');

            // Check if the current key is 'url_image'
            if (key === 'password_hash') {
                continue;
            } else {
                dataCell.textContent = value;
            }

            dataRow.appendChild(dataCell);
        }

        // Add delete and edit buttons
        const actionsCell = document.createElement('td');
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteRow(user.user_id));
        deleteButton.classList.add('delete-user'); // Thêm lớp CSS

        // Add edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editRow(user.user_id));
        editButton.classList.add('edit-user'); // Thêm lớp CSS

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        dataRow.appendChild(actionsCell);

        table.appendChild(dataRow);
        });

    // Append the table to the container
    dataContainer.appendChild(table);
}

async function addNewUser(){
    // Show the modal
    const name_new = document.getElementById('user_name_new');
    const password_new = document.getElementById('user_password_new');
    const email_new = document.getElementById('user_email_new');
    const role_new = document.getElementById('user_role_new');

    try {
		await fetch('http://[::1]:3333/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"email": email_new.value,
				"name": name_new.value,
				"password": password_new.value,
				"role": role_new.value,
			}),
		});
	} catch (error) {
		console.error('Fetch error:', error);
	}
}

function editRow(user_id) {
    // Set userId in the modal
    document.getElementById('editUserModal').dataset.user_id = user_id;

    // Show the modal
    document.getElementById('editUserModal').style.display = 'block';
}

async function submitEditUserForm() {
    const user_id = document.getElementById('editUserModal').dataset.user_id;

    const user_name_edit = document.getElementById('user_name_edit').value;
    const user_email_edit = document.getElementById('user_email_edit').value;
    const user_password_edit = document.getElementById('user_password_edit').value;
    const user_role_edit = document.getElementById('user_role_edit').value;

    const token = localStorage.getItem('token');

    // Step 3: Prepare the payload
    const updatePayload = {};

    // Check and update each field if it's not null
    if (user_email_edit !== '') {
        updatePayload.email = user_email_edit;
    }

    if (user_name_edit !== '') {
        updatePayload.name = user_name_edit;
    }

    if (user_password_edit !== undefined) {
        updatePayload.password = user_password_edit;
    }

    if (user_role_edit !== '') {
        updatePayload.role = user_role_edit;
    }

    console.log("USSER: " + updatePayload)
    // Make PATCH request to the backend
    fetch(`http://[::1]:3333/users/user/${user_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Close the modal
        closeUserModal();
        // Reload the data after editing
        reloadUserData();
    })
    .catch(error => {
        console.error('Error editing user:', error);
    });
}

async function reloadUserData() {
    // Reload user data after delete or edit
    const token = localStorage.getItem('token');

    await fetch('http://[::1]:3333/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        renderData(data);
    })
    .catch(error => {
        console.error('Error reloading data:', error);
    });
}

function closeUserModal(){
    document.getElementById('editUserModal').style.display = 'none';
}

function deleteRow(user_id) {
    // Confirm deletion with the user
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    const token = localStorage.getItem('token');

    if (confirmDelete) {
        // Make DELETE request to the backend
        fetch(`http://[::1]:3333/users/user/${user_id}`, {
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
            console.log(`user with ID ${user_id} deleted successfully.`);
            // Reload the data after deletion
            reloadUserData();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    }
}

async function findByuserName() {
    try {
        const searchInput = document.querySelector('input[type="search"]');
        const token = localStorage.getItem('token');
        const userName = searchInput.value;

        const response = await fetch(`http://[::1]:3333/users/users?name=${userName}`, {
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