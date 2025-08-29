import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [customerCount, setCustomerCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 🔹 1. ดึงจำนวนลูกค้า
      const usersSnap = await getDocs(collection(db, 'User'));
      setCustomerCount(usersSnap.size);

      // 🔹 2. ดึงจำนวนบริการทั้งหมด
      const serviceSnap = await getDocs(collection(db, 'Service'));
      setServiceCount(serviceSnap.size);

    };

    fetchDashboardData();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Dental Clinic Admin Dashboard</h2>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>ຈຳນວນລູກຄ້າ</Card.Title>
              <Card.Text>{customerCount} ຄົນ</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>ຈຳນວນບໍລິການທັງໝົດ</Card.Title>
              <Card.Text>{serviceCount} ລາຍການ</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" className="me-2" onClick={() => navigate('/admin/appointments')}>
            ຈັດການນັດໝາຍ
          </Button>
          <Button variant="success" className="me-2" onClick={() => navigate('/admin/service')}>
            ຈຳນວນບໍລິການ
          </Button> 
          <Button variant="warning" onClick={() => navigate('/admin/employees')}>
            ຈຳນວນພະນັກງານ
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
