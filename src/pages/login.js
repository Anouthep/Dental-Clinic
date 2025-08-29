import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert, Button, Container, Row, Col } from 'react-bootstrap';
import { useUserAuth } from '../context/AuthContext';
import { db } from '../firebaseconfig'; // ✅ import Firestore
import { doc, getDoc } from 'firebase/firestore'; // ✅ สำหรับตรวจสอบ User
import dentalImg from '../images/dental-hospitals.webp';

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useUserAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await logIn(email, password);
      const user = userCredential.user;

      // ✅ ลองหาใน User ก่อน
      const userDocSnap = await getDoc(doc(db, 'User', user.uid));

      if (userDocSnap.exists()) {
        const { role } = userDocSnap.data();
        navigate(role === 'admin' ? '/admin' : '/');
        return; // จบเลย ไม่ไปเช็ค Employee
      }

      // ✅ ถ้าไม่เจอใน User ค่อยหาใน Employee
      const empDocSnap = await getDoc(doc(db, 'Employee', user.uid));

      if (empDocSnap.exists()) {
        const { role } = empDocSnap.data();
        navigate(role === 'admin' ? '/admin' : '/');
        return;
      }

      // ❌ ไม่เจอในทั้งสอง
      setError('This account is not registered as a user.');

    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* ฝั่งซ้าย: รูปภาพ */}
      <div style={{ flex: 1 }}>
        <img
          src={dentalImg}
          alt="Dentist"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* ฝั่งขวา: ฟอร์มล็อกอิน */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(to right, #00c6ff, #0072ff)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <h2 className="text-center mb-4 fw-bold">Welcome to<br />Family Clinic</h2>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>ອີເມວ</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ປ້ອນອີເມວ"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>ລະຫັດຜ່ານ</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="ປ້ອນລະຫັດຜ່ານ"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="light" type="submit" className="w-100 fw-bold text-primary">
                  ເຂົ້າສູ່ລະບົບ
                </Button>
              </Form>

              <div className="text-center mt-3" style={{ fontSize: '14px' }}>
                ມີບັນຊີຢູ່ແລ້ວບໍ?{' '}
                <Link to="/signup" style={{ color: '#fff', textDecoration: 'underline' }}>
                  ສະມັກສະມາຊິກ
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Login;
