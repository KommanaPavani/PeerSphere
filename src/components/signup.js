import React, { useState } from 'react';
import LoginForm from './loginform'; // Import LoginForm
import './FormStyles.css';

const SignupForm = () => {
  const [showLogin, setShowLogin] = useState(false); // State to toggle back to LoginForm
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ username: '', email: '', password: '' });
        setShowLogin(true)
      } else {
        setError('Error during signup');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  // If `showLogin` is true, render LoginForm instead of SignupForm
  if (showLogin) {
    return <LoginForm />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Signup</button>
      <p>
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setShowLogin(true)} // Set `showLogin` to true to render LoginForm
          style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          Log in here
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
