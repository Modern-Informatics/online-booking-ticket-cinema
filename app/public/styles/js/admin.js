// Dữ liệu giả cho phim, người dùng và rạp phim
var movies = [
    { title: "Phim A", genre: "Hành Động" },
    { title: "Phim B", genre: "Kinh Dị" },
    { title: "Phim C", genre: "Hài" }
  ];
  
  var users = [
    { name: "Nguyen Van A", email: "vana@example.com" },
    { name: "Tran Thi B", email: "thib@example.com" },
    { name: "Le Van C", email: "vanc@example.com" }
  ];
  
  var cinemas = [
    { name: "Rạp A", address: "Địa chỉ A" },
    { name: "Rạp B", address: "Địa chỉ B" },
    { name: "Rạp C", address: "Địa chỉ C" }
  ];

  // Hàm để hiển thị danh sách phim
  function displayMovies() {
    const table = document.getElementById('movies-table');
    // Clear table trước khi hiển thị mới
    table.innerHTML = `<tr><th>Tên Phim</th><th>Thể Loại</th><th>Hành Động</th></tr>`;
    movies.forEach((movie, index) => {
      const row = table.insertRow();
      row.insertCell(0).textContent = movie.title;
      row.insertCell(1).textContent = movie.genre;
      const actionCell = row.insertCell(2);
      actionCell.innerHTML = `<button onclick="editMovie(${index})">Sửa</button> <button onclick="deleteMovie(${index})">Xoá</button>`;
    });
  }
  
  // Hàm để hiển thị danh sách người dùng
  function displayUsers() {
    const table = document.getElementById('users-table');
    // Clear table trước khi hiển thị mới
    table.innerHTML = `<tr><th>Tên Người Dùng</th><th>Email</th><th>Hành Động</th></tr>`;
    users.forEach((user, index) => {
      const row = table.insertRow();
      row.insertCell(0).textContent = user.name;
      row.insertCell(1).textContent = user.email;
      const actionCell = row.insertCell(2);
      actionCell.innerHTML = `<button onclick="editUser(${index})">Sửa</button> <button onclick="deleteUser(${index})">Xoá</button>`;
    });
  }
  
  // Hàm để hiển thị danh sách rạp phim
  function displayCinemas() {
    const table = document.getElementById('cinemas-table');
    // Clear table trước khi hiển thị mới
    table.innerHTML = `<tr><th>Tên Rạp</th><th>Địa Chỉ</th><th>Hành Động</th></tr>`;
    cinemas.forEach((cinema, index) => {
      const row = table.insertRow();
      row.insertCell(0).textContent = cinema.name;
      row.insertCell(1).textContent = cinema.address;
      const actionCell = row.insertCell(2);
      actionCell.innerHTML = `<button onclick="editCinema(${index})">Sửa</button> <button onclick="deleteCinema(${index})">Xoá</button>`;
    });
  }
  
  // Hàm để xóa phim
  function deleteMovie(index) {
    movies.splice(index, 1);
    displayMovies();
  }
  
  // Hàm để xóa người dùng
  function deleteUser(index) {
    users.splice(index, 1);
    displayUsers();
  }
  
  // Hàm để xóa rạp phim
  function deleteCinema(index) {
    cinemas.splice(index, 1);
    displayCinemas();
  }
  
  // Hàm để hiển thị form thêm phim
  function showAddMovieForm() {
    // Reset form
    document.getElementById('movie-title').value = '';
    document.getElementById('movie-genre').value = '';
    document.getElementById('add-movie-form').style.display = 'block';
  }
  
  // Hàm để hiển thị form thêm người dùng
  function showAddUserForm() {
    // Reset form
    document.getElementById('user-name').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('add-user-form').style.display = 'block';
  }
  
  // Hàm để hiển thị form thêm rạp phim
  function showAddCinemaForm() {
    // Reset form
    document.getElementById('cinema-name').value = '';
    document.getElementById('cinema-address').value = '';
    document.getElementById('add-cinema-form').style.display = 'block';
  }
  
  // Hàm để sửa thông tin phim
  function editMovie(index) {
    const movie = movies[index];
    // Điền thông tin vào form
    document.getElementById('movie-title').value = movie.title;
    document.getElementById('movie-genre').value = movie.genre;
    // Hiển thị form
    showAddMovieForm();
    // Thêm index vào form để biết đây là sửa, không phải thêm mới
    document.getElementById('add-movie').dataset.index = index;
  }
  
  // Hàm để sửa thông tin người dùng
  function editUser(index) {
    const user = users[index];
    // Điền thông tin vào form
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    // Hiển thị form
    showAddUserForm();
    // Thêm index vào form để biết đây là sửa, không phải thêm mới
    document.getElementById('add-user').dataset.index = index;
  }
  
  // Hàm để sửa thông tin rạp phim
  function editCinema(index) {
    const cinema = cinemas[index];
    // Điền thông tin vào form
    document.getElementById('cinema-name').value = cinema.name;
    document.getElementById('cinema-address').value = cinema.address;
    // Hiển thị form
    showAddCinemaForm();
    // Thêm index vào form để biết đây là sửa, không phải thêm mới
    document.getElementById('add-cinema').dataset.index = index;
  }
  
  // Hàm để thêm hoặc cập nhật phim
  function addOrUpdateMovie(event) {
    event.preventDefault();
    const title = document.getElementById('movie-title').value;
    const genre = document.getElementById('movie-genre').value;
    const index = document.getElementById('add-movie').dataset.index;
    
    if (index) {
      // Cập nhật phim
      movies[index] = { title, genre };
    } else {
      // Thêm phim mới
      movies.push({ title, genre });
    }
    
    // Reset form và ẩn nó đi
    delete document.getElementById('add-movie').dataset.index;
    document.getElementById('add-movie-form').style.display = 'none';
    displayMovies();
  }
  
  // Hàm để thêm hoặc cập nhật người dùng
  function addOrUpdateUser(event) {
    event.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const index = document.getElementById('add-user').dataset.index;
    
    if (index) {
      // Cập nhật người dùng
      users[index] = { name, email };
    } else {
      // Thêm người dùng mới
      users.push({ name, email });
    }
    
    // Reset form và ẩn nó đi
    delete document.getElementById('add-user').dataset.index;
    document.getElementById('add-user-form').style.display = 'none';
    displayUsers();
  }
  
  // Hàm để thêm hoặc cập nhật rạp phim
  function addOrUpdateCinema(event) {
    event.preventDefault();
    const name = document.getElementById('cinema-name').value;
    const address = document.getElementById('cinema-address').value;
    const index = document.getElementById('add-cinema').dataset.index;
    
    if (index) {
      // Cập nhật rạp phim
      cinemas[index] = { name, address };
    } else {
      // Thêm rạp phim mới
      cinemas.push({ name, address });
    }
    
    // Reset form và ẩn nó đi
    delete document.getElementById('add-cinema').dataset.index;
    document.getElementById('add-cinema-form').style.display = 'none';
    displayCinemas();
  }
  
  // Gắn hàm xử lý sự kiện submit form
  document.getElementById('add-movie-form').addEventListener('submit', addOrUpdateMovie);
  document.getElementById('add-user-form').addEventListener('submit', addOrUpdateUser);
  document.getElementById('add-cinema-form').addEventListener('submit', addOrUpdateCinema);
  
  // Gọi hàm hiển thị khi trang web tải xong
  window.onload = function() {
  displayMovies();
  displayUsers();
  displayCinemas();
};