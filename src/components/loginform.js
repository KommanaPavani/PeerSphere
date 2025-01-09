import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SignupForm from './signup';
import './FormStyles.css';

const LoginForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setFormData({ email: '', password: '' });
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        } else {
          setError('Unexpected server response');
          return;
        }
        navigate('/dashboard'); // Navigate to the Dashboard route
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  if (showSignup) {
    return <SignupForm toggleToLogin={() => setShowSignup(false)} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
      <button type="submit">Login</button>
      <p>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => setShowSignup(true)}
          style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          Sign up here
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
