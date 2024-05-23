$(document).ready(function () {
    const apiUrl = 'https://localhost:7146/api/Livro';

    // Load books
    function loadBooks() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (data) {
                let bookList = '';
                $.each(data, function (index, book) {
                    bookList += `
                        <tr>
                            <td>${book.id}</td>
                            <td class="editable" data-id="${book.id}" data-field="title">${book.titulo}</td>
                            <td class="editable" data-id="${book.id}" data-field="quantidadePaginas">${book.quantidadePaginas}</td>
                            <td class="editable" data-id="${book.id}" data-field="disponivel">${book.disponivel}</td>
                            <td>
                                <button class="edit" data-id="${book.id}">Edit</button>
                                <button class="delete" data-id="${book.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                $('#bookList').html(bookList);
            }
        });
    }

    loadBooks();

    // Add or update book
    $('#bookForm').submit(function (e) {
        e.preventDefault();
        const bookId = $('#bookId').val();
        const bookData = {
            titulo: $('#title').val(),
            quantidadePaginas: parseInt($('#pages').val()),
            disponivel: $('#available').is(':checked')
        };
        if (bookId) {
            // Update book
            $.ajax({
                url: `${apiUrl}/${bookId}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(bookData),
                success: function () {
                    loadBooks();
                    $('#bookForm')[0].reset();
                }
            });
        } else {
            // Add book
            $.ajax({
                url: apiUrl,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(bookData),
                success: function () {
                    loadBooks();
                    $('#bookForm')[0].reset();
                }
            });
        }
    });

    // Edit book
    $(document).on('click', '.edit', function () {
        const bookId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/${bookId}`,
            method: 'GET',
            success: function (book) {
                $('#bookId').val(book.id);
                $('#title').val(book.titulo);
                $('#pages').val(book.quantidadePaginas);
                $('#available').prop('checked', book.disponivel);
            }
        });
    });

    // Delete book
    $(document).on('click', '.delete', function () {
        const bookId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/${bookId}`,
            method: 'DELETE',
            success: function () {
                loadBooks();
            }
        });
    });

    // Inline edit
    $(document).on('dblclick', '.editable', function () {
        const originalValue = $(this).text();
        const field = $(this).data('field');
        const id = $(this).data('id');
        $(this).html(`<input type="text" value="${originalValue}" data-original="${originalValue}" data-field="${field}" data-id="${id}">`);
        $(this).find('input').focus();
    });

    $(document).on('blur', '.editable input', function () {
        const newValue = $(this).val();
        const originalValue = $(this).data('original');
        const field = $(this).data('field');
        const id = $(this).data('id');
        if (newValue !== originalValue) {
            const updateData = {};
            updateData[field] = field === 'quantidadePaginas' ? parseInt(newValue) : newValue;
            if (field === 'disponivel') updateData[field] = newValue === 'true';
            $.ajax({
                url: `${apiUrl}/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updateData),
                success: function () {
                    loadBooks();
                }
            });
        } else {
            $(this).parent().text(originalValue);
        }
    });
});
