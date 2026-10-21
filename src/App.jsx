
import { useEffect, useState } from 'react'
import './App.css'

function readStorage(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return Array.isArray(value) ? value : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [page, setPage] = useState('tasks')
  const [tasks, setTasks] = useState(() => readStorage('minorproject04-tasks'))
  const [notes, setNotes] = useState(() => readStorage('minorproject04-notes'))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)

  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [category, setCategory] = useState('Personal')
  const [noteSearch, setNoteSearch] = useState('')
  const [noteFilter, setNoteFilter] = useState('All')
  const [editNoteId, setEditNoteId] = useState(null)

  useEffect(() => {
    localStorage.setItem('minorproject04-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('minorproject04-notes', JSON.stringify(notes))
  }, [notes])

  function handleTaskSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return

    if (editId !== null) {
      setTasks(current => current.map(task =>
        task.id === editId
          ? { ...task, title: title.trim(), description: description.trim(), priority }
          : task
      ))
    } else {
      setTasks(current => [{
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        priority,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
      }, ...current])
    }
    resetTaskForm()
  }

  function resetTaskForm() {
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setEditId(null)
  }

  function editTask(task) {
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setEditId(task.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteTask(id) {
    if (window.confirm('Delete this task?')) {
      setTasks(current => current.filter(task => task.id !== id))
      if (editId === id) resetTaskForm()
    }
  }

  function toggleTask(id) {
    setTasks(current => current.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedCount = tasks.filter(task => task.completed).length
  const activeCount = tasks.length - completedCount

  const visibleTasks = tasks.filter(task => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && !task.completed) ||
      (filter === 'Completed' && task.completed)
    const term = search.toLowerCase()
    return matchesFilter &&
      (task.title.toLowerCase().includes(term) ||
       task.description.toLowerCase().includes(term))
  })

  function resetNoteForm() {
    setNoteTitle('')
    setNoteContent('')
    setCategory('Personal')
    setEditNoteId(null)
  }

  function handleNoteSubmit(event) {
    event.preventDefault()
    if (!noteTitle.trim() || !noteContent.trim()) return

    const now = new Date().toISOString()

    if (editNoteId !== null) {
      setNotes(current => current.map(note =>
        note.id === editNoteId
          ? {
              ...note,
              title: noteTitle.trim(),
              content: noteContent.trim(),
              category,
              updatedAt: now,
            }
          : note
      ))
    } else {
      setNotes(current => [{
        id: Date.now(),
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category,
        createdAt: now,
        updatedAt: now,
      }, ...current])
    }

    resetNoteForm()
  }

  function editNote(note) {
    setNoteTitle(note.title)
    setNoteContent(note.content)
    setCategory(note.category)
    setEditNoteId(note.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteNote(id) {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(current => current.filter(note => note.id !== id))
      if (editNoteId === id) resetNoteForm()
    }
  }

  const categories = ['All', 'Personal', 'Study', 'Work', 'Ideas']

  const visibleNotes = notes.filter(note => {
    const term = noteSearch.toLowerCase()
    const matchesText =
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    const matchesCategory = noteFilter === 'All' || note.category === noteFilter
    return matchesText && matchesCategory
  })

  function formatDate(date) {
    if (!date) return 'Just now'
    return new Date(date).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="brand" href="#home" onClick={() => setPage('tasks')}>
          <span className="brand-icon">✓</span> TaskFlow
        </a>
        <span className="header-label">YOUR PERSONAL WORKSPACE</span>
      </header>

      <nav className="main-nav" aria-label="App navigation">
        <button
          type="button"
          className={page === 'tasks' ? 'nav-tab active' : 'nav-tab'}
          onClick={() => setPage('tasks')}
        >
          ✓ To-Do Tasks
        </button>
        <button
          type="button"
          className={page === 'notes' ? 'nav-tab active' : 'nav-tab'}
          onClick={() => setPage('notes')}
        >
          ▤ Notes
        </button>
      </nav>

      {page === 'tasks' ? (
        <>
          <section className="hero" id="home">
            <span className="eyebrow">PLAN YOUR DAY BETTER</span>
            <h1>Make today <span>count.</span></h1>
            <p>Organize your tasks, focus on what matters, and celebrate your progress.</p>
          </section>

          <section className="stats-grid" aria-label="Task summary">
            <article className="stat-card">
              <span className="stat-label">TOTAL TASKS</span>
              <strong>{tasks.length}</strong>
              <span className="stat-caption">All your tasks</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">TO DO</span>
              <strong>{activeCount}</strong>
              <span className="stat-caption">Ready to tackle</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">COMPLETED</span>
              <strong>{completedCount}</strong>
              <span className="stat-caption">Tasks finished</span>
            </article>
          </section>

          <section className="task-layout">
            <aside className="form-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">GET THINGS DONE</span>
                  <h2>{editId !== null ? 'Edit task' : 'Create a task'}</h2>
                </div>
                <span className="heading-icon">＋</span>
              </div>

              <form onSubmit={handleTaskSubmit}>
                <label htmlFor="task-title">Task title *</label>
                <input id="task-title" value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What needs to be done?" maxLength={100} required />

                <label htmlFor="task-description">Description</label>
                <textarea id="task-description" value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add a few details (optional)" rows="3" maxLength={500} />

                <label htmlFor="task-priority">Priority</label>
                <select id="task-priority" value={priority}
                  onChange={e => setPriority(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <button className="primary-button" type="submit">
                  {editId !== null ? 'Save changes' : '+ Add task'}
                </button>
                {editId !== null && (
                  <button className="secondary-button" type="button" onClick={resetTaskForm}>
                    Cancel editing
                  </button>
                )}
              </form>
            </aside>

            <section className="tasks-panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">YOUR WORKSPACE</span>
                  <h2>My tasks <span className="count-badge">{visibleTasks.length}</span></h2>
                </div>
              </div>

              <input className="search-input" type="search" placeholder="Search tasks..."
                aria-label="Search tasks" value={search}
                onChange={e => setSearch(e.target.value)} />

              <div className="filter-tabs" aria-label="Filter tasks">
                {['All', 'Active', 'Completed'].map(option => (
                  <button type="button" key={option}
                    className={filter === option ? 'filter-tab selected' : 'filter-tab'}
                    onClick={() => setFilter(option)}>{option}</button>
                ))}
              </div>

              {visibleTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">☑</div>
                  <h3>{search ? 'No matching tasks' : 'Nothing on your list yet'}</h3>
                  <p>{search ? 'Try another search term.' : 'Add your first task and take the first step.'}</p>
                </div>
              ) : (
                <div className="task-list">
                  {visibleTasks.map(task => (
                    <article className={task.completed ? 'task-item is-complete' : 'task-item'} key={task.id}>
                      <button className={task.completed ? 'check-button checked' : 'check-button'}
                        type="button" onClick={() => toggleTask(task.id)}
                        aria-label={task.completed ? 'Mark task active' : 'Mark task complete'}>
                        {task.completed ? '✓' : ''}
                      </button>
                      <div className="task-content">
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                        <div className="task-meta">
                          <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                          <span>Created {task.createdAt || 'Earlier'}</span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <button type="button" onClick={() => editTask(task)} aria-label="Edit task">✎</button>
                        <button type="button" onClick={() => deleteTask(task.id)} aria-label="Delete task">×</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {tasks.length > 0 && (
                <div className="list-footer">
                  <span>{completedCount} of {tasks.length} completed</span>
                  <button type="button" className="text-button"
                    disabled={completedCount === 0}
                    onClick={() => {
                      if (window.confirm('Delete all completed tasks?')) {
                        setTasks(current => current.filter(task => !task.completed))
                      }
                    }}>Clear completed</button>
                </div>
              )}
            </section>
          </section>
        </>
      ) : (
        <>
          <section className="hero">
            <span className="eyebrow">CAPTURE YOUR THOUGHTS</span>
            <h1>Your ideas, <span>organized.</span></h1>
            <p>Keep important thoughts, study notes, plans, and ideas all in one place.</p>
          </section>

          <section className="notes-summary">
            <article className="stat-card">
              <span className="stat-label">TOTAL NOTES</span>
              <strong>{notes.length}</strong>
              <span className="stat-caption">Ideas saved</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">CATEGORIES</span>
              <strong>{new Set(notes.map(note => note.category)).size}</strong>
              <span className="stat-caption">Topics organized</span>
            </article>
          </section>

          <section className="task-layout notes-layout">
            <aside className="form-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">WRITE IT DOWN</span>
                  <h2>{editNoteId !== null ? 'Edit note' : 'Create a note'}</h2>
                </div>
                <span className="heading-icon">＋</span>
              </div>

              <form onSubmit={handleNoteSubmit}>
                <label htmlFor="note-title">Note title *</label>
                <input id="note-title" value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Give your note a title" maxLength={120} required />

                <label htmlFor="note-content">Content *</label>
                <textarea id="note-content" value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Write down your thoughts..." rows="7" maxLength={10000} required />

                <label htmlFor="note-category">Category</label>
                <select id="note-category" value={category}
                  onChange={e => setCategory(e.target.value)}>
                  {categories.filter(item => item !== 'All').map(item => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <button className="primary-button" type="submit">
                  {editNoteId !== null ? 'Save changes' : '+ Save note'}
                </button>
                {editNoteId !== null && (
                  <button className="secondary-button" type="button" onClick={resetNoteForm}>
                    Cancel editing
                  </button>
                )}
              </form>
            </aside>

            <section className="tasks-panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">YOUR COLLECTION</span>
                  <h2>My notes <span className="count-badge">{visibleNotes.length}</span></h2>
                </div>
              </div>

              <input className="search-input" type="search" placeholder="Search notes..."
                aria-label="Search notes" value={noteSearch}
                onChange={e => setNoteSearch(e.target.value)} />

              <div className="filter-tabs note-filters" aria-label="Filter notes by category">
                {categories.map(item => (
                  <button type="button" key={item}
                    className={noteFilter === item ? 'filter-tab selected' : 'filter-tab'}
                    onClick={() => setNoteFilter(item)}>{item}</button>
                ))}
              </div>

              {visibleNotes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">▤</div>
                  <h3>{noteSearch ? 'No matching notes' : 'Your notebook is empty'}</h3>
                  <p>{noteSearch ? 'Try a different search.' : 'Create your first note to capture an idea.'}</p>
                </div>
              ) : (
                <div className="notes-grid">
                  {visibleNotes.map(note => (
                    <article className="note-card" key={note.id}>
                      <div className="note-card-top">
                        <span className={`note-category category-${note.category.toLowerCase()}`}>
                          {note.category}
                        </span>
                        <div className="task-actions">
                          <button type="button" onClick={() => editNote(note)} aria-label="Edit note">✎</button>
                          <button type="button" onClick={() => deleteNote(note.id)} aria-label="Delete note">×</button>
                        </div>
                      </div>
                      <h3>{note.title}</h3>
                      <p className="note-preview">{note.content}</p>
                      <div className="note-dates">
                        <span>Created: {formatDate(note.createdAt)}</span>
                        <span>Updated: {formatDate(note.updatedAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </>
      )}

      <footer className="app-footer">
        <p>Small steps every day lead to big results.</p>
        <span>TaskFlow · Built with React</span>
      </footer>
    </main>
  )
}

export default App
