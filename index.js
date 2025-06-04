const express = require('express');
const app = express();


let tasks = [
  { id: 1, title: 'API Express', completed: false },
  { id: 2, title: 'Criar Lista de tarefas', completed: true }
];
let nextId = 3;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <title>Lista de Tarefas Simples</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        :root {
          --deepseek-blue: #1e4d8b;
          --deepseek-light-blue: #e6f0fa;
          --pastel-green: #c1f0c1;
        }
        body {
          background-color: #f8f9fa;
          padding-top: 2rem;
        }
        .task-card {
          border-left: 4px solid var(--deepseek-blue);
          margin-bottom: 0.5rem;
          transition: all 0.3s;
        }
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .completed {
          background-color: var(--pastel-green);
          border-left-color: #28a745;
        }
        .header {
          background-color: var(--deepseek-blue);
          color: white;
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 0.25rem;
        }
        .btn-deepseek {
          background-color: var(--deepseek-blue);
          color: white;
        }
        .btn-deepseek:hover {
          background-color: #163a6b;
          color: white;
        }
        .action-link {
          margin-left: 0.5rem;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header text-center">
          <h1>Minha Lista de Tarefas</h1>
        </div>
        
        <form action="/tasks" method="POST" class="mb-4">
          <div class="input-group">
            <input type="text" class="form-control" name="title" placeholder="Nova tarefa" required>
            <button type="submit" class="btn btn-deepseek">Adicionar</button>
          </div>
        </form>
        
        <div id="tasks">
  `;


  tasks.forEach(task => {
    html += `
      <div class="task-card card ${task.completed ? 'completed' : ''}">
        <div class="card-body d-flex justify-content-between align-items-center">
          <span>${task.title}</span>
          <div>
            <a href="/tasks/${task.id}/toggle" class="text-decoration-none action-link">
              ${task.completed ? '⏪ Desfazer' : '✅ Completar'}
            </a>
            <a href="/tasks/${task.id}/edit" class="text-decoration-none action-link">
              ✏️ Editar
            </a>
            <a href="/tasks/${task.id}/delete" onclick="return confirm('Tem certeza?')" class="text-decoration-none text-danger action-link">
              🗑️ Excluir
            </a>
          </div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>
      
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `;

  res.send(html);
});


app.post('/tasks', (req, res) => {
  const newTask = {
    id: nextId++,
    title: req.body.title,
    completed: false
  };
  tasks.push(newTask);
  res.redirect('/');
});

app.get('/tasks/:id/toggle', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (task) task.completed = !task.completed;
  res.redirect('/');
});


app.get('/tasks/:id/edit', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.redirect('/');
  
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <title>Editar Tarefa</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { padding: 2rem; background-color: var(--deepseek-light-blue); }
        .edit-container { max-width: 600px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="edit-container">
        <h2 class="mb-4">Editar Tarefa</h2>
        <form action="/tasks/${task.id}/update" method="POST">
          <div class="input-group mb-3">
            <input type="text" class="form-control" name="title" value="${task.title}" required>
            <button type="submit" class="btn btn-deepseek">Atualizar</button>
          </div>
          <a href="/" class="btn btn-outline-secondary">Cancelar</a>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `;
  
  res.send(html);
});

app.post('/tasks/:id/update', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (task) task.title = req.body.title;
  res.redirect('/');
});


app.get('/tasks/:id/delete', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.redirect('/');
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Aplicação rodando em http://localhost:${PORT}`);
});