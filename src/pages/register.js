import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert, Button, Container, Row, Col } from 'react-bootstrap';
import { useUserAuth } from '../context/AuthContext';
import dentalImg from '../images/dental-hospitals.webp';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState("");

  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // ✅ สร้าง document ที่ Firestore: User/{UserID}
      await setDoc(doc(db, 'User', user.uid), {
        email,
        name,
        tel,
        role: "user"
      });

      navigate('/login');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* รูปภาพด้านซ้าย */}
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

      {/* ฟอร์มด้านขวา */}
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
              <h2 className="text-center mb-4 fw-bold">ສະມັກສະມາຊິກ</h2>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>ຊື່ຜູ້ໃຊ້</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ຊື່ຜູ້ໃຊ້ງານ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ເບີໂທລະສັບ</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="ໃສ່ເບີໂທລະສັບ"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ອີເມວ</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ໃສ່ອີເມວ"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ລະຫັດຜ່ານ</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="light" type="submit" className="w-100 fw-bold text-primary">
                  ສະມັກສະມາຊິກ
                </Button>
              </Form>

              <div className="text-center mt-3" style={{ fontSize: '14px' }}>
                ກັບຄືນ{' '}
                <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>
                  ເຂົ້າສູ່ລະບົບ
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Register;
