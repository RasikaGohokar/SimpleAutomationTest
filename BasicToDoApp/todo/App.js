import React, { useState, useEffect } from 'react';

// --- Helper Functions & Initial State ---

// A mock API endpoint for demonstration. In a real app, this would be in a .env file.
const API_URL = 'http://localhost:8000';

// A simple function to simulate an API call.
const apiRequest = async (path, method = 'GET', body = null, token = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(`${API_URL}${path}`, options);
        // We need to get the response body for both ok and not-ok responses
        const data = await response.json();
        if (!response.ok) {
            // Use the error message from the API if available
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error(`API request failed: ${error}`);
        return { error: error.message };
    }
};

// --- Components ---

// Login/Signup Form Component
const AuthForm = ({ setToken, setNotification }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/signup';
        const result = await apiRequest(endpoint, 'POST', { username, password });

        if (result.token) {
            setToken(result.token);
            localStorage.setItem('token', result.token);
            setNotification({ message: isLogin ? 'Login successful!' : 'Signup successful!', type: 'success' });
        } else {
            setNotification({ message: result.error || 'An error occurred. Please try again.', type: 'error' });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="user"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                             placeholder="password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isLogin ? 'Sign in' : 'Create Account'}
                    </button>
                </form>
                <div className="text-sm text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500">
                        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// To-Do List Component
const TodoList = ({ token, setToken, setNotification }) => {
    const [items, setItems] = useState([]);
    const [newItemText, setNewItemText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');

    // Fetch items when the component mounts
    useEffect(() => {
        const fetchItems = async () => {
            const result = await apiRequest('/items', 'GET', null, token);
            if (result && !result.error) {
                setItems(result);
            } else {
                 setNotification({ message: 'Failed to fetch items.', type: 'error' });
            }
        };
        fetchItems();
    }, [token, setNotification]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newItemText.trim()) return;
        const result = await apiRequest('/items', 'POST', { text: newItemText }, token);
        if (result && !result.error) {
            setItems([...items, result]);
            setNewItemText('');
            setNotification({ message: 'Item created!', type: 'success' });
        } else {
            setNotification({ message: 'Failed to create item.', type: 'error' });
        }
    };

    const handleUpdate = async (id) => {
        const result = await apiRequest(`/items/${id}`, 'PUT', { text: editingText }, token);
        if (result && !result.error) {
            setItems(items.map(item => (item.id === id ? result : item)));
            setEditingId(null);
            setEditingText('');
            setNotification({ message: 'Item updated!', type: 'success' });
        } else {
             setNotification({ message: 'Failed to update item.', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        const result = await apiRequest(`/items/${id}`, 'DELETE', null, token);
        if (result && !result.error) {
            setItems(items.filter(item => item.id !== id));
            setNotification({ message: 'Item deleted!', type: 'success' });
        } else {
            setNotification({ message: 'Failed to delete item.', type: 'error' });
        }
    };
    
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setNotification({ message: 'You have been logged out.', type: 'success' });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-4xl px-4 mx-auto">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-bold text-gray-900">To-Do List</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <main className="max-w-4xl p-8 mx-auto">
                <form onSubmit={handleCreate} className="flex gap-4 mb-8">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Add a new to-do"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button type="submit" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Add
                    </button>
                </form>
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            {editingId === item.id ? (
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="flex-grow px-2 py-1 mr-4 border rounded"
                                />
                            ) : (
                                <span className="flex-grow">{item.text}</span>
                            )}
                            <div className="flex gap-2">
                                {editingId === item.id ? (
                                    <button onClick={() => handleUpdate(item.id)} className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600">Save</button>
                                ) : (
                                    <button onClick={() => { setEditingId(item.id); setEditingText(item.text); }} className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600">Edit</button>
                                )}
                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

// Notification Component
const Notification = ({ notification, setNotification }) => {
    if (!notification) return null;

    useEffect(() => {
        const timer = setTimeout(() => {
            setNotification(null);
        }, 8000);
        return () => clearTimeout(timer);
    }, [notification, setNotification]);

    const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50";
    const typeClasses = notification.type === 'success' ? "bg-green-500" : "bg-red-500";

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {notification.message}
        </div>
    );
};


// Main App Component
export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [notification, setNotification] = useState(null);

    return (
        <div>
            <Notification notification={notification} setNotification={setNotification} />
            {!token ? (
                <AuthForm setToken={setToken} setNotification={setNotification} />
            ) : (
                <TodoList token={token} setToken={setToken} setNotification={setNotification} />
            )}
        </div>
    );
}
