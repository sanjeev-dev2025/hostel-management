import React from 'react';
import GenericList from '../components/GenericList';

export function Students() {
  const cols = [
    { header: 'ID', field: 'student_id' },
    { header: 'Name', render: (row) => `${row.first_name} ${row.last_name}` },
    { header: 'Gender', field: 'gender' },
    { header: 'Phone', field: 'phone_number' },
    { header: 'Active', render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {row.is_active ? 'Yes' : 'No'}
        </span>
    )},
  ];
  return <GenericList title="Students" endpoint="/studentlist/" columns={cols} />;
}

export function Hostels() {
  const cols = [
    { header: 'Name', field: 'name' },
    { header: 'Gender', field: 'gender' },
  ];
  return <GenericList title="Hostels" endpoint="/hostel/" columns={cols} />;
}

export function Rooms() {
  const cols = [
    { header: 'Room No', field: 'room_number' },
    { header: 'Type', field: 'room_type' },
    { header: 'Capacity', field: 'capacity' },
    { header: 'Occupied', field: 'occupied' },
    { header: 'Hostel ID', field: 'hostel' },
  ];
  return <GenericList title="Rooms" endpoint="/room/" columns={cols} />;
}

export function Allotments() {
  const cols = [
    { header: 'ID', field: 'id' },
    { header: 'Student ID', field: 'student' },
    { header: 'Room ID', field: 'room' },
    { header: 'Date', field: 'room_allocated_date' },
  ];
  return <GenericList title="Room Allotments" endpoint="/roomallotment/" columns={cols} />;
}

export function Payments() {
  const cols = [
    { header: 'Student ID', field: 'student' },
    { header: 'Amount', render: (row) => `$${row.amount}` },
    { header: 'Month', field: 'billing_month' },
    { header: 'Year', field: 'billing_year' },
    { header: 'Status', render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {row.status}
        </span>
    )},
    { header: 'Date', field: 'payment_date' },
  ];
  return <GenericList title="Payments" endpoint="/payment/" columns={cols} />;
}
