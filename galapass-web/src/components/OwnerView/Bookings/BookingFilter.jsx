import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import CustomCalendar from "../../TouristView/CustomCalendar.jsx";

const BookingFilters = ({
                          filterButtons,
                          activeFilter,
                          setActiveFilter,
                          searchTerm,
                          setSearchTerm,
                          dateFilter,
                          setDateFilter,
                          showCheckInCalendar,
                          setShowCheckInCalendar,
                          handleCheckInSelect,
                          searchData,
                          currentMonth,
                          setCurrentMonth
                        }) => {
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target)
      ) {
        setShowCheckInCalendar(false);
      }
    };

    if (showCheckInCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowCheckInCalendar, showCheckInCalendar]);

  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        activeFilter === filter.id
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {filter.label} ({filter.count})
                </button>
            ))}
          </div>

          {/* Search and Date Filter */}
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
              <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
              />
            </div>
            <div className="relative">
              <button
                  onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white cursor-pointer"
              >
                {/* This is the corrected line */}
                {searchData.checkIn ? new Date(searchData.checkIn.replace(/-/g, '/')).toLocaleDateString() : "mm/dd/yyyy"}
              </button>

              <div ref={calendarRef} className="absolute z-50 mt-2">
                <CustomCalendar
                    isVisible={showCheckInCalendar}
                    onSelectDate={handleCheckInSelect}
                    onClose={() => setShowCheckInCalendar(false)}
                    selectedDate={searchData.checkIn}
                    position="down"
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default BookingFilters;