import React, { useEffect, useState } from 'react';
import {
  collectionGroup, getDocs, deleteDoc, updateDoc,
  doc, query, where, getDoc
} from 'firebase/firestore';
import { db } from '../firebaseconfig';
import {
  Table, Container, Spinner, Button,
  Modal, Form, Row, Col
} from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function AdminAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState([]);

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    if (!(date instanceof Date)) return date;
    return date.toDateString();
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const q = collectionGroup(db, 'Appointment');
      const snapshot = await getDocs(q);

      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const apptData = docSnap.data();
          let serviceName = 'ไม่ระบุ';

          if (Array.isArray(apptData.Service_id) && apptData.Service_id.length > 0) {
            const serviceId = apptData.Service_id[0];
            try {
              const serviceDoc = await getDoc(doc(db, 'Service', serviceId));
              if (serviceDoc.exists()) {
                serviceName = serviceDoc.data().service_name || 'ไม่ทราบชื่อบริการ';
              }
            } catch (e) {
              console.warn('⚠️ ดึงชื่อ service ไม่ได้:', e);
            }
          }

          return {
            id: docSnap.id,
            path: docSnap.ref.path,
            ...apptData,
            serviceName,
            status: apptData.status || 'pending', // ✅ ถ้าไม่มีให้ default เป็น pending
          };
        })
      );

      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (path) => {
    if (window.confirm('❗ ທ່ານແນ່ໃຈວ່າຈະລຶບນັດນີ້ບໍ?')) {
      try {
        await deleteDoc(doc(db, path));
        fetchAppointments();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  const handleEdit = (appt) => {
    setEditData(appt);
    setSelectedDate(new Date(appt.appt_date));
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData.appt_time) {
      alert('กรุณาเลือกเวลา');
      return;
    }
    if (bookedTimes.includes(editData.appt_time)) {
      alert('❌ ເວລານີ້ຖືກຈອງໄປແລ້ວ! ກະລຸນາເລືອກເວລາອື່ນ.');
      return;
    }
    try {
      await updateDoc(doc(db, editData.path), {
        appt_date: formatDate(selectedDate),
        appt_time: editData.appt_time,
        reason: editData.reason,
        fullName: editData.fullName,
        status: editData.status, // ✅ update status ด้วย
      });
      setShowEditModal(false);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4 fw-bold text-center">📋 ລາຍການນັດໝາຍທັງໝົດ</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ຊື່</th>
              <th>ວັນທີ່</th>
              <th>ເວລາ</th>
              <th>ບໍລິການ</th>
              <th>ສາເຫດ</th>
              <th>ສະຖານະ</th> {/* ✅ เพิ่มคอลัมน์ */}
              <th>ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, idx) => (
              <tr key={idx}>
                <td>{appt.fullName}</td>
                <td>{appt.appt_date}</td>
                <td>{appt.appt_time}</td>
                <td>{appt.serviceName}</td>
                <td>{appt.reason}</td>
                <td>
                  {/* ✅ แสดงสถานะพร้อมสี */}
                  <span
                    className={`badge ${
                      appt.status === 'pending'
                        ? 'bg-warning text-dark'
                        : appt.status === 'confirmed'
                        ? 'bg-primary'
                        : appt.status === 'completed'
                        ? 'bg-success'
                        : 'bg-danger'
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(appt)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(appt.path)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* MODAL แก้ไข */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>ແກ້ໄຂນັດ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editData && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>📅 ເລືອກວັນທີ່</Form.Label>
                  <Calendar
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setEditData((prev) => ({ ...prev, appt_date: formatDate(date) }));
                    }}
                    minDate={new Date()}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ຊື່</Form.Label>
                  <Form.Control
                    value={editData.fullName || ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, fullName: e.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>ເວລາ</Form.Label>
                  <select
                    className="form-select"
                    value={editData.appt_time || ''}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, appt_time: e.target.value }))
                    }
                  >
                    <option value="">ເລືອກເວລາ</option>
                    {timeSlots.map((t, i) => {
                      const isBooked = bookedTimes.includes(t) && t !== editData.appt_time;
                      return (
                        <option key={i} value={t} disabled={isBooked}>
                          {t} {isBooked ? '(ຈອງແລ້ວ)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>ສາເຫດ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editData.reason || ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, reason: e.target.value }))}
                  />
                </Form.Group>

                {/* ✅ ฟอร์มเลือกสถานะ */}
                <Form.Group className="mb-3">
                  <Form.Label>ສະຖານະ</Form.Label>
                  <Form.Select
                    value={editData.status || 'pending'}
                    onChange={(e) => setEditData((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✅ Confirmed</option>
                    <option value="completed">🎉 Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            ຍົກເລີກ
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            ບັນທຶກ
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminAppointment;
