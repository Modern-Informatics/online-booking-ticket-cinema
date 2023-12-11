document.addEventListener('DOMContentLoaded', async () => {
    const cinemaListContainer = document.querySelector('.cinema-list');
  
    // Gọi API để lấy danh sách rạp phim
    fetch('http://[::1]:3333/cinemas')
      .then(response => response.json())
      .then(cinemas => {
        cinemas.forEach(cinema => {
            const cinemaButton = document.createElement('button');
            cinemaButton.textContent = cinema.name;
    
            cinemaButton.addEventListener('click', async () => {
                // Gọi API để lấy thông tin chi tiết của rạp phim khi nút được bấm
                const token = localStorage.getItem('token');
                const selectedMovie = getSelectedMovie();
            
                const screens = await getScreensByCinemaId(cinema.cinema_id);
                const shows = await getShowBymovieId(selectedMovie.movie_id)
            
                const filteredShows = shows.filter(show => screens.some(screen => screen.screen_id === show.screenId));
            
                console.log(screens);
                console.log(shows);
                console.log(filteredShows);
            
                // Fetch screens for the selected cinema
                const showsResponse = await fetch(`http://[::1]:3333/shows/showsbymovieId/${selectedMovie.movie_id}`, {
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
            
                const showData = filteredShows;
                const showList = document.getElementById('showList');
            
            
            
                // Hiển thị thông tin show từ API
                // Clear previous content
                showList.innerHTML = '';
                if (showData.length > 0) {
                    showData.forEach(async show => {               
                        const showButton = document.createElement('button');
                        showButton.innerHTML = `<span><strong>Start Time:</strong></span> ${formatDateTime(show.startAt)}<br>
                                                <span><strong>End Time:</strong></span> ${formatDateTime(show.endAt)}`;
                        showButton.onclick = () => getShowInfo(show.show_id);
                        const listItem = document.createElement('li');
                        listItem.appendChild(showButton);
                        showList.appendChild(listItem);
                    });
                }
                else {
                    const showEmpty = document.createElement('h3');
                    showEmpty.innerHTML = `<span><strong>THERE IS NO SHOW AVAILABLE`;
                    const listItem = document.createElement('li');
                    listItem.appendChild(showEmpty);
                    showList.appendChild(listItem);
                }
            });
    
            cinemaListContainer.appendChild(cinemaButton);
        });
      });   
})

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

function getSelectedMovie() {
    const selectedMovie = localStorage.getItem('selectedMovie');
    return selectedMovie ? JSON.parse(selectedMovie) : null;
}

function closeShowInfoModal() {
    document.getElementById('showInfoModal').style.display = 'none';
}

function closeNotiModal() {
    document.getElementById('notiModal').style.display = 'none';
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

let finalTotalAmount = 0;

async function openShowInfoModal(showInfo) {
    const modal = document.getElementById('showInfoModal');
    const contentContainer = document.getElementById('showInfoContent');

    contentContainer.innerHTML = '';

    const movieInfo = await getMovieById(showInfo.movieId);
    const screenInfo = await getScreenById(showInfo.screenId);
    const cinemaInfor = await getCinemaById(screenInfo.cinemaId)

    // Hiển thị thông tin show từ API
    const showInfoText = document.createElement('p');
    showInfoText.innerHTML = `<span><strong>Show ID:</strong></span> ${showInfo.show_id}<br>
                              <span><strong>Movie:</strong></span> ${movieInfo.title}<br>
                              <span><strong>Cinema:</strong></span> ${cinemaInfor.name}<br>
                              <span><strong>Screen ID:</strong></span> ${showInfo.screenId}<br>
                              <span><strong>Start Time:</strong></span> ${formatDateTime(showInfo.startAt)}<br>
                              <span><strong>End Time:</strong></span> ${formatDateTime(showInfo.endAt)}`;    
    contentContainer.appendChild(showInfoText);

    const showseatsData = await getShowSeatsByShowId(showInfo.show_id);
    const showSeatList = document.getElementById('showSeatList');
    const totalAmountElement = document.createElement('p');
    totalAmountElement.id = 'totalAmount';
    contentContainer.appendChild(totalAmountElement);

    // Clear previous content
    showSeatList.innerHTML = '';
    const selectedSeats = [];

    // Populate seat list
    showseatsData.forEach(async seat => {
        const listItem = document.createElement('li');
        const seat_data = await getSeatById(seat.seatId);
        listItem.textContent = `${seat_data.row}${seat_data.seat_number}`;
        // Áp dụng lớp CSS tùy thuộc vào giá trị status
        listItem.classList.add(getStatusClass(seat.status), "seat");
    
        console.log(seat);
        // Thêm sự kiện click cho mỗi ghế
        listItem.addEventListener('click', () => handleSeatClick(selectedSeats, listItem, seat.show_seat_id, seat.price));
        localStorage.setItem('showId', seat.showId);
        showSeatList.appendChild(listItem);
    });

    updateTotalAmount(selectedSeats);
    // Hiển thị modal
    modal.style.display = 'block';
}

function updateTotalAmount(selectedSeats) {
    const totalAmountElement = document.getElementById('totalAmount');
    const totalAmount = selectedSeats.reduce((total, seat) => parseFloat(total) + parseFloat(seat.seatPrice), 0);
    totalAmountElement.innerHTML = `<strong>Total Amount:</strong> ${totalAmount} USD`
    finalTotalAmount = totalAmount;
}

function openpaymentModal() {
    const modal = document.getElementById('paymentModal');
    updatePaymentAmount();
    modal.style.display = 'block';
}

function closepaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';

}

function updatePaymentAmount() {
    const totalAmountDisplay = document.getElementById('totalAmountDisplay');
    totalAmountDisplay.textContent = `${finalTotalAmount} USD`;
}

function handleSeatClick(selectedSeats, seatElement, show_seat_id, seatPrice) {
    // Kiểm tra xem ghế đã chọn chưa
    const seatIndex = selectedSeats.findIndex(seat => seat.show_seat_id === show_seat_id);
    if (seatIndex === -1) {
        // Nếu ghế chưa được chọn, thêm vào mảng
        selectedSeats.push({ show_seat_id, seatPrice });
        seatElement.classList.add('selected');
    } else {
        // Nếu ghế đã được chọn, loại bỏ khỏi mảng
        selectedSeats.splice(seatIndex, 1);
        seatElement.classList.remove('selected');
    }
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    // Log để kiểm tra các ghế đã chọn
    updateTotalAmount(selectedSeats);
    console.log('Selected Seats:', selectedSeats);
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

async function createBooking() {
    const email = localStorage.getItem("email");
    const user = await getUserByEmail(email);
    const token = localStorage.getItem('token');
    const newbooking = {
        "userId": user.user_id,
    };
    try {
        const response = await fetch('http://[::1]:3333/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newbooking),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const addedbooking = await response.json();
        console.log("New Booking: " + addedbooking);

        const selectedSeatsString = localStorage.getItem("selectedSeats");
        if (selectedSeatsString) {
            try {
                // Chuyển đổi chuỗi JSON thành mảng JavaScript
                const selectedSeatsArray = JSON.parse(selectedSeatsString);
        
                // Lặp qua mảng và log giá trị show_seat_id
                selectedSeatsArray.forEach(async seat => {
                    await createBookingDeatil(addedbooking.booking_id, seat.show_seat_id);
                    await updateShowSeat(seat.show_seat_id);
                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.log('No selected seats found in localStorage');
        }

        const payment_submit = document.getElementById("payment-submit-button");
        payment_submit.onclick = async () => {
            const payment_data = await createPayment(addedbooking.booking_id, finalTotalAmount);
            closepaymentModal();
            closeShowInfoModal();

            const selectedSeatsArray = JSON.parse(selectedSeatsString);
            selectedSeatsArray.forEach(async seat => {
                await comfirmShowSeat(seat.show_seat_id);
            });

            confirmBooking(addedbooking.booking_id);
            const noti = await createNotification(addedbooking.userId, `YOUR BOOKING CREATED AT ${formatDateTime(addedbooking.createdAt)}`)
            confirmPayment(parseInt(payment_data.payment_id), addedbooking.booking_id);
            openNotiModal(noti.message);
        };

        const payment_cancel = document.getElementById("payment-cancel-button");
        payment_cancel.onclick = async () => {
            const payment_data = await createPayment(addedbooking.booking_id, finalTotalAmount);
            closepaymentModal();
            closeShowInfoModal();

            const selectedSeatsArray = JSON.parse(selectedSeatsString);
            selectedSeatsArray.forEach(async seat => {
                await cancelShowSeat(seat.show_seat_id);
            });

            cancelBooking(addedbooking.booking_id);
            const noti = await createNotification(addedbooking.userId, `YOUR BOOKING IS CANCELED`)
            cancalPayment(parseInt(payment_data.payment_id), addedbooking.booking_id);
            openNotiModal(noti.message);
        };
    } catch (error) {
        console.error('Error adding new booking:', error);
    }
}
async function confirmBooking(bookingId){
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/bookings/booking/${bookingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "status": "CONFIRMED"
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("Booking confirmed!");
    } catch (error) {
        console.error('Error adding new booking:', error);
    }
}

async function cancelBooking(bookingId){
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/bookings/booking/${bookingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "status": "CANCELLED"
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("Booking cancel!");
    } catch (error) {
        console.error('Error adding new booking:', error);
    }
}


async function confirmPayment(payment_id, booking_id){
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://[::1]:3333/payments/payment/${payment_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "bookingId": booking_id,
                "paymentStatus": "COMPLETED"
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("Payment confirmed!");
    } catch (error) {
        console.error('Error adding new Payment:', error);
    }
}

async function cancalPayment(payment_id, booking_id){
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://[::1]:3333/payments/payment/${payment_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "bookingId": booking_id,
                "paymentStatus": "FAILED"
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("Payment canceled!");
    } catch (error) {
        console.error('Error adding new Payment:', error);
    }
}

async function getUserByEmail(email) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/users/user/email/${email}`, {
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

async function createBookingDeatil(bookingId, showSeatId) {
    const newbookingDetail = {
        "bookingId" : bookingId,
        "showSeatId" :showSeatId,
    };
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://[::1]:3333/booking-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newbookingDetail),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const addedbookingDetail = await response.json();
        console.log("New Booking added!" + addedbookingDetail);
    } catch (error) {
        console.error('Error adding new booking:', error);
    }
}

async function createPayment(bookingId, amount) {
    const newpayment = {
        "bookingId" : bookingId,
        "amount" :amount,
    };
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://[::1]:3333/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newpayment),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("New payment added!");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding new payment:', error);
    }
}

async function createNotification(userId, message) {
    const newNoti = {
        "userId" : userId,
        "message" :message,
    };
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://[::1]:3333/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newNoti),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("New notifications added!");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding new notifications:', error);
    }
}

async function openNotiModal(noti) {
    const modal = document.getElementById('notiModal');
    const contentContainer = document.getElementById('notiContent');

    contentContainer.innerHTML = '';

    // Hiển thị thông tin show từ API
    const notiText = document.createElement('p');
    notiText.innerHTML = `<span><strong>${(noti)}<br>`;    
    contentContainer.appendChild(notiText);
    modal.style.display = 'block';
}

async function updateShowSeat(showseatId){
    try {
        const showseat = await getShowSeatsById(showseatId);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://[::1]:3333/show-seats/show-seat/${showseatId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "showId": showseat.showId,
                "status": "RESERVED",
                "seatId": showseat.seatId
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("show seat RESERVED");
    } catch (error) {
        console.error('Error booking seat', error);
    }
}

async function comfirmShowSeat(showseatId){
    try {
        const showseat = await getShowSeatsById(showseatId);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://[::1]:3333/show-seats/show-seat/${showseatId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "showId": showseat.showId,
                "status": "BOOKED",
                "seatId": showseat.seatId
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("show seat BOOKED");
    } catch (error) {
        console.error('Error booking seat', error);
    }
}

async function cancelShowSeat(showseatId){
    try {
        const showseat = await getShowSeatsById(showseatId);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://[::1]:3333/show-seats/show-seat/${showseatId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "showId": showseat.showId,
                "status": "AVAILABLE",
                "seatId": showseat.seatId
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("show seat AVAILABLE again");
    } catch (error) {
        console.error('Error booking seat', error);
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

async function getScreensByCinemaId(cinema_id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/screens/screensbycinemaid/${cinema_id}`, {
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
        console.error('Error fetching screens data:', error);
    }
}

async function getShowBymovieId(movie_id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://[::1]:3333/shows/showsbymovieId/${movie_id}`, {
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
        console.error('Error fetching show data:', error);
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