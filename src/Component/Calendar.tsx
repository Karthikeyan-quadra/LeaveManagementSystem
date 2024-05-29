import * as React from "react";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getHolidayList } from "../Data/GetSiteLit";
interface HolidayEvent {
  title: string;
  start: Date;
  allDay?: boolean;
}

const Calendar = () => {
  const [holidays, setHolidays] = useState<HolidayEvent[]>([]);
  var customStyles = `

  :where(.css-dev-only-do-not-override-17seli4) a ,
  :where(.css-17seli4) a
  :where(.css-dev-only-do-not-override-17seli4) a:hover ,
  :where(.css-17seli4) a:hover
  {
     color: #000; 
    text-decoration: none;
    
}
.fc .fc-toolbar-title {
  font-size: 18px;
  margin: 0px;

}

     `;

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        // Fetch holidays from SharePoint list
        const holidayList = await getHolidayList();
        // Map the holiday list items to FullCalendar events format
        const formattedHolidays: HolidayEvent[] = holidayList.map(
          (holiday) => ({
            title: holiday.HolidayName, // Assuming 'HolidayName' is the column for holiday name
            start: new Date(holiday.Date), // Assuming 'Date' is the column for date
            allDay: true, // Set to true if the holiday spans the entire day
          })
        );
        // Set the formatted holidays to state
        setHolidays(formattedHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    fetchHolidays();
  }, []);
  console.log(holidays);

  return (
    <>
      <style>{customStyles}</style>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "",
          center: "title",
          right: "prev,next",
        }}
        events={holidays}
      />
    </>
  );
};

export default Calendar;
