document.addEventListener('DOMContentLoaded', async () => {
   
    const token = localStorage.getItem('token');
    const selectedMovie = getSelectedMovie();

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

    const showData = await showsResponse.json();
    const showList = document.getElementById('showList');


    // Clear previous content
    showList.innerHTML = '';

    // Populate screen list
    showData.forEach(show => {
        const showButton = document.createElement('button');
        showButton.textContent = `Show at: ${formatDateTime(show.startAt)}`;
        showButton.onclick = () => getShowInfo(show.show_id);
        const listItem = document.createElement('li');
        listItem.appendChild(showButton);
        showList.appendChild(listItem);
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
                              <span><strong>Start Time:</strong></span> ${showInfo.startAt}<br>
                              <span><strong>End Time:</strong></span> ${showInfo.endAt}`;    
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
        listItem.addEventListener('click', () => handleSeatClick(selectedSeats, listItem, seat.seatId, seat.price));
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
    // Lấy thẻ span để hiển thị giá trị
    const totalAmountDisplay = document.getElementById('totalAmountDisplay');

    // Lấy giá trị thanh toán cuối cùng từ biến finalTotalAmount
    // const finalTotalAmount = getFinalTotalAmount(); // Hàm này cần được xác định dựa trên ngữ cảnh của bạn

    // Hiển thị giá trị thanh toán trong thẻ span
    totalAmountDisplay.textContent = `${finalTotalAmount} USD`;
}

function handleSeatClick(selectedSeats, seatElement, seatId, seatPrice) {
    // Kiểm tra xem ghế đã chọn chưa
    const seatIndex = selectedSeats.findIndex(seat => seat.seatId === seatId);
    if (seatIndex === -1) {
        // Nếu ghế chưa được chọn, thêm vào mảng
        selectedSeats.push({ seatId, seatPrice });
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