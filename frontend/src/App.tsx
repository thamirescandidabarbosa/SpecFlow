import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import FunctionalSpecForm from './pages/FunctionalSpecForm';
import FunctionalSpecificationList from './pages/FunctionalSpecificationList';
import FunctionalSpecificationEdit from './pages/FunctionalSpecificationEdit';
import FunctionalSpecificationView from './pages/FunctionalSpecificationView';
import UserSettings from './pages/UserSettings';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Navbar />
                        <main className="container" style={{ marginTop: '20px' }}>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/" element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/files" element={
                                    <ProtectedRoute>
                                        <Files />
                                    </ProtectedRoute>
                                } />
                                <Route path="/functional-specification" element={
                                    <ProtectedRoute>
                                        <FunctionalSpecForm />
                                    </ProtectedRoute>
                                } />
                                <Route path="/functional-specifications" element={
                                    <ProtectedRoute>
                                        <FunctionalSpecificationList />
                                    </ProtectedRoute>
                                } />
                                <Route path="/functional-specification/edit/:id" element={
                                    <ProtectedRoute>
                                        <FunctionalSpecificationEdit />
                                    </ProtectedRoute>
                                } />
                                <Route path="/functional-specification/:id" element={
                                    <ProtectedRoute>
                                        <FunctionalSpecificationView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/settings" element={
                                    <ProtectedRoute>
                                        <UserSettings />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
