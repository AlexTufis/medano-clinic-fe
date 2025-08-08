import React, { FC, useState, FormEvent } from 'react';
import { register } from '../api/auth';
import { RegisterDto } from '../types/dto';

interface Props {
  onSuccess?: () => void;
}

const ClientCreateForm: FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<RegisterDto>({
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    displayName: '',
    dateOfBirth: '',
    gender: undefined,
  });
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle gender as number
    if (name === 'gender') {
      const genderValue = value === '' ? undefined : parseInt(value, 10);
      setForm(prev => ({ ...prev, [name]: genderValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);

    console.log('Form data being sent:', form); // Debug log

    try {
      const { message } = await register(form);
      setMessage(message);
      setForm({ 
        userName: '',
        email: '', 
        password: '', 
        firstName: '', 
        lastName: '', 
        displayName: '', 
        dateOfBirth: '', 
        gender: undefined 
      });
      
      // Call onSuccess callback if provided (for registration flow)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000); // Show success message for 2 seconds before redirecting
      }
    } catch (err: any) {
      console.error('Registration error:', err.response?.data); // Debug log
      
      const errorData = err.response?.data;
      const errorMessages: string[] = [];
      
      if (errorData) {
        // Handle validation errors object
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach(key => {
            const fieldErrors = errorData.errors[key];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach(error => errorMessages.push(`${key}: ${error}`));
            } else {
              errorMessages.push(`${key}: ${fieldErrors}`);
            }
          });
        }
        // Handle direct error array
        else if (Array.isArray(errorData)) {
          errorMessages.push(...errorData);
        }
        // Handle string error
        else if (typeof errorData === 'string') {
          errorMessages.push(errorData);
        }
        // Handle title/message property
        else if (errorData.title || errorData.message) {
          errorMessages.push(errorData.title || errorData.message);
        }
      }
      
      setErrors(errorMessages.length > 0 ? errorMessages : ['Registration failed. Please try again.']);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{onSuccess ? 'Create Your Account' : 'Add New User'}</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
      
      <div>
        <label htmlFor="userName">Username</label>
        <input
          id="userName"
          name="userName"
          type="text"
          value={form.userName}
          onChange={handleChange}
          required
          placeholder="Choose a unique username"
        />
      </div>
      
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={form.firstName}
          onChange={handleChange}
          required
          placeholder="Enter your first name"
        />
      </div>
      
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={handleChange}
          required
          placeholder="Enter your last name"
        />
      </div>
      
      <div>
        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          value={form.displayName}
          onChange={handleChange}
          required
          placeholder="How would you like to be called?"
        />
      </div>
      
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          placeholder="Create a password (min 6 characters)"
        />
      </div>
      
      <div>
        <label htmlFor="dateOfBirth">Date of Birth (Optional)</label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="gender">Gender (Optional)</label>
        <select
          id="gender"
          name="gender"
          value={form.gender !== undefined ? form.gender.toString() : ''}
          onChange={handleChange}
        >
          <option value="">Select gender</option>
          <option value="0">Male</option>
          <option value="1">Female</option>
          <option value="2">Other</option>
        </select>
      </div>
      
      <button type="submit">
        {onSuccess ? 'Create Account' : 'Add User'}
      </button>
    </form>
  );
};

export default ClientCreateForm;