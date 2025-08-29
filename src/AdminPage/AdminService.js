import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { doc, updateDoc, deleteDoc, collection, getDocs, addDoc, collectionGroup, query, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



function ServiceList() {
    const storage = getStorage();
    const [services, setServices] = useState([]);
    const [editId, setEditId] = useState(null);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ service_name: '', image: null, price: '' });
    const [appointments, setAppointments] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = '';

        // ถ้ามีไฟล์ใหม่หรือสร้างใหม่
        if (form.image instanceof File) {
            const imageRef = ref(storage, `service_images/${form.image.name}`);
            await uploadBytes(imageRef, form.image);
            imageUrl = await getDownloadURL(imageRef);
        } else if (editId) {
            imageUrl = form.image; // ใช้ของเดิม
        }

        const serviceData = {
            service_name: form.service_name,
            image: imageUrl,
            price: form.price,
        };

        if (editId) {
            const docRef = doc(db, 'Service', editId);
            await updateDoc(docRef, serviceData);
        } else {
            await addDoc(collection(db, 'Service'), serviceData);
        }

        setForm({ service_name: '', image: null, price: '' });
        setEditId(null);
        handleClose();
        fetchServices();
    };
    const handleDelete = async (id) => {
        if (!window.confirm('ເຈົ້າແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບບໍລິການນີ້?')) return;

        try {
            console.log("Service ที่พยายามลบ:", id);

            const q = query(
                collectionGroup(db, 'Appointment'),
                where('Service_id', 'array-contains', id)
            );

            const snap = await getDocs(q);
            console.log("เจอ appointment ที่ใช้ service นี้:", snap.size);

            snap.forEach(doc => {
                console.log("Appointment:", doc.data());
            });

            if (!snap.empty) {
                alert('❌ ບໍ່ສາມາດລຶບໄດ້ ເນື່ອງຈາກຍັງມີການນັດໝາຍທີ່ໃຊ້ບໍລິການນີ້');
                return;
            }

            await deleteDoc(doc(db, 'Service', id));
            fetchServices();
            alert('✅ ລຶບຂໍ້ມູນສຳເລັດແລ້ວ');
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('เกิดข้อผิดพลาดในการลบ');
        }
    };

    const handleEdit = (service) => {
        setForm({
            service_name: service.service_name,
            image: service.image,
            price: service.price,
        });
        setEditId(service.id);
        handleShow();
    };

    const fetchServices = async () => {
        const serviceSnap = await getDocs(collection(db, 'Service'));
        const serviceData = serviceSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setServices(serviceData);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <Container className="mt-4">
            <h2 className="d-flex justify-content-between align-items-center">
                ລາຍການບໍລິການ
                <Button onClick={handleShow}>+ ເພິ່ມບໍລິການ</Button>
            </h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ຮູບພາບ</th>
                        <th>ຊື່ບໍລິການ</th>
                        <th>ລາຄາ</th>
                        <th>ຈັດການ</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s, index) => (
                        <tr key={index}>
                            <td><img src={s.image} alt="service" width="80" /></td>
                            <td>{s.service_name}</td>
                            <td>{s.price}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEdit(s)} className="me-2">
                                    ແກ້ໄຂ
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>
                                    ລົບ
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ເພິ່ມບໍລິການ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>ຮູບພາບ</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ຊື່ບໍລິການ</Form.Label>
                            <Form.Control
                                type="text"
                                name="service_name"
                                value={form.service_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ລາຄາ</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="success">ບັນທຶກ</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ServiceList;
