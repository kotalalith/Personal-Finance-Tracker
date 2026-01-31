import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Snackbar, // ✅ added
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ New: Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // ✅ Show success popup
      setOpenSnackbar(true);

      // Navigate after a short delay
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (passwordError) setPasswordError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    dispatch(registerUser({
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password
    }));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 5,
            borderRadius: 3,
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography component="h1" variant="h4" fontWeight="bold">
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Sign up to get started with FinTrack
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#d32f2f'
              }}
            >
              {error}
            </Alert>
          )}

          {passwordError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#d32f2f'
              }}
            >
              {passwordError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Name */}
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.8)' }
              }}
            />

            {/* Email */}
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.8)' }
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.8)' }
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              margin="normal"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.8)' }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.3,
                backgroundColor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#667eea' }} /> : 'Sign Up'}
            </Button>

            <Typography textAlign="center" sx={{ mt: 3, color: 'rgba(255,255,255,0.9)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* ✅ Snackbar for success message */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Signup Successful! 🎉 Redirecting...
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default SignUp;
