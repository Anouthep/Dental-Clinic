import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Dentalcare from '../images/dental1.jpg';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const serviceSnap = await getDocs(collection(db, 'Service'));
      const data = serviceSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(data.slice(0, 3)); // แสดงแค่ 3 รายการ
    };
    fetchServices();
  }, []);
  return (
    <div className="container py-5">
      {/* HERO SECTION */}
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="fw-bold mb-3">ຍິນດີຕ້ອນຮັບ <span style={{ color: '#5ca39c' }}>Family Dental Clinic</span></h1>
          <p className="text-secondary mb-4">
            ພວກເຮົາໃຫ້ບໍລິການທັນຕະກໍາທີ່ມີຄຸນນະພາບສູງດ້ວຍການດູແລແລະເປັນມືອາຊີບ. ຈອງການນັດພົບຂອງທ່ານກັບຫມໍປົວແຂ້ວທີ່ເຊື່ອຖືໄດ້ຂອງພວກເຮົາໃນມື້ນີ້.
          </p>

          <Link to="/service">
            <Button variant="outline-secondary">Our Services</Button>
          </Link>
        </div>
        <div className="col-md-6 text-center">
          <img
            src={Dentalcare}
            alt="Dentalcare"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* FEATURES */}
      <div className="mt-5">
        <h2 className="text-center fw-bold mb-4">ເປັນຫຍັງຕ້ອງເລືອກພວກເຮົາ?</h2>
        <div className="row text-center">
          <div className="col-md-4">
            <i className="bi bi-shield-check fs-1 text-success mb-2"></i>
            <h5>ຜູ້ຊ່ຽວຊານທີ່ເຊື່ອຖືໄດ້</h5>
            <p className="text-muted">ຫມໍປົວແຂ້ວທີ່ມີປະສົບການ ແລະໄດ້ຮັບການຮັບຮອງຜູ້ທີ່ເບິ່ງແຍງຮອຍຍິ້ມຂອງເຈົ້າ.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-clock-history fs-1 text-success mb-2"></i>
            <h5>ກຳນົດການຍືດຫຍຸ່ນ</h5>
            <p className="text-muted">ຈອງການນັດຫມາຍອອນໄລນ໌ເພື່ອໃຫ້ກົງກັບເວລາແລະຄວາມຕ້ອງການຂອງທ່ານ.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-emoji-smile fs-1 text-success mb-2"></i>
            <h5>ຄວາມພໍໃຈຂອງຄົນເຈັບ</h5>
            <p className="text-muted">ພວກເຮົາເນັ້ນໃສ່ຄວາມສະບາຍ, ຄວາມປອດໄພ, ແລະຮອຍຍິ້ມທີ່ມີຄວາມສຸກ.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5">
        <h2 className="text-center fw-bold mb-4">ບໍລິການຕ່າງໆ</h2>
        <div className="row">
          {services.map((service) => (
            <div className="col-md-4 mb-4" key={service.id}>
              <div className="card h-100 shadow-sm">
                {service.image && (
                  <img
                    src={service.image}
                    className="card-img-top"
                    alt={service.service_name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{service.service_name}</h5>
                    <p className="card-text text-muted">ລາຄາ: {Number(service.price).toLocaleString()} ກີບ</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/appointment?serviceId=${service.id}`)}
                    className="mt-2"
                  >
                    ຈອງບໍລິການ
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
