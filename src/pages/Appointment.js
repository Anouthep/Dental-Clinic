import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { db } from '../firebaseconfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
  collectionGroup
} from 'firebase/firestore';
import { useUserAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

function Appointment() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [reason, setReason] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get('serviceId');

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // ดึงเวลาที่ถูกจองแล้วจากทุก user ในวันที่เลือก
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedTimesAllUsers = async () => {
      try {
        // ดึง appointment ทั้งหมดจากทุก user (collectionGroup)
        const apptSnap = await getDocs(collectionGroup(db, 'Appointment'));
        // กรองเฉพาะวันที่ตรงกับ selectedDate.toDateString()
        const booked = apptSnap.docs
          .map(doc => doc.data())
          .filter(appt => appt.appt_date === selectedDate.toDateString())
          .map(appt => appt.appt_time);

        setBookedTimes(booked);
      } catch (error) {
        console.error('Error fetching booked times:', error);
      }
    };

    fetchBookedTimesAllUsers();
  }, [selectedDate]);

  // ดึงชื่อบริการจาก serviceId
  useEffect(() => {
    if (!serviceId) return;

    const fetchServiceName = async () => {
      const serviceRef = doc(db, 'Service', serviceId);
      const serviceSnap = await getDoc(serviceRef);
      if (serviceSnap.exists()) {
        setServiceName(serviceSnap.data().service_name);
      }
    };

    fetchServiceName();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('ກະລຸນາລ໋ອກອິນກ່ອນ');
      return;
    }

    if (!serviceId) {
      alert('ບໍ່ພົບບໍລິການທີ່ເລືອກ');
      return;
    }
    if (!time) {
      alert('ກະລຸນາເລືອກເວລາ');
      return;
    }

    if (bookedTimes.includes(time)) {
      alert('ເວລານີ້ຖືກຈອງແລ້ວ ກະລຸນາເລືອກເວລາອື່ນ');
      return;
    }

    try {
      await addDoc(collection(db, 'User', user.uid, 'Appointment'), {
        appt_date: selectedDate.toDateString(),
        appt_time: time,
        reason,
        fullName,
        Service_id: [serviceId],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      // แสดง Popup
      setShowModal(true);

      // เคลียร์ฟอร์ม
      setTime('');
      setFullName('');
      setReason('');
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/service');
  };

  return (
    <Container className="py-5">
      <h1 className="text-center fw-bold mb-4">ຈອງນັດໝາຍ</h1>

      {serviceName && (
        <h4 className="text-center text-primary mb-3">📌 ທ່ານກຳລັງນັດໝາຍບໍລິການ: {serviceName}</h4>
      )}

      <Row>
        <Col md={6} className="mb-4">
          <h5 className="mb-2">📅 ເລືອກມື້:</h5>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
          />
        </Col>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ຊື່-ນາມສະກຸນ</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ເວລາ</Form.Label>
              <Form.Select value={time} onChange={(e) => setTime(e.target.value)} required>
                <option value="">ເລືອກເວລາ</option>
                {timeSlots.map((t, idx) => (
                  <option key={idx} value={t} disabled={bookedTimes.includes(t)}>
                    {t} {bookedTimes.includes(t) ? '(ຈອງແລ້ວ)' : ''}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ສາເຫດ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">ຈອງນັດໝາຍ</Button>
          </Form>
        </Col>
      </Row>

      {/* Popup Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>ສຳເລັດ!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ທ່ານໄດ້ຈອງນັດສຳເລັດແລ້ວ.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            ກັບໄປບໍລິການ
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Appointment;
