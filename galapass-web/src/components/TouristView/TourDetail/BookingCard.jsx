import {useNavigate} from "react-router-dom";
import {CalendarIcon, Minus, Plus} from "lucide-react";

const BookingCard = ({tour, upcomingDates, setCalendarModalOpen, setSelectedDate, selectedDate, totalPrice, handleGuestChange, formatDate, guests}) => {
 const navigate = useNavigate();

 return (
     <div className="lg:col-span-1 mt-10 lg:mt-0">
         <div className="sticky top-8">
             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                 <div className="flex items-baseline mb-4">
                     <span className="text-3xl font-extrabold text-gray-900">${tour.price.toFixed(2)}</span>
                     <span className="text-gray-600 ml-1">/ person</span>
                 </div>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Select a Date</label>
                         <div className="grid grid-cols-3 gap-2">
                             {upcomingDates.map((d) => (
                                 <button key={d.date} onClick={() => setSelectedDate(d.date)} className={`p-2 rounded-lg border text-center transition-colors text-sm ${selectedDate === d.date ? 'border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-500' : 'border-gray-300 hover:border-gray-500 cursor-pointer'}`}>
                                     <div className="font-bold">{formatDate(d.date, { day: 'numeric' })}
                                     </div>
                                     <div className="text-xs">{formatDate(d.date, { month: 'short' })}
                                     </div>
                                 </button>))}
                             <button onClick={() => setCalendarModalOpen(true)} className="p-2 rounded-lg border border-dashed border-gray-400 text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors flex flex-col items-center justify-center space-y-1 col-span-3 mt-1 cursor-pointer">
                                 <CalendarIcon className="w-4 h-4" />
                                 <span className="font-medium text-xs">More dates</span>
                             </button>
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Guests</label>
                         <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                             <span className="text-gray-700">Number of Guests</span>
                             <div className="flex items-center space-x-3">
                                 <button
                                     onClick={() => handleGuestChange(-1)} disabled={guests <= 1} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                     <Minus className="w-4 h-4"/>
                                 </button>
                                 <span className="font-bold text-lg w-6 text-center">{guests}</span>
                                 <button onClick={() => handleGuestChange(1)} disabled={guests >= tour.maxGuests} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                     <Plus className="w-4 h-4"/>
                                 </button>
                             </div></div>
                     </div>
                 </div>
                 <div className="my-6 border-t border-gray-200 pt-4">
                     <div className="flex justify-between items-center text-lg"><span className="font-bold text-gray-900">Total</span><span className="font-extrabold text-2xl text-gray-900">${totalPrice}</span></div>
                     <p className="text-xs text-gray-500 text-right">Includes all taxes and fees</p>
                 </div>
                 <button onClick={() => navigate("/tourist/booking-review")} disabled={!selectedDate} className="w-full py-3 px-4 rounded-lg font-bold text-lg text-white transition-colors bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer">{selectedDate ? 'Request Booking' : 'Select a Date'}</button>
                 <p className="text-xs text-gray-500 text-center mt-3">You won't be charged yet</p>
             </div>
         </div>
     </div>
 )
};

export default BookingCard;