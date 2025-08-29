import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import {
    collection,
    getDocs,
    setDoc,
    deleteDoc,
    doc,
    updateDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // ✅ Auth
import { db, auth } from '../firebaseconfig'; // ✅ Firestore + Auth

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ name: '', Email: '', Tel: '', password: '' });
    const [editId, setEditId] = useState(null);

    const fetchEmployees = async () => {
        const empSnap = await getDocs(collection(db, 'Employee'));
        const data = empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        setForm({ name: '', Email: '', Tel: '', password: '' });
        setEditId(null);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id) => {
        if (window.confirm('ທ່ານຕ້ອງການລົບແທ້ຫວາ?')) {
            await deleteDoc(doc(db, 'Employee', id));
            fetchEmployees();
        }
    };

    const handleEdit = (employee) => {
        setEditId(employee.id);
        setForm({
            name: employee.name || '',
            Email: employee.Email || '',
            Tel: employee.Tel || '',
            password: '', // ซ่อน password เก่าเพื่อความปลอดภัย
        });
        handleShow();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.password || !form.Email) {
            alert('กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        try {
            if (editId) {
                // update เดิม (ปรับถ้าจำเป็น)
                const docRef = doc(db, 'Employee', editId);
                const updateData = {
                    name: form.name,
                    Email: form.Email,
                    Tel: form.Tel,
                };
                if (form.password.trim() !== '') {
                    updateData.password = form.password;
                }
                await updateDoc(docRef, updateData);
            } else {
                // สร้างผู้ใช้ใน Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, form.Email, form.password);
                const user = userCredential.user;

                await setDoc(doc(db, 'Employee', user.uid), {
                    name: form.name,
                    Email: form.Email,
                    Tel: form.Tel,
                    role: 'admin',
                });
            }

            fetchEmployees();
            handleClose();
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="d-flex justify-content-between align-items-center">
                ລາຍຊື່ພະນັກງານ
                <Button onClick={handleShow}>+ ເພິ່ມພະນັກງານ</Button>
            </h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ຊື່</th>
                        <th>Email</th>
                        <th>ເບີໂທ</th>

                        <th>ຈັດການ</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((e) => (
                        <tr key={e.id}>
                            <td>{e.name}</td>
                            <td>{e.Email}</td>
                            <td>{e.Tel}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(e)}>
                                    ແກ້ໄຂ
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(e.id)}>
                                    ລົບ
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'ແກ້ໄຂພະນັກງານ' : 'ເພິ່ມພະນັກງານ'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>ຊື່</Form.Label>
                            <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="Email" value={form.Email} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ເບີໂທ</Form.Label>
                            <Form.Control type="text" name="Tel" value={form.Tel} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ລະຫັດຜ່ານ</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder={editId ? 'ປ່ຽນລະຫັດ (ຖ້າຈະ)' : ''}
                                required={!editId}
                            />
                        </Form.Group>
                        <Button type="submit" variant="success">
                            ບັນທຶກ
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default EmployeeList;
