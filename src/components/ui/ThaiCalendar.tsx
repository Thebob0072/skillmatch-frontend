import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface ThaiCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const weekDaysTh = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
const weekDaysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekDaysZh = ['一', '二', '三', '四', '五', '六', '日'];
const monthNamesTh = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const monthNamesShortTh = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthNamesShortEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthNamesZh = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const monthNamesShortZh = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function isSameDate(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export const ThaiCalendar: React.FC<ThaiCalendarProps> = ({ 
  value, 
  onChange, 
  maxDate, 
  minDate,
  placeholder,
  className = '',
  error = false
}) => {
  const { i18n, t } = useTranslation();
  const dateType = i18n.language === 'th' ? 'th' : i18n.language === 'zh' ? 'zh' : 'en';
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [viewMode, setViewMode] = useState<'date' | 'month' | 'year'>('date');
  const calendarRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const displayYear = dateType === 'th' ? year + 543 : year;
  const month = currentDate.getMonth();
  const today = new Date();

  const monthNames = dateType === 'th' ? monthNamesTh : dateType === 'zh' ? monthNamesZh : monthNamesEn;
  const monthNamesShort = dateType === 'th' ? monthNamesShortTh : dateType === 'zh' ? monthNamesShortZh : monthNamesShortEn;
  const weekDays = dateType === 'th' ? weekDaysTh : dateType === 'zh' ? weekDaysZh : weekDaysEn;

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const startDay = (startOfMonth.getDay() + 6) % 7;
  const daysInMonth = endOfMonth.getDate();

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('date');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    const d = date.getDate();
    const m = monthNamesShort[date.getMonth()];
    const y = dateType === 'th' ? date.getFullYear() + 543 : date.getFullYear();
    return `${d} ${m} ${y}`;
  };

  const isDateDisabled = (date: Date) => {
    if (maxDate && date > maxDate) return true;
    if (minDate && date < minDate) return true;
    return false;
  };

  const onSelectionChange = (date: Date) => {
    if (isDateDisabled(date)) return;
    onChange(date);
    setIsOpen(false);
    setViewMode('date');
  };

  const goToPrevMonth = () => {
    if (viewMode === 'date') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(new Date(year - 1, month, 1));
    } else if (viewMode === 'year') {
      setCurrentDate(new Date(year - 12, month, 1));
    }
  };

  const goToNextMonth = () => {
    if (viewMode === 'date') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(new Date(year + 1, month, 1));
    } else if (viewMode === 'year') {
      setCurrentDate(new Date(year + 12, month, 1));
    }
  };

  const handleHeaderClick = () => {
    if (viewMode === 'date') setViewMode('month');
    else if (viewMode === 'month') setViewMode('year');
  };

  const handleMonthSelect = (selectedMonth: number) => {
    setCurrentDate(new Date(year, selectedMonth, 1));
    setViewMode('date');
  };

  const handleYearSelect = (selectedYear: number) => {
    setCurrentDate(new Date(selectedYear, month, 1));
    setViewMode('month');
  };

  const renderDays = () => {
    const days: React.ReactNode[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const thisDate = new Date(year, month, i);
      const isToday = isSameDate(thisDate, today);
      const isSelected = value ? isSameDate(thisDate, value) : false;
      const disabled = isDateDisabled(thisDate);

      days.push(
        <div
          key={i}
          onClick={() => !disabled && onSelectionChange(thisDate)}
          className={`aspect-square flex items-center justify-center rounded-lg w-9 h-9 text-sm transition-all duration-200
            ${disabled 
              ? 'text-gray-600 cursor-not-allowed opacity-50' 
              : 'cursor-pointer hover:bg-neon-purple/20'
            }
            ${isSelected 
              ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold shadow-[0_0_15px_rgba(255,16,240,0.5)]' 
              : isToday 
                ? 'bg-neon-gold/20 text-neon-gold font-bold ring-2 ring-neon-gold/50' 
                : 'text-gray-200'
            }
          `}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  const renderMonthPicker = () => (
    <div className="grid grid-cols-3 gap-2 p-2">
      {monthNamesShort.map((name, i) => {
        const isSelected = value && i === value.getMonth() && year === value.getFullYear();
        return (
          <div
            key={i}
            onClick={() => handleMonthSelect(i)}
            className={`p-2 flex justify-center items-center rounded-lg cursor-pointer text-sm transition-all duration-200
              ${isSelected 
                ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold shadow-[0_0_15px_rgba(255,16,240,0.5)]' 
                : 'text-gray-200 hover:bg-neon-purple/20'
              }
            `}
          >
            {name}
          </div>
        );
      })}
    </div>
  );

  const startYear = year - (year % 12);
  const endYear = startYear + 11;
  const yearRangeDisplay = dateType === 'th' ? `${startYear + 543} - ${endYear + 543}` : `${startYear} - ${endYear}`;

  const renderYearPicker = () => {
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {years.map((y) => {
          const isSelected = value && y === value.getFullYear();
          return (
            <div
              key={y}
              onClick={() => handleYearSelect(y)}
              className={`p-2 flex justify-center items-center rounded-lg cursor-pointer text-sm transition-all duration-200
                ${isSelected 
                  ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold shadow-[0_0_15px_rgba(255,16,240,0.5)]' 
                  : 'text-gray-200 hover:bg-neon-purple/20'
                }
              `}
            >
              {dateType === 'th' ? y + 543 : y}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative" ref={calendarRef}>
      {/* Input Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-black/50 border-2 rounded-xl text-white cursor-pointer flex items-center justify-between transition-all duration-300
          ${error ? 'border-neon-red/50 focus:border-neon-red' : 'border-neon-purple/30 hover:border-neon-purple/50'}
          ${isOpen ? 'border-neon-purple shadow-[0_0_20px_rgba(157,0,255,0.4)]' : ''}
          ${className}
        `}
      >
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {value ? formatDisplayDate(value) : (placeholder || 'เลือกวันที่')}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[320px] bg-black/90 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(255,16,240,0.3)] border-2 border-neon-purple/30 p-4 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={goToPrevMonth} 
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-neon-purple hover:bg-neon-purple/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 
              className="text-lg font-bold text-white cursor-pointer hover:text-neon-purple transition-colors"
              onClick={handleHeaderClick}
            >
              {viewMode === 'date' && `${monthNames[month]} ${displayYear}`}
              {viewMode === 'month' && `${displayYear}`}
              {viewMode === 'year' && yearRangeDisplay}
            </h2>
            <button 
              onClick={goToNextMonth} 
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-neon-purple hover:bg-neon-purple/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Content */}
          {viewMode === 'year' && renderYearPicker()}
          {viewMode === 'month' && renderMonthPicker()}
          {viewMode === 'date' && (
            <>
              <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-medium mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">{renderDays()}</div>
            </>
          )}

          {/* Quick Actions */}
          <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-neon-purple/20">
            <button
              onClick={() => {
                const newDate = new Date();
                if (!isDateDisabled(newDate)) {
                  onChange(newDate);
                  setIsOpen(false);
                }
              }}
              className="px-3 py-1 text-xs text-neon-gold hover:bg-neon-gold/20 rounded-lg transition-all"
            >
              {t('calendar_today')}
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setViewMode('date');
              }}
              className="px-3 py-1 text-xs text-gray-400 hover:bg-gray-700/50 rounded-lg transition-all"
            >
              {t('calendar_close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThaiCalendar;
