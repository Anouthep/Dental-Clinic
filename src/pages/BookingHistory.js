import { useEffect, useState } from 'react';
import { db } from '../firebaseconfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collectionGroup,
  query,
  where
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Modal, Button, Form } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const History = () => {
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState([]);

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });


  const formatDate = (date) => {
    if (!(date instanceof Date)) return date;
    return date.toDateString();
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  const fetchAppointments = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const apptRef = collection(db, 'User', userId, 'Appointment');
      const apptSnap = await getDocs(apptRef);

      const data = await Promise.all(
        apptSnap.docs.map(async (apptDoc) => {
          const apptData = apptDoc.data();
          const serviceIds = Array.isArray(apptData.Service_id) ? apptData.Service_id : [];

          const serviceDetails = await Promise.all(
            serviceIds.map(async (serviceId) => {
              const serviceRef = doc(db, 'Service', serviceId);
              const serviceSnap = await getDoc(serviceRef);
              return serviceSnap.exists()
                ? { id: serviceSnap.id, ...serviceSnap.data() }
                : null;
            })
          );

          return {
            id: apptDoc.id,
            ...apptData,
            services: serviceDetails.filter(Boolean),
          };
        })
      );

      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  // โหลดเวลาที่ถูกจองโดยทุก user
  useEffect(() => {
    if (!editData || !selectedDate) return;

    const loadBookedTimes = async () => {
      try {
        const q = query(
          collectionGroup(db, 'Appointment'),
          where('appt_date', '==', formatDate(selectedDate))
        );
        const apptSnap = await getDocs(q);

        const sameDateTimes = apptSnap.docs
          .filter(d => d.id !== editData.id)
          .map(d => d.data().appt_time);

        setBookedTimes(sameDateTimes);
      } catch (err) {
        console.error('Error loading booked times:', err);
      }
    };

    loadBookedTimes();
  }, [selectedDate, editData]);

  const handleDelete = async (apptId) => {
    if (!window.confirm('ທ່ານຕ້ອງການລົບນັດໝາຍນີ້ ຫຼື ບໍ?')) return;

    try {
      await deleteDoc(doc(db, 'User', userId, 'Appointment', apptId));
      alert('ລົບນັດໝາຍສຳເລັດ');
      setAppointments((prev) => prev.filter((appt) => appt.id !== apptId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('ມີບັນຫາໃນການລົບນັດໝາຍ');
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
      alert('❌ ເວລານີ້ຖືກຈອງໄປແລ້ວ!');
      return;
    }

    try {
      await updateDoc(doc(db, 'User', userId, 'Appointment', editData.id), {
        appt_date: formatDate(selectedDate),
        appt_time: editData.appt_time,
        reason: editData.reason || '',
        fullName: editData.fullName || '',
      });

      setShowEditModal(false);
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert('ບໍ່ສາມາດບັນທຶກໄດ້');
    }
  };

  return (
    <div className="container py-4 bg-light" style={{ maxWidth: 800 }}>
      <h2 className="text-center mb-4 text-dark">📖 ປະຫວັດການນັດໝາຍ</h2>

      {loading ? (
        <p className="text-center text-muted">⏳ ກຳລັງໂຫຼດ...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-muted">ຍັງບໍ່ມີການນັດໝາຍ</p>
      ) : (
        appointments.map((appt) => (
          <div key={appt.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between flex-wrap mb-3">
                <p><strong>📅 ວັນທີ:</strong> {appt.appt_date}</p>
                <p><strong>🕑 ເວລາ:</strong> {appt.appt_time}</p>
              </div>
              <p>
                <strong>📌 ສະຖານະ:</strong>{' '}
                <span
                  className={`badge ${appt.status === 'approved'
                      ? 'bg-success'
                      : appt.status === 'pending'
                        ? 'bg-warning text-dark'
                        : appt.status === 'canceled'
                          ? 'bg-danger'
                          : 'bg-secondary'
                    }`}
                >
                  {appt.status || 'ລໍຖ້າຢືນຢັນ'}
                </span>
              </p>

              <h4 className="mb-3 text-secondary">🧾 ບໍລິການທີ່ນັດ:</h4>
              <div className="d-flex flex-column gap-3">
                {appt.services.length === 0 ? (
                  <p>ບໍ່ພົບບໍລິການ</p>
                ) : (
                  appt.services.map((service) => (
                    <div key={service.id} className="d-flex align-items-center gap-3 bg-light p-2 rounded">
                      <img
                        src={service.image}
                        alt={service.service_name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 10,
                          border: '1px solid #ddd',
                        }}
                      />
                      <div>
                        <p className="mb-1 fw-bold">{service.service_name}</p>
                        <p className="text-success fw-bold">
                          {parseInt(service.price).toLocaleString()} ກີບ
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-warning" onClick={() => handleEdit(appt)}>
                  📝 ແກ້ໄຂ
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(appt.id)}>
                  ຍົກເລີກນັດໝາຍ
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>ແກ້ໄຂນັດໝາຍ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editData && (
            <>
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
              <Form.Group className="mb-3">
                <Form.Label>🕑 ເວລາ</Form.Label>
                <Form.Select
                  value={editData.appt_time || ''}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, appt_time: e.target.value }))
                  }
                >
                  <option value="">-- ເລືອກເວລາ --</option>
                  {timeSlots.map((time, idx) => {
                    const isBooked = bookedTimes.includes(time) && time !== editData.appt_time;
                    return (
                      <option key={idx} value={time} disabled={isBooked}>
                        {time} {isBooked ? '(ຈອງແລ້ວ)' : ''}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>ສາເຫດ</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editData.reason || ''}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                />
              </Form.Group>
            </>
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
    </div>
  );
};

export default History;
