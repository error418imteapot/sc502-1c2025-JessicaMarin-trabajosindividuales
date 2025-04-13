document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    const tasks = [
        { id: 1, title: "Complete project report", description: "Prepare and submit the project report", dueDate: "2024-12-01" },
        { id: 2, title: "Team Meeting", description: "Get ready for the season", dueDate: "2024-12-01" },
        { id: 3, title: "Code Review", description: "Check partners code", dueDate: "2024-12-01" },
        { id: 4, title: "Deploy", description: "Check deploy steps", dueDate: "2024-12-01" }
    ];

    //carga las tareas en el dom
    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasks.forEach(function (task) {
            //aqui tenimos un element del arreglo de tareas por cada uno de los elementos
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                        <div id="comentarios-${task.id}" class="mt-3"></div>
                        <button type="button" class="btn btn-sm btn-link add-comment" data-id="${task.id}">Add Comment</button>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);

            cargarComentarios(task.id);
        });

        document.querySelectorAll('.edit-task').forEach(btn => btn.addEventListener('click', handleEditTask));
        document.querySelectorAll('.delete-task').forEach(btn => btn.addEventListener('click', handleDeleteTask));
        document.querySelectorAll('.add-comment').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const taskId = e.target.dataset.id;
                document.getElementById("comment-task-id").value = taskId;
                const modal = new bootstrap.Modal(document.getElementById("commentModal"));
                modal.show();
            });
        });
    }

    function cargarComentarios(taskId) {
        fetch(`backend/comentarios.php?task_id=${taskId}`)
            .then(response => response.json())
            .then(comentarios => {
                const contenedor = document.getElementById(`comentarios-${taskId}`);
                contenedor.innerHTML = '';

                if (comentarios.length === 0) {
                    contenedor.innerHTML = '<p class="text-muted">Sin comentarios</p>';
                    return;
                }
                const lista = document.createElement('ul');
                lista.className = 'list-group list-group-flush';

                comentarios.forEach(c => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                        <span>${c.comment}</span>
                        <button class="btn btn-sm btn-danger" onclick="eliminarComentario(${c.id}, ${taskId})">Eliminar</button>
                    `;
                    lista.appendChild(item);
                });

                contenedor.appendChild(lista);
            });
    }

    document.getElementById('comment-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const taskId = parseInt(document.getElementById('comment-task-id').value);
        const comment = document.getElementById('task-comment').value;

        fetch('backend/comentarios.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: taskId, comment: comment })
        })
            .then(res => res.json())
            .then(data => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
                modal.hide();
                document.getElementById('task-comment').value = '';
                cargarComentarios(taskId);
            });
    });

    window.eliminarComentario = function (commentId, taskId) {
        fetch('backend/comentarios.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${commentId}`
        })
            .then(res => res.json())
            .then(data => {
                cargarComentarios(taskId);
            });
    }

    function handleEditTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        //localizar la tarea quieren editar
        const task = tasks.find(t => t.id === taskId);
        //cargar los datos en el formulario 
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('due-date').value = task.dueDate;
        //modo ediciom
        isEditMode = true;
        edittingId = taskId;
        //mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById("taskModal"));
        modal.show();
    }


    function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        const index = tasks.findIndex(t => t.id === id);
        tasks.splice(index, 1);
        loadTasks();
    }

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            const task = tasks.find(t => t.id === edittingId);
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
        } else {
            const newTask = {
                id: tasks.length + 1,
                title: title,
                description: description,
                dueDate: dueDate
            };
            tasks.push(newTask);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('commentModal').addEventListener('show.bs.modal', function () {
        document.getElementById('comment-form').reset();
    });
    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });
    loadTasks();
});