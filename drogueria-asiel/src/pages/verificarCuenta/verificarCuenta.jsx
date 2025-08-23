import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import './verificarCuenta.css';

const VerificarCuenta = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('Verificando tu cuenta...');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [cuentaVerificada, setCuentaVerificada] = useState(false);

    // ✅ Usa la variable de entorno
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const verificarCuenta = async () => {
            try {
                const token = searchParams.get('token');
                
                if (!token) {
                    setError('Token de verificación no válido');
                    setIsLoading(false);
                    return;
                }

                // ✅ Usa la variable de entorno
                const response = await fetch(`${API_BASE_URL}/usuarios/verificar/${token}`);
                const data = await response.json();

                console.log('🔍 Respuesta del backend:', data);

                if (data.success) {
                    setMensaje(data.message || '¡Cuenta verificada exitosamente!');
                    setCuentaVerificada(true);
                } else {
                    // ✅ Si el error es que el token ya fue usado, pero la verificación fue exitosa
                    if (data.message.includes('ya fue utilizado') || data.message.includes('ya estaba verificado')) {
                        setMensaje('¡Cuenta ya verificada anteriormente!');
                        setCuentaVerificada(true);
                    } else if (data.message === 'Token expirado') {
                        setError('El enlace de verificación ha expirado. Por favor solicita uno nuevo.');
                    } else {
                        setError(data.message || 'Error al verificar la cuenta');
                    }
                }
            } catch (error) {
                setError('Error de conexión con el servidor');
            } finally {
                setIsLoading(false);
            }
        };

        verificarCuenta();
    }, [searchParams, navigate, API_BASE_URL]); // ✅ Agrega API_BASE_URL a las dependencias

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="verification-container">
            <div className="verification-card">
                {error ? (
                    <>
                        <div className="error-icon">❌</div>
                        <h2>Error de verificación</h2>
                        <p className="error-message">{error}</p>
                        <button 
                            onClick={() => navigate('/usuario')}
                            className="btn-primary"
                        >
                            Volver al Login
                        </button>
                    </>
                ) : (
                    <>
                        <div className="success-icon">✅</div>
                        <h2>¡Verificación Exitosa!</h2>
                        <p className="success-message">{mensaje}</p>
                        
                        {cuentaVerificada ? (
                            <>
                                <p className="info-message">
                                    Ya puedes cerrar esta ventana y volver a la aplicación.
                                </p>
                                <p className="secondary-message">
                                    Tu cuenta ha sido verificada correctamente.
                                </p>
                                <button 
                                    onClick={() => navigate('/usuario')}
                                    className="btn-secondary"
                                >
                                    Ir al Login
                                </button>
                            </>
                        ) : (
                            <p>Procesando verificación...</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VerificarCuenta;