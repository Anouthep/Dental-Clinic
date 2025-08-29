import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useNavigate } from 'react-router-dom';

function Service() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

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

  const handleBook = (serviceId) => {
    navigate(`/appointment?serviceId=${serviceId}`);
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold">ບໍລິການຂອງພວກເຮົາ</h1>
      <Row>
        {services.length === 0 ? (
          <p className="text-center">ບໍ່ມີບໍລິການ</p>
        ) : (
          services.map(service => (
            <Col key={service.id} md={4} className="mb-4">
              <Card className="shadow-sm h-100">
                {service.image && (
                  <Card.Img
                    variant="top"
                    src={service.image}
                    alt={service.service_name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{service.service_name}</Card.Title>
                    <Card.Text>
                      ລາຄາ: <strong>{Number(service.price).toLocaleString()} ກີບ</strong>
                    </Card.Text>
                  </div>
                  <Button variant="primary" className="mt-3" onClick={() => handleBook(service.id)}>
                    ນັດໝາຍບໍລິການ
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Service;
