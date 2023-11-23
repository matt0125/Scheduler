import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import { Container, Row, Col } from "react-bootstrap";
import vector from "../images/table-meeting.png";
import logo from "../images/branding-notitle.png";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');

    const handleVerificationCodeChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:3000/api/verify-email/${verificationCode}`);
            // Assuming the response contains user role information
            const userRole = response.data.userRole; // Adjust based on actual response structure
            localStorage.setItem('userRole', userRole); // Store the role in local storage
            setVerificationStatus('Verification successful. You can now login.');
            navigate('/role-based-redirect');
        } catch (error) {
            console.error('Error during email verification:', error);
            setVerificationStatus('Verification failed. Please check the code and try again.');
        }
    };

    

    return (
        <div id="register-body">
        <Container>
            <Row>
                <Col>
                    <img src={logo} alt="sched logo" className="logo"></img>
                </Col>
                <Col className="title">
                <   h1>Sched</h1>
                </Col>
            </Row>
            <Row className="row"> 
                <Col className="column">
                    <img src={vector} className="business-photo" alt="business vector"/>
                </Col>
                <Col className="main-column">            
                    <div style={{ textAlign: 'center', maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                        <h2 style={{ fontSize: '24px', color: '#333' }}>Verify Your Email</h2>
                        <p style={{ fontSize: '16px', color: '#666' }}>
                            We have sent a verification code to your email. Please enter the code below.
                        </p>
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={handleVerificationCodeChange}
                                placeholder="Enter verification code"
                                style={{ padding: '10px', fontSize: '16px', width: '80%', marginBottom: '10px' }}
                            />
                            <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#49423E', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Verify Email
                            </button>
                        </form>
                        {verificationStatus && <p style={{ marginTop: '20px', color: '#4CAF50' }}>{verificationStatus}</p>}
                    </div>
                </Col>
            </Row>
        </Container>
        </div>
    );
};

export default VerifyEmail;
