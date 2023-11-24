async function showAllMovies() {
    try {
        const response = await fetch('http://[::1]:3333/movies');
        
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

async function findByMovieName() {
    try {
        const searchInput = document.querySelector('input[type="search"]');
        const token = localStorage.getItem('token');
        const movieName = searchInput.value;

        const response = await fetch(`http://[::1]:3333/movies/movies?title=${movieName}`, {
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
    data.forEach(movie => {
        const dataRow = document.createElement('tr');
        Object.values(movie).forEach(value => {
            const dataCell = document.createElement('td');
            dataCell.textContent = value;
            dataRow.appendChild(dataCell);
        });

        // Add delete and edit buttons
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteRow(movie.movie_id));
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editRow(movie.movie_id));

        const addShowButton = document.createElement('button');
        addShowButton.textContent = 'Add show';
        addShowButton.addEventListener('click', () => addShowModal(movie.movie_id));

        actionsCell.appendChild(deleteButton);
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(addShowButton);
        dataRow.appendChild(actionsCell);

        // Add button for managing show
        const showCell = document.createElement('td');
        const manageshowButton = document.createElement('button');
        manageshowButton.textContent = 'Manage show';
        manageshowButton.addEventListener('click', () => manageShowModal(movie.movie_id));

        showCell.appendChild(manageshowButton);
        dataRow.appendChild(showCell);

        table.appendChild(dataRow);
    });

    // Append the table to the container
    dataContainer.appendChild(table);
}

function deleteRow(movie_id) {
    // Confirm deletion with the user
    const confirmDelete = confirm('Are you sure you want to delete this movie?');
    const token = localStorage.getItem('token');

    if (confirmDelete) {
        // Make DELETE request to the backend
        fetch(`http://[::1]:3333/movies/movie/${movie_id}`, {
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
            console.log(`Movie with ID ${movie_id} deleted successfully.`);
            // Reload the data after deletion
            reloadmovieData();
        })
        .catch(error => {
            console.error('Error deleting movie:', error);
        });
    }
}

// Function to open the modal
function editRow(movieId) {
    // Set movieId in the modal
    document.getElementById('editMovieModal').dataset.movieId = movieId;

    // Show the modal
    document.getElementById('editMovieModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('editMovieModal').style.display = 'none';
}

// Function to submit the form within the modal
function submitEditForm() {
    const movieId = document.getElementById('editMovieModal').dataset.movieId;

    const movie_name_edit = document.getElementById('movie_name_edit').value;
    const genre_edit = document.getElementById('genre_edit').value;
    const description_edit = document.getElementById('description_edit').value;
    const director_edit = document.getElementById('director_edit').value;
    const mainActor_edit = document.getElementById('director_edit').value;

    const token = localStorage.getItem('token');

    // Make PATCH request to the backend
    fetch(`http://[::1]:3333/movies/movie/${movieId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            "title": movie_name_edit,
            "director": director_edit,
            "main_actors": mainActor_edit,
            "genre": genre_edit,
            "url_image": null,
            "description": description_edit
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`movie with ID ${movieId} edited successfully.`);
        // Close the modal
        closeModal();
        // Reload the data after editing
        reloadmovieData();
    })
    .catch(error => {
        console.error('Error editing movie:', error);
    });
}

function reloadmovieData() {
    // Reload movie data after delete or edit
    fetch('http://[::1]:3333/movies')
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

async function addNewMovie() {
    const movie_name_new = document.getElementById('movie_name_new').value;
    const genre_new = document.getElementById('genre_new').value;
    const description_new = document.getElementById('description_new').value;
    const director_new = document.getElementById('director_new').value;
    const mainActor_new = document.getElementById('director_new').value;

    const token = localStorage.getItem('token');

    const newMovie = {
        "title": movie_name_new,
        "director": director_new,
        "main_actors": mainActor_new,
        "genre": genre_new,
        "url_image": null,
        "description": description_new
    };

    console.log(newMovie)

    try {
        const response = await fetch('http://[::1]:3333/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newMovie),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const addedMovie = await response.json();
        console.log('New movie added:', addedMovie);

        reloadmovieData()
    } catch (error) {
        console.error('Error adding new movie:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch cinemas and populate the cinemaSelect dropdown
    fetch('http://[::1]:3333/cinemas')
        .then(response => response.json())
        .then(cinemas => {
            const cinemaSelect = document.getElementById('cinemaSelect');
            cinemas.forEach(cinema => {
                const option = document.createElement('option');
                option.value = cinema.cinema_id;
                option.textContent = cinema.name;
                cinemaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching cinemas:', error));

    // Handle form submission
    const addShowForm = document.getElementById('addShowForm');
    addShowForm.addEventListener('submit', addShow);
});

async function fetchScreens() {
    const cinemaSelect = document.getElementById('cinemaSelect');
    const selectedCinemaId = cinemaSelect.value;

    const screenSelect = document.getElementById('screenSelect');
    screenSelect.innerHTML = ''; // Clear existing options
    const token = localStorage.getItem('token');

    if (selectedCinemaId) {
        try {
            const response = await fetch(`http://[::1]:3333/screens/screensbycinemaid/${selectedCinemaId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const screens = await response.json();

            screens.forEach(screen => {
                const option = document.createElement('option');
                option.value = screen.screen_id;
                option.textContent = `Screen ${screen.screen_id}`;
                screenSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching screens:', error);
        }
    }
}

async function addShow(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const movieId = document.getElementById('addShowModal').dataset.movieId;

    const cinemaSelect = document.getElementById('cinemaSelect');
    const selectedCinemaId = cinemaSelect.value;

    const screenSelect = document.getElementById('screenSelect');
    const selectedScreenId = screenSelect.value;

    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');

    // Lấy giá trị từ trường input và chuyển đổi thành định dạng mong muốn
    const startTime = formatDateTimeInput(startTimeInput.value);
    const endTime = formatDateTimeInput(endTimeInput.value);

    console.log(startTime, endTime)

    if (selectedCinemaId && selectedScreenId) {
        try {
            const response = await fetch('http://[::1]:3333/shows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    movieId: parseInt(movieId), // Replace with your actual movieId
                    screenId: parseInt(selectedScreenId),
                    startAt: startTime,
                    endAt: endTime,
                }),
            });

            if (response.ok) {
                console.log('Show added successfully.');
                closeShowModal()
            } else {
                console.error('Error adding show:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding show:', error);
        }
    } else {
        console.error('Please select both cinema and screen.');
    }
}

function formatDateTimeInput(dateTimeInput) {
    // Tạo một đối tượng Date từ giá trị nhập vào
    const dateTime = new Date(dateTimeInput);

    // Kiểm tra xem giá trị nhập vào có hợp lệ không
    if (isNaN(dateTime.getTime())) {
        // Nếu không hợp lệ, trả về null hoặc giá trị mặc định khác tùy thuộc vào yêu cầu của bạn
        return null;
    }

    // Chuyển đổi đối tượng Date thành chuỗi có định dạng "YYYY-MM-DDTHH:mm:ss.sssZ"
    const formattedDateTime = dateTime.toISOString();

    return formattedDateTime;
}


function addShowModal(movieId) {
    // Set movieId in the modal
    document.getElementById('addShowModal').dataset.movieId = movieId;

    // Show the modal
    document.getElementById('addShowModal').style.display = 'block';
}

// Function to close the modal
function closeShowModal() {
    document.getElementById('addShowModal').style.display = 'none';
}

async function manageShowModal(movieId) {
    const token = localStorage.getItem('token');

    // Fetch screens for the selected cinema
    const showsResponse = await fetch(`http://[::1]:3333/shows/showsbymovieId/${movieId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!showsResponse.ok) {
        console.error('Error fetching screens:', showsResponse.status);
        return;
    }

    const showData = await showsResponse.json();
    const showList = document.getElementById('showList');

    // const seatCountElement = document.getElementById('screenCount');
    // seatCountElement.textContent = `Total: ${showData.length}`;

    // Clear previous content
    showList.innerHTML = '';

    // Populate screen list
    showData.forEach(show => {
        const showButton = document.createElement('button');
        showButton.textContent = `Show ${show.show_id}`;
        showButton.onclick = () => getShowInfo(show.show_id);
        const listItem = document.createElement('li');
        listItem.appendChild(showButton);
        showList.appendChild(listItem);
    });

    // Set movieId in the modal
    document.getElementById('manageShowModal').dataset.movieId = movieId;
    // Show the modal
    document.getElementById('manageShowModal').style.display = 'block';
}

// Function to close the modal
function closeManageShowModal() {
    document.getElementById('manageShowModal').style.display = 'none';
}

// Hàm để lấy thông tin show từ API
async function getShowInfo(showId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://[::1]:3333/shows/show/${showId}`, {
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
        console.log('Show Information:', data);

        // Hiển thị thông tin show trong modal
        openShowInfoModal(data);
    } catch (error) {
        console.error('Error fetching show information:', error);
    }
}

async function openShowInfoModal(showInfo) {
    // Tương tự như trước
    const modal = document.getElementById('showInfoModal');
    const contentContainer = document.getElementById('showInfoContent');

    // Xóa nội dung cũ
    contentContainer.innerHTML = '';

    const movieInfo = await getMovieById(showInfo.movieId);
    const screenInfo = await getScreenById(showInfo.screenId);
    const cinemaInfor = await getCinemaById(screenInfo.cinemaId)

    // Hiển thị thông tin show từ API
    const showInfoText = document.createElement('p');
    showInfoText.innerHTML = `<span>Show ID:</span> ${showInfo.show_id}<br>
                              <span>Movie:</span> ${movieInfo.title}<br>
                              <span>Cinema:</span> ${cinemaInfor.name}<br>
                              <span>Screen ID:</span> ${showInfo.screenId}<br>
                              <span>Start Time:</span> ${showInfo.startAt}<br>
                              <span>End Time:</span> ${showInfo.endAt}`;    
    contentContainer.appendChild(showInfoText);
    // Hiển thị modal
    modal.style.display = 'block';
}

function closeShowInfoModal() {
    document.getElementById('showInfoModal').style.display = 'none';
}

async function getMovieById(movieId) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/movies/movie/${movieId}`, {
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
        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

async function getScreenById(screenid) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/screens/screen/${screenid}`, {
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
        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

async function getCinemaById(cinemaId) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/cinemas/cinema/${cinemaId}`, {
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
        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}


