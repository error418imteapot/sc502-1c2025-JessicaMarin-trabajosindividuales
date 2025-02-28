document.addEventListener('DOMContentLoaded', function(){

    const tasks = [
        {
            id: 1,
            title: "Implementar respaldos automaticos",
            description: "Configurar para las bases de datos y archivos críticos del departamento.",
            due_date: "2025-08-25",
            comments: ["esto es un comentario de prueba para eliminar"]
        },
        {
            id: 2,
            title: "Auditoria de Seguridad en la Red",
            description: "Realizar una auditoría completa de seguridad en la red.",
            due_date: "2025-08-26",
            comments: [] 
        },
        {
            id: 3,
            title: "Actualización de Software",
            description: "Asegurarse de que todos los equipos cuenten con los parches de seguridad más recientes.",
            due_date: "2025-08-27",
            comments: []
        },
        {
            id: 4,
            title: "Implementación de Sistema de Monitoreo",
            description: "Incluir alertas para cualquier caída de servicio.",
            due_date: "2025-08-27",
            comments: []
        }
    ];    
 
    let editingTaskId = null;
    let taskCounter = tasks.length;
 
    function loadTasks(){
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
 
        tasks.forEach(function(task){
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text text-muted">${task.due_date}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Eliminar</button>
                    </div>
                    <div class="mt-3">
                        <h6>Comentarios</h6>
                        <ul class="list-group" id="comments-${task.id}">
                            ${task.comments.map(comment => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    ${comment}
                                    <button class="btn btn-danger btn-sm" onclick="deleteComment(${task.id}, '${comment}')">Eliminar</button>
                                </li>
                            `).join('')}
                        </ul>
                        <div class="mt-2">
                            <input type="text" id="new-comment-${task.id}" class="form-control" placeholder="Agregar un comentario">
                            <button class="btn btn-primary btn-sm mt-2" onclick="addComment(${task.id})">Añadir comentario</button>
                        </div>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);
        });

        console.log(tasks);
 
        document.querySelectorAll('.edit-task').forEach(function(btnEdit){
            btnEdit.addEventListener('click', handleEditTask);
        });
 
        document.querySelectorAll('.delete-task').forEach(function(btnDelete){
            btnDelete.addEventListener('click', handleDeleteTask);
        });
    
    }

    window.addComment = function(taskId) {
        const commentInput = document.getElementById(`new-comment-${taskId}`);
        const comment = commentInput.value.trim();
        if (comment) {
            const task = tasks.find(t => t.id === taskId);
            task.comments.push(comment);
            commentInput.value = '';
            loadTasks();
        }
    }

    window.deleteComment = function(taskId, comment) {
        const task = tasks.find(t => t.id === taskId);
        const commentIndex = task.comments.indexOf(comment);
        if (commentIndex > -1) {
            task.comments.splice(commentIndex, 1);
            loadTasks();
        }
    }
 
    function handleEditTask(event){
        editingTaskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === editingTaskId);
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('due-date').value = task.due_date;
        document.getElementById('taskModalLabel').textContent = 'Edit task';
        const modal = new bootstrap.Modal(document.getElementById('taskModal'));
        modal.show();
    }
 
    function handleDeleteTask(event){
        const id = parseInt(event.target.dataset.id);
        const taskIndex = tasks.findIndex( t => t.id === id);
        tasks.splice(taskIndex,1);
        loadTasks();
    }
 
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;
 
        if(!editingTaskId){
            taskCounter = taskCounter + 1;
            const newTask = {
                id: taskCounter,
                title:title,
                description: description,
                due_date: dueDate
            };
            tasks.push(newTask);
        }else{
            let task = tasks.find( t => t.id === editingTaskId);
            task.title = title;
            task.description = description;
            task.due_date = dueDate;
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });
 
    document.getElementById('taskModal').addEventListener('show.bs.modal',function(){
        if(!editingTaskId){
            document.getElementById('task-form').reset();
            document.getElementById('taskModalLabel').textContent = 'Add Task';
        }
        
    });
 
    document.getElementById('taskModal').addEventListener('hidden.bs.modal', function(){
        editingTaskId = null;
    })
 
 
    loadTasks();
 
});