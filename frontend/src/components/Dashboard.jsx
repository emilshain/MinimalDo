import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const { username, logout } = useAuth()

  const loadTasks = async () => {
    const { data } = await api.get('/tasks/')
    setTasks(data)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await api.post('/tasks/', { title })
    setTitle('')
    loadTasks()
  }

  const toggleTask = async (task) => {
    await api.patch(`/tasks/${task.id}/`, { is_completed: !task.is_completed })
    loadTasks()
  }

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}/`)
    loadTasks()
  }

  const activeTasks = tasks.filter((t) => !t.is_completed)
  const completedTasks = tasks.filter((t) => t.is_completed)

  return (
    <div className="dashboard">
      <header>
        <h1>My To-Do List</h1>
        <div>
          <span>Hi, {username}</span>
          <button onClick={logout}>Log Out</button>
        </div>
      </header>

      <form onSubmit={addTask} className="add-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <section>
        <h2>Tasks</h2>
        <ul className="task-list">
          {activeTasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => toggleTask(task)}
                />
                {task.title}
              </label>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
          {activeTasks.length === 0 && <p className="empty">No tasks yet.</p>}
        </ul>
      </section>

      <section>
        <h2>Completed</h2>
        <ul className="task-list completed">
          {completedTasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => toggleTask(task)}
                />
                <span className="strikethrough">{task.title}</span>
              </label>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
          {completedTasks.length === 0 && <p className="empty">Nothing completed yet.</p>}
        </ul>
      </section>
    </div>
  )
}
