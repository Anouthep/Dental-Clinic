import React, { useEffect, useState } from 'react';
import { Container, Tab, Tabs, Table, Card, Button } from 'react-bootstrap';
import { collection, collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';

function Report() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      // ดึงลูกค้า
      const custSnap = await getDocs(collection(db, 'User'));
      const custList = custSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(custList);

      // ดึงพนักงาน
      const empSnap = await getDocs(collection(db, 'Employee'));
      setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // ดึงบริการ
      const serviceSnap = await getDocs(collection(db, 'Service'));
      setServices(serviceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // ดึง Appointment ทุก user ด้วย collectionGroup
      const apptSnap = await getDocs(collectionGroup(db, 'Appointment'));
      const appts = apptSnap.docs.map(doc => {
        const data = doc.data();
        // ดึง userId จาก path เช่น /User/{userId}/Appointment/{apptId}
        const pathParts = doc.ref.path.split('/');
        const userId = pathParts[1]; // index 1 คือ userId
        return { id: doc.id, userId, ...data };
      });
      setAppointments(appts);
    };

    fetchReports();
  }, []);

  const handlePrint = (divId) => {
    const printContents = document.getElementById(divId).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // รีโหลดเพื่อกลับมาเหมือนเดิม
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">ລາຍງານ</h2>
      <Tabs defaultActiveKey="appointments" id="report-tabs" className="mb-3">

        {/* แท็บนัดหมาย */}
        <Tab eventKey="appointments" title="ນັດໝາຍ">
          <Card>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>ລູກຄ້າ</th>
                    <th>ວັນທີ່</th>
                    <th>ເວລາ</th>
                    <th>ບໍລິການ</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">ບໍ່ມີຂໍ້ມູນ</td></tr>
                  ) : (
                    appointments.map(appt => {
                      const customer = customers.find(c => c.id === appt.userId);
                      let serviceName = '-';
                      if (Array.isArray(appt.Service_id) && appt.Service_id.length > 0) {
                        const service = services.find(s => s.id === appt.Service_id[0]);
                        serviceName = service?.service_name || 'ไม่ทราบชื่อบริการ';
                      }
                      return (
                        <tr key={appt.id}>
                          <td>{customer ? (customer.name || '-') : '-'}</td>
                          <td>{appt.appt_date || '-'}</td>
                          <td>{appt.appt_time || '-'}</td>
                          <td>{serviceName}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* แท็บใบบิล */}
        <Tab eventKey="invoice" title="ໃບບິນ">
          {appointments.map((appt, index) => {
            const divId = `invoice-${index}`;
            const customer = customers.find(c => c.id === appt.userId);
            const service = Array.isArray(appt.Service_id) && appt.Service_id.length > 0
              ? services.find(s => s.id === appt.Service_id[0])
              : null;

            return (
              <div key={index} id={divId} className="mb-4 p-3 border rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>ໃບບິນການນັດໝາຍ</h5>
                  <Button variant="dark" size="sm" onClick={() => handlePrint(divId)}>
                    🖨 ພິມໃບບິນ
                  </Button>
                </div>
                <Table size="sm" bordered>
                  <tbody>
                    <tr><td><strong>ຊື່ຜູ້ໃຊ້</strong></td><td>{customer?.name || '-'}</td></tr>
                    <tr><td><strong>ວັນທີ່</strong></td><td>{appt.appt_date || '-'}</td></tr>
                    <tr><td><strong>ເວລາ</strong></td><td>{appt.appt_time || '-'}</td></tr>
                    <tr><td><strong>ບໍລິການ</strong></td><td>{service?.service_name || 'ไม่ทราบชื่อบริการ'}</td></tr>
                    <tr><td><strong>ລາຄາ</strong></td><td>{service?.price ? parseInt(service.price).toLocaleString() + ' ₭' : '-'}</td></tr>
                  </tbody>
                </Table>
              </div>
            );
          })}
        </Tab>

        {/* แท็บลูกค้า */}
        <Tab eventKey="customers" title="ລູກຄ້າ">
          <Card>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr><th>ຊື່</th><th>Email</th><th>ເບີໂທ</th></tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr><td colSpan="3" className="text-center">ບໍ່ມີຂໍ້ມູນ</td></tr>
                  ) : (
                    customers.map(cust => (
                      <tr key={cust.id}>
                        <td>{cust.name || '-'}</td>
                        <td>{cust.email || cust.Email || '-'}</td>
                        <td>{cust.tel || cust.Tel || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* แท็บพนักงาน */}
        <Tab eventKey="employees" title="ພະນັກງານ">
          <Card>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr><th>ຊື່</th><th>Email</th><th>ເບີໂທ</th></tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr><td colSpan="3" className="text-center">ບໍ່ມີຂໍ້ມູນ</td></tr>
                  ) : (
                    employees.map(emp => (
                      <tr key={emp.id}>
                        <td>{emp.name || '-'}</td>
                        <td>{emp.email || emp.Email || '-'}</td>
                        <td>{emp.tel || emp.Tel || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

      </Tabs>
    </Container>
  );
}

export default Report;
