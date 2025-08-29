// src/pages/Contact.js
import React from 'react';
import { Form, Button } from 'react-bootstrap';

function Contact() {
  return (
    <div className="container py-5">
      {/* TITLE */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">ຕິດຕໍ່<span style={{ color: '#5ca39c' }}>ພວກເຮົາ</span></h1>
        <p className="text-secondary">ພວກເຮົາຢາກໄດ້ຍິນຈາກທ່ານ. ກະລຸນາຕິດຕໍ່ກັບຄໍາຖາມຫຼືການນັດຫມາຍ.</p>
      </div>

      <div className="row">
        {/* CONTACT INFO */}
        <div className="col-md-6 mb-4">
          <h4 className="fw-bold mb-3">ຄລີນິກຂອງພວກເຮົາ</h4>
          <p><i className="bi bi-geo-alt-fill me-2 text-success"></i>123 Dental Street, Smile City, 12345</p>
          <p><i className="bi bi-telephone-fill me-2 text-success"></i>+123-456-7890</p>
          <p><i className="bi bi-envelope-fill me-2 text-success"></i>contact@dentalclinic.com</p>
          <p><i className="bi bi-clock-fill me-2 text-success"></i>Open: Mon - Fri, 8:00 AM - 5:00 PM</p>
          <div className="mt-4">
            <iframe
              title="Clinic Location"
              src="https://maps.google.com/maps?q=bangkok%20dental%20clinic&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="col-md-6">
          <h4 className="fw-bold mb-3">ສົ່ງຂໍ້ຄວາມຫາພວກເຮົາ</h4>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>ຊື່ ແລະ ນາມສະກຸນ</Form.Label>
              <Form.Control type="text" placeholder="ໃສ່ຊື່ຂອງເຈົ້າ" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="ໃສ່ Email ຂອງເຈົ້າ" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label>ຂໍ້ຄວາມຂອງເຈົ້າ</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="ພິມຂໍ້ຄວາມຂອງເຈົ້າທີ່ນີ້..." required />
            </Form.Group>

            <Button variant="success" type="submit">ສົ່ງຂໍ້ຄວາມ</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
