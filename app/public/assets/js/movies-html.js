
function createModal(movie) {
    const modal = document.createElement('div');
    const modal_class = "modal_" + movie.movie_id;
    console.log(modal_class);
    modal.classList.add('modal', modal_class);

    const modalContent = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">${movie.title}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img src="${movie.url_image}" class="img-fluid" alt="">
                    <p><strong>Description:</strong> ${movie.description}</p>
                    <p><strong>Director:</strong> ${movie.director}</p>
                    <p><strong>Genre:</strong> ${movie.genre}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" id="bookButton_${movie.movie_id}">Book</button>
                </div>
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;

    // Thêm modal vào container
    document.getElementById('modalContainer').appendChild(modal);

    const bookButton = document.getElementById(`bookButton_${movie.movie_id}`);
    bookButton.addEventListener('click', function() {
        // Lưu thông tin phim vào Local Storage
        localStorage.setItem('selectedMovie', JSON.stringify(movie));

        // Chuyển hướng sang trang ticket-booking.html
        window.location.href = 'ticket-booking.html';
    });
}

// Duyệt qua mảng bộ phim và tạo modal cho mỗi bộ phim
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://[::1]:3333/movies');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const movies = await response.json();
        const movieContainers = document.getElementsByClassName('w3l-populohny-grids');
        for (const movieContainer of movieContainers) {
            movies.forEach(movie => {
                createModal(movie);
            
                // Tạo một item cho danh sách bộ phim với liên kết để mở modal
                const movieItem = document.createElement('div');
                movieItem.classList.add('item', 'vhny-grid');
                movieItem.innerHTML = `
                    <div class="box16 mb-0">
                        <figure>
                            <img class="img-fluid" src="${movie.url_image}" alt="">
                        </figure>
                        <a href=".modal_${movie.movie_id}" data-toggle="modal">
                            <div class="box-content">
                                <h3 class="title">${movie.title}</h3>
                                <h4>
                                    <span class="post"><span class="fa fa-clock-o"></span> 1 Hr 40min</span>
                                    <span class="post fa fa-heart text-right"></span>
                                </h4>
                            </div>
                        </a>
                    </div>
                `;
            
                // Thêm item vào danh sách bộ phim
                movieContainer.appendChild(movieItem);
            });
        };
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});