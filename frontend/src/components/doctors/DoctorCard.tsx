"use client"

import React from 'react';

import { IDoctor } from '@/lib/models';

interface Props{
  doctor:IDoctor
}

export function DoctorCard({ doctor }: Props) {
 
  return (
    <div className="min-w-[330px] bg-gradient-to-br from-purple-400 to-purple-100 border-none p-8 rounded-2xl shadow-lg">
      <h2>{doctor.name}</h2>
      <p><strong>Specialization:</strong> {doctor.specialization}</p>
      <p><strong>Experience:</strong> {doctor.experience} years</p>
    
    </div>
  );
}
