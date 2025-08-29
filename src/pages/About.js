// src/pages/About.js
import React from 'react';
import Dental from '../images/clinic.webp';

function About() {
  return (
    <div className="container py-5">
      {/* TITLE SECTION */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">ກ່ຽວກັບ <span style={{ color: '#5ca39c' }}>ຄລີນິກຂອງພວກເຮົາ</span></h1>
        <p className="text-secondary">ພວກເຮົາໃສ່ໃຈກັບຮອຍຍິ້ມແລະຄວາມສະດວກສະບາຍຂອງເຈົ້າ.</p>
      </div>

      {/* CLINIC STORY */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <img
            src={Dental}
            alt="Dentalcare"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        <div className="col-md-6">
          <h3 className="fw-bold mb-3">ຮອຍຍິ້ມຂອງເຈົ້າ, ພາລະກິດຂອງພວກເຮົາ</h3>
          <p className="text-muted">
            ຄລີນິກ Family Dental Clinic ໄດ້ໃຫ້ການດູແລແຂ້ວຜູ້ຊ່ຽວຊານຫຼາຍກວ່າ 10 ປີ. ພວກເຮົາເຊື່ອໃນການສ້າງປະສົບການທີ່ຜ່ອນຄາຍແລະສ້າງຄວາມສໍາພັນໃນໄລຍະຍາວກັບຄົນເຈັບຂອງພວກເຮົາ. ຄລີນິກຂອງພວກເຮົາມີຄວາມພ້ອມດ້ວຍເທັກໂນໂລຍີທີ່ທັນສະໄໝ ແລະ ມີທີມງານທີ່ເປັນມິດ, ຊໍານິຊໍານານ.
          </p>
          <p className="text-muted">
            ບໍ່ວ່າທ່ານຈະຢູ່ທີ່ນີ້ເພື່ອກວດສຸຂະພາບເປັນປະຈຳ ຫຼືຂັ້ນຕອນທີ່ຊັບຊ້ອນ, ສຸຂະພາບ ແລະຄວາມສຸກຂອງເຈົ້າແມ່ນສິ່ງສຳຄັນອັນດັບໜຶ່ງຂອງພວກເຮົາ.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
