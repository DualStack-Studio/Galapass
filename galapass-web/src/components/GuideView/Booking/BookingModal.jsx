import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, bookings }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-semibold">Tour Bookings</Dialog.Title>
                        <button onClick={onClose}>
                            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>

                    {bookings?.length > 0 ? (
                        <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                            {bookings.map(b => (
                                <li key={b.id} className="border p-4 rounded-lg shadow-sm">
                                    <p><strong>Client:</strong> {b.tourist?.name}</p>
                                    <p><strong>Status:</strong> {b.status}</p>
                                    <p><strong>Date:</strong> {b.date}</p>
                                    <p><strong>People:</strong> {b.persons}</p>
                                    <p><strong>Total Price:</strong> ${b.totalPrice}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No bookings for this tour.</p>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default BookingModal;
