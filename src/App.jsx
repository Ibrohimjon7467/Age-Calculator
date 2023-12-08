import { useState } from "react";

import { isLeapYear } from "./components/LeapYear";
import arrowIcon from './icons/icon-arrow.svg';
import { toast } from 'react-toastify';

// obj
const monthsAndDays = [
  {
    month: 1,
    days: 31,
  },
  {
    month: 2,
    days: {
      leap: 29,
      common: 28,
    },
  },{
    month: 3,
    days: 31,
  },
  {
    month: 4,
    days: 30,
  },
  {
    month: 5,
    days: 31,
  },
  {
    month: 6,
    days: 30,
  },
  {
    month: 7,
    days: 31,
  },
  {
    month: 8,
    days: 31,
  },
  {
    month: 9,
    days: 30,
  },
  {
    month: 10,
    days: 31,
  },
  {
    month: 11,
    days: 30,
  },
  {
    month: 12,
    days: 31,
  },
];

// function
function App() {

  const [formData, setFormData] = useState({
    day: "",
    month: "",
    year: "",
  })

  const [formErrors, setFormErrors] = useState({
    day: "",
    month: "",
    year: "",
    generic: "",
  })

  const [output, setOutput] = useState({
    days: "",
    months: "",
    years: "",
  })

  const hasErrors = formErrors.day || formErrors.month || formErrors.year || formErrors.generic

  const dateDiff = (date) => {

    date = date.split("-")

    const today = new Date();
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const yy = parseInt(date[0])
    const mm = parseInt(date[1])
    const dd = parseInt(date[2])

    let years, months, days

    months = month - mm
    if (day < dd) {
      months = months - 1
    }

    years = year - yy
    if (month * 100 + day < mm * 100 + dd) {
      years = years - 1
      months = months + 12
    }

    days = Math.floor(
      (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
      (24 * 60 * 60 * 1000)
    )

    return { years: years, months: months, days: days }
  }

  // calculating button
  const handleSubmit = (day, month, year) => {
    const dayAsNumber = Number(day)
    const monthAsNumber = Number(month)
    const yearAsNumber = Number(year)

    const today = new Date();
    const chosenDate = new Date(year, month - 1, day)

    const currentMonth = monthsAndDays.find(
      (item) => item.month === monthAsNumber
    )

    const validateDayForFebruary = () => {
      if (monthAsNumber === 2) {
        let maxDays

        if (isLeapYear(yearAsNumber)) {
          maxDays = currentMonth?.days?.leap
        } else {
          maxDays = currentMonth?.days?.common
        }

        if (dayAsNumber <= maxDays) {
          return true
        } else {
          return false
        }
      }

      return false
    }

    const isDayInputValid = dayAsNumber > 1 &&
      ((monthAsNumber !== 2 && dayAsNumber <= (currentMonth?.days || 31)) ||
        validateDayForFebruary())

    const isMonthInputValid = monthAsNumber >= 1 && monthAsNumber <= 12

    const isYearInputValid = yearAsNumber > 1 && yearAsNumber <= today.getFullYear()

    const isPastDate = today - chosenDate < 0

    // required form
    if (!day) {
      setFormErrors((prevState) => ({
        ...prevState,
        day: "this field is required",
        month: formErrors.month && isMonthInputValid ? "" : prevState.month,
        year: formErrors.year && isYearInputValid ? "" : prevState.year,
      }))
    }

    if (!month) {
      setFormErrors((prevState) => ({
        ...prevState,
        day: formErrors.day && isDayInputValid ? "" : prevState.day,
        month: "this field is required",
        year: formErrors.year && isYearInputValid ? "" : prevState.year,
      }))
    }

    if (!year) {
      setFormErrors((prevState) => ({
        ...prevState,
        day: formErrors.day && isDayInputValid ? "" : prevState.day,
        month: formErrors.month && isMonthInputValid ? "" : prevState.month,
        year: "this field is required",
      }))
    }

    const isPrecheckValid = isDayInputValid && isMonthInputValid && isYearInputValid

    if (!isPrecheckValid) {

      if (!isDayInputValid && day) {
        setFormErrors((prevState) => ({
          day: "Must be a valid day",
          month: formErrors.month && isMonthInputValid ? "" : prevState.month,
          year: formErrors.year && isYearInputValid ? "" : prevState.year,
          generic: "",
        }))
      }

      if (!isMonthInputValid && month) {
        setFormErrors((prevState) => ({
          day: formErrors.day && isDayInputValid ? "" : prevState.day,
          month: "must be a valid month",
          year: formErrors.year && isYearInputValid ? "" : prevState.year,
          generic: "",
        }))
      }

      if (!isYearInputValid && year) {
        setFormErrors((prevState) => ({
          day: formErrors.day && isDayInputValid ? "" : prevState.day,
          month: formErrors.month && isMonthInputValid ? "" : prevState.month,
          year: "must be a valid year",
          generic: "",
        }))
      }
    } else if (isPrecheckValid && isPastDate) {
      setFormErrors(() => ({
        day: "",
        month: "",
        year: "",
        generic: "must be a date in the past",
      }))

    } else {
      if (hasErrors) {
        setFormErrors({
          day: "",
          month: "",
          year: "",
          generic: "",
        })
      }

      const formattedDate = `${year}-${month}-${day}`
      const { years, months, days } = dateDiff(formattedDate)

      setOutput({
        days,
        months,
        years,
      })

      setFormErrors(() => ({
        day: "",
        month: "",
        year: "",
        generic: "",
      }))
    }
    toast.success('calculating')
  }

  return (
    <div className="w-[600px] bg-white rounded-sm max-w-[90vw] my-4 p-8">
      <div className="flex items-center justify-center gap-1 form">
        <div className="flex flex-col gap-1 flex-1 i">
          <label className="uppercase text-xs tracking-wide text-[grey]" htmlFor="day" >Day</label>
          <input className="w-32 py-3 pl-5 pr-4 text-2xl rounded-lg outline-none tracking-widest focus:border-black focus:border-solid border-[1px]" type="number" placeholder="day" id="day" min={1} value={formData.day}
            onChange={(e) => setFormData((prevState) => ({ ...prevState, day: e.target.value, }))} />
          {formErrors.day && <p className="text-[#ff5757] font-normal italic mt-1 tracking-widest text-xs">{formErrors.day}</p>}
        </div>

        <div className="flex flex-col gap-1 flex-1 i">
          <label className="uppercase text-xs tracking-wide text-[grey]" htmlFor="month" >Month</label>
          <input className="w-32 py-3 pl-5 pr-4 text-2xl rounded-lg outline-none tracking-widest focus:border-black focus:border-solid border-[1px]" type="number" placeholder="month" id="month" min={1} value={formData.month}
            onChange={(e) => setFormData((prevState) => ({ ...prevState, month: e.target.value }))} />
          {formErrors.month && <p className="text-[#ff5757] font-normal italic mt-1 tracking-widest text-xs ">{formErrors.month}</p>}
        </div>

        <div className="flex flex-col gap-1 flex-1 i">
          <label className="uppercase text-xs tracking-wide text-[grey]" htmlFor="year" >Year</label>
          <input className="w-32 py-3 pl-5 pr-4 text-2xl rounded-lg outline-none tracking-widest focus:border-black focus:border-solid border-[1px]" type="number" placeholder="year" id="year" min={1} value={formData.year}
            onChange={(e) => setFormData((prevState) => ({ ...prevState, year: e.target.value, }))} />
          {formErrors.year && <p className="text-[#ff5757] font-normal italic mt-1 tracking-widest text-xs">{formErrors.year}</p>}
        </div>
      </div>
      {formErrors.generic && (<p className="mt-2">{formErrors.generic}</p>)}

      <div className="flex items-center my-3">
        <div className="w-[86%] h-[2px] bg-[#DCDCDC]"></div>
        <button className="flex items-center justify-center w-[70px] h-[70px] arrow bg-[#854DFF]  hover:bg-[#151515] rounded-full p-4" onClick={() => handleSubmit(formData.day, formData.month, formData.year)} >
          <img src={arrowIcon} alt="arrowIcon" />
        </button>
      </div>

      {/* output */}
      <div className="output-container">
        <h1 className="text-6xl font-black italic"><span className="text-[purple]">
          {output.years === "" ? "--" : output.years}{" "}
        </span>{" "}
          {output.years === 1 ? "year" : "years"}
        </h1>
        <h1 className="text-6xl font-black italic"><span className="text-[purple]">
          {output.months === "" ? "--" : output.months}{" "}
        </span>{" "}
          {output.months === 1 ? "month" : "months"}
        </h1>
        <h1 className="text-6xl font-black italic"><span className="text-[purple]">
          {output.days === "" ? "--" : output.days}{" "}
        </span>{" "}
          {output.days === 1 ? "day" : "days"}
        </h1>
      </div>
    </div>
  )
}

export default App