import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor, textColor, dotColor;

  switch (status) {
    case 'Selesai':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      dotColor = 'bg-green-500';
      break;
    case 'Diproses':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      dotColor = 'bg-yellow-500';
      break;
    case 'Menunggu':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      dotColor = 'bg-red-500';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      dotColor = 'bg-gray-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
