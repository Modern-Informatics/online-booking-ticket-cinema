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
    headerRow.classList.add('header-table-admin');

    table.appendChild(headerRow);

    // Create data rows
    data.forEach(movie => {
        const dataRow = document.createElement('tr');
        for (const key in movie) {
            const value = movie[key];
            const dataCell = document.createElement('td');

            // Check if the current key is 'url_image'
            if (key === 'url_image') {
                if (value){
                    const imageElement = document.createElement('img');
                    imageElement.src = value; // Assuming 'value' is the URL of the image
                    imageElement.alt = 'Movie Image';
                    imageElement.style.width = '150px';
                    imageElement.style.height  = '200px'; // Adjust the width as needed
                    dataCell.appendChild(imageElement);
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
        deleteButton.addEventListener('click', () => deleteRow(movie.movie_id));
        deleteButton.classList.add('delete'); // Thêm lớp CSS
    
        // Add edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editRow(movie.movie_id));
        editButton.classList.add('edit'); // Thêm lớp CSS
    
        // Add add show button
        const addShowButton = document.createElement('button');
        addShowButton.textContent = 'Add show';
        addShowButton.addEventListener('click', () => addShowModal(movie.movie_id));
        addShowButton.classList.add('add-show'); // Thêm lớp CSS
        
        // Add manage show button
        const manageShowButton = document.createElement('button');
        manageShowButton.textContent = 'Manage show';
        manageShowButton.addEventListener('click', () => manageShowModal(movie.movie_id));
        manageShowButton.classList.add('manage-show'); // Thêm lớp CSS

        actionsCell.appendChild(addShowButton);
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(manageShowButton);
        actionsCell.appendChild(deleteButton);

        dataRow.appendChild(actionsCell);
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
async function submitEditForm() {
    const movieId = document.getElementById('editMovieModal').dataset.movieId;

    const movie_name_edit = document.getElementById('movie_name_edit').value;
    const genre_edit = document.getElementById('genre_edit').value;
    const description_edit = document.getElementById('description_edit').value;
    const director_edit = document.getElementById('director_edit').value;
    const mainActor_edit = document.getElementById('director_edit').value;

    const fileInput = document.getElementById('image_movie_edit');
    // const imagePreview = document.getElementById('imagePreview_edit');
    const token = localStorage.getItem('token');

    // imagePreview.innerHTML = '';
    let imageUrl = '';
    const file = fileInput.files[0];

    if (file) {
      // Display a preview of the selected image (optional)
      const reader = new FileReader();
    //   reader.onload = function (e) {
    //     imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    //     imagePreview.style.maxWidth = '200px'
    //   };
      reader.readAsDataURL(file);

      // Use FormData to prepare the file for upload
      const formData = new FormData();
      formData.append('image', file);
      // Make a POST request to your backend endpoint
      await fetch('http://[::1]:3333/movies/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then(data => {
        console.log('Image uploaded successfully:', data);
        imageUrl = data.url;
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
    }

    // Step 3: Prepare the payload
    const updatePayload = {};

    // Check and update each field if it's not null
    if (movie_name_edit !== '') {
        updatePayload.title = movie_name_edit;
    }

    if (genre_edit !== '') {
        updatePayload.genre = genre_edit;
    }

    if (description_edit !== '') {
        updatePayload.description = description_edit;
    }

    if (director_edit !== '') {
        updatePayload.director = director_edit;
    }

    if (mainActor_edit !== '') {
        updatePayload.main_actors = mainActor_edit;
    }

    if (imageUrl !== '') {
        updatePayload.url_image = imageUrl;
    }

    // Make PATCH request to the backend
    fetch(`http://[::1]:3333/movies/movie/${movieId}`, {
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
    const mainActor_new = document.getElementById('mainActor_new').value;
    const fileInput = document.getElementById('image_movie');
    const imagePreview = document.getElementById('imagePreview');
    const token = localStorage.getItem('token');

    let imageUrl = '';
    const file = fileInput.files[0];

    if (file) {
      // Display a preview of the selected image (optional)
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);

      // Use FormData to prepare the file for upload
      const formData = new FormData();
      formData.append('image', file);
      // Make a POST request to your backend endpoint
      await fetch('http://[::1]:3333/movies/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then(data => {
        console.log('Image uploaded successfully:', data);
        imageUrl = data.url;
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
    }

    const newMovie = {
        "title": movie_name_new,
        "director": director_new,
        "main_actors": mainActor_new,
        "genre": genre_new,
        "url_image": imageUrl,
        "description": description_new,
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

    const priceAdded = document.getElementById('price');
    const priceAddedValue = priceAdded.value;

    const screenSelect = document.getElementById('screenSelect');
    const selectedScreenId = screenSelect.value;

    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');

    // Lấy giá trị từ trường input và chuyển đổi thành định dạng mong muốn
    const startTime = formatDateTimeInput(startTimeInput.value);
    const endTime = formatDateTimeInput(endTimeInput.value);

    console.log(startTime, endTime)

    let newshow;

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
                newshow = await response.json();

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

    // add show-seats
    const data = await getSeatsByScreenId(selectedScreenId)
    data.forEach(async seat => {
        const seatId = seat.seat_id;
        await createShowSeat( newshow.show_id, seatId, priceAddedValue);
    });
}

async function createShowSeat(showId, seat_id, price) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/show-seats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    "showId": showId,
                    "seatId": seat_id,
                    "price": price
                }
            ),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

async function getSeatsByScreenId(screen_id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/seats/seatsbyscreenid/${screen_id}`, {
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

async function getShowSeatsByShowId(show_id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/show-seats/show-seatsbyshowid/${show_id}`, {
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
    const modal = document.getElementById('showInfoModal');
    const contentContainer = document.getElementById('showInfoContent');

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

    // delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete this show';
    deleteButton.addEventListener('click', () => {deleteShow(showInfo.show_id); closeManageShowModal(showInfo.movieId);});
    contentContainer.appendChild(deleteButton);

    const seatsData = await getShowSeatsByShowId(showInfo.show_id);
    const seatList = document.getElementById('showSeatList');

    // Clear previous content
    seatList.innerHTML = '';

    // Populate seat list
    seatsData.forEach(async seat => {
        const listItem = document.createElement('li');
        const seat_data = await getSeatById(seat.seatId)
        listItem.textContent = `${seat_data.row}${seat_data.seat_number}`;
        // Áp dụng lớp CSS tùy thuộc vào giá trị status
        listItem.classList.add(getStatusClass(seat.status), "seat");

        seatList.appendChild(listItem);
    });

    // Hiển thị modal
    modal.style.display = 'block';
}

function deleteShow(show_id) {
    // Confirm deletion with the user
    const confirmDelete = confirm('Are you sure you want to delete this movie?');
    const token = localStorage.getItem('token');

    if (confirmDelete) {
        // Make DELETE request to the backend
        fetch(`http://[::1]:3333/Shows/show/${show_id}`, {
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
            console.log(`Show with ID ${show_id} deleted successfully.`);
            closeShowInfoModal();
            closeShowModal();
        })
        .catch(error => {
            console.error('Error deleting booking:', error);
        });
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'AVAILABLE':
            return 'available';
        // Thêm các trường hợp khác nếu cần
        default:
            return 'other-status';
    }
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

async function getSeatById(seat_id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/seats/seat/${seat_id}`, {
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


