document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem("email");

        const user_response = await fetch(`http://[::1]:3333/users/user/email/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (!user_response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await user_response.json();

        console.log(user);

        const response = await fetch(`http://[::1]:3333/bookings/bookingsbyuserid/${user.user_id}`,{
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
        if (key !== 'updateAt') {
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
    data.forEach(booking => {
        const dataRow = document.createElement('tr');
        for (const key in booking) {
            const value = booking[key];
            const dataCell = document.createElement('td');
            if (key === 'updateAt') {
                continue;
            }
            // Check if the current key is 'url_image'
            if (key === 'createdAt' ) {
                if (value){
                    dataCell.textContent = formatDateTime(value);
                }
            } else {
                dataCell.textContent = value;
            }

            dataRow.appendChild(dataCell);
        }
        table.appendChild(dataRow);
        const actionsCell = document.createElement('td');
        const checkDetailButton = document.createElement('button');
        checkDetailButton.textContent = 'Detail';
        checkDetailButton.addEventListener('click', () => checkDetail(booking.booking_id));

        checkDetailButton.classList.add('detail-button'); // Thêm lớp CSS
        actionsCell.appendChild(checkDetailButton);
        dataRow.appendChild(actionsCell);
    });

    

    // Append the table to the container
    dataContainer.appendChild(table);
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

async function checkDetail(bookingId) {
    const booking_details = await getBookingDetailsByBookingId(bookingId);
    var show_seat;
    const payment = await getPaymentBybookingId(bookingId);
    console.log("PAYMENT: " + (JSON.stringify(payment)));

    if (booking_details && booking_details.length > 0 && payment.length !== 0) {
        const seatPromises = booking_details.map(async bd => {
            show_seat = await getShowSeatsById(bd.showSeatId);
            const seat = await getSeatById(show_seat.seatId);
            return seat;
        });

        const seats = await Promise.all(seatPromises);
        const showId = show_seat.showId;
        if (showId !== undefined) {
            const show = await getShowById(showId);
            console.log(show);
            const movie = await getMovieById(show.movieId);
            const screen = await getScreenById(seats[0].screenId);
            const cinema = await getCinemaById(screen.cinemaId);

            console.log(cinema);
            console.log(show);
            console.log(seats);
            console.log(movie);
            console.log(screen);

            const modal = document.getElementById('bookingInfoModal');
            const contentContainer = document.getElementById('bookingInfoContent');

            contentContainer.innerHTML = '';
        
    
        // Hiển thị thông tin show từ API
        const seatInfo = seats.map(seat => `${seat.row}${seat.seat_number}`).join(', ');

        const showInfoText = document.createElement('p');
        showInfoText.innerHTML = `<span><strong>Cinema:</strong></span> ${cinema.name}<br>
                                <span><strong>Movie:</strong></span> ${movie.title}<br>
                                <span><strong>Show ID:</strong></span> ${show.show_id}<br>
                                <span><strong>Screen ID:</strong></span> ${screen.screen_id}<br>
                                <span><strong>Seat:</strong></span> ${seatInfo}<br>
                                <span><strong>Start Time:</strong></span> ${formatDateTime(show.startAt)}<br>
                                <span><strong>End Time:</strong></span> ${formatDateTime(show.endAt)}<br>
                                <span><strong>Payment:</strong></span> ${payment[0].amount} <br>
                                <span><strong>Payment status:</strong></span> ${payment[0].paymentStatus}`;

        contentContainer.appendChild(showInfoText);

    
        // Hiển thị modal
        document.querySelector('.modal-overlay').style.display = 'block';
        modal.style.display = 'block';
        }
    }
    else if (booking_details && booking_details.length > 0 && payment.length === 0) {
        const seatPromises = booking_details.map(async bd => {
            show_seat = await getShowSeatsById(bd.showSeatId);
            const seat = await getSeatById(show_seat.seatId);
            return seat;
        });

        const seats = await Promise.all(seatPromises);
        const showId = show_seat.showId;
        if (showId !== undefined) {
            const show = await getShowById(showId);
            console.log(show);
            const movie = await getMovieById(show.movieId);
            const screen = await getScreenById(seats[0].screenId);
            const cinema = await getCinemaById(screen.cinemaId);

            console.log(cinema);
            console.log(show);
            console.log(seats);
            console.log(movie);
            console.log(screen);

            const modal = document.getElementById('bookingInfoModal');
            const contentContainer = document.getElementById('bookingInfoContent');

            contentContainer.innerHTML = '';
        
    
        // Hiển thị thông tin show từ API
        const seatInfo = seats.map(seat => `${seat.row}${seat.seat_number}`).join(', ');

        const showInfoText = document.createElement('p');
        showInfoText.innerHTML = `<span><strong>Cinema:</strong></span> ${cinema.name}<br>
                                <span><strong>Movie:</strong></span> ${movie.title}<br>
                                <span><strong>Show ID:</strong></span> ${show.show_id}<br>
                                <span><strong>Screen ID:</strong></span> ${screen.screen_id}<br>
                                <span><strong>Seat:</strong></span> ${seatInfo}<br>
                                <span><strong>Start Time:</strong></span> ${formatDateTime(show.startAt)}<br>
                                <span><strong>End Time:</strong></span> ${formatDateTime(show.endAt)}<br>
                                <span><strong>Payment:</strong></span> NOT YET <br>`;

        contentContainer.appendChild(showInfoText);

    
        // Hiển thị modal
        document.querySelector('.modal-overlay').style.display = 'block';
        modal.style.display = 'block';
        }
    }
    else  {
        const modal = document.getElementById('bookingInfoModal');
        const contentContainer = document.getElementById('bookingInfoContent');
    
        contentContainer.innerHTML = '';
    
        // Hiển thị thông tin show từ API
        const showInfoText = document.createElement('p');
        showInfoText.innerHTML =    `<span><strong> Booking is fail!`;  
        contentContainer.appendChild(showInfoText);
    
        // Hiển thị modal
        document.querySelector('.modal-overlay').style.display = 'block';
        modal.style.display = 'block';
    }
    
}



function closeBookingInfoModal() {
    document.getElementById('bookingInfoModal').style.display = 'none';
    document.querySelector('.modal-overlay').style.display = 'none';

}

async function getBookingDetailsByBookingId(bookingId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://[::1]:3333/booking-details/booking-detailsbybookingid/${bookingId}`, {
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
        return data;
    } catch (error) {
        console.error('Error fetching booking detail data:', error);
    }
}

async function getShowSeatsById(id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/show-seats/show-seat/${id}`, {
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

async function getShowById(showId) {
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
        return data;
        // Hiển thị thông tin show trong modal
    } catch (error) {
        console.error('Error fetching show information:', error);
    }
}

async function getPaymentBybookingId(booking_id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/payments/paymentsbybookingid/${booking_id}`, {
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
        console.error('Error fetching payments data:', error);
    }
}