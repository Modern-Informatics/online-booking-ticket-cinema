document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem("email");
        const response = await fetch(`http://[::1]:3333/users/user/email/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();
        console.log('Data from server:', user);

        // Display data on the HTML page
        renderData(user);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function renderData(data) {
    // Clear previous content of the container
    dataContainer.innerHTML = `<span><strong>User ID:</strong></span> ${data.user_id}<br>
                                <span><strong>Email:</strong></span> ${data.email}<br>
                                <span><strong>Name:</strong></span> ${data.name}`;
}