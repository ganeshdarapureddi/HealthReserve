"use client"

import React from 'react';
import './DoctorCard.css';
import { Doctor } from '@/app/lib/definitions';

interface Props{
  doctor:Doctor
}

export function DoctorCard({ doctor }: Props) {
 
  return (
    <div className="doctor-card">
      <h2>{doctor.name}</h2>
      <p><strong>Specialization:</strong> {doctor.specialization}</p>
      <p><strong>Experience:</strong> {doctor.experience} years</p>
    
    </div>
  );
}
