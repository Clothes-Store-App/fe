import React, { useState, useMemo, useEffect } from 'react'
import { 
  BanknotesIcon,
  ShoppingBagIcon, 
  CubeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ORDER_STATUS } from '../../constants';
import { 
  useGetDashboardOverviewQuery,
  useGetOrderStatisticsQuery,
  useGetOrderStatusStatisticsQuery,
} from '../../services/analytics.service';

// Thêm keyframes animation vào đầu file
const pulseRing = {
  '0%': {
    transform: 'scale(0.33)',
  },
  '80%, 100%': {
    opacity: 0,
  },
};

// Màu sắc chuyên nghiệp
const THEME = {
  primary: '#0f172a',    // Slate 900
  secondary: '#475569',  // Slate 600
  accent: {
    blue: '#3b82f6',    // Blue 500
    green: '#22c55e',   // Green 500
    yellow: '#eab308',  // Yellow 500
    red: '#ef4444',     // Red 500
  },
  background: {
    light: '#f8fafc',   // Slate 50
    white: '#ffffff',
    blue: '#eff6ff',    // Blue 50
    green: '#f0fdf4',   // Green 50
    yellow: '#fefce8',  // Yellow 50
    red: '#fef2f2',     // Red 50
  },
  text: {
    primary: '#0f172a',  // Slate 900
    secondary: '#64748b', // Slate 500
    light: '#94a3b8',    // Slate 400
  },
  border: '#e2e8f0',     // Slate 200
};

// Thêm hàm format số lớn
const formatLargeNumber = (number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};

// Cập nhật hàm format tiền tệ để xử lý số lớn đẹp hơn
const formatCurrency = (amount) => {
  // Xử lý số 0 hoặc undefined
  if (!amount) return '0 đ';
  
  // Chuyển số thành chuỗi và tách phần nguyên, phần thập phân
  const parts = amount.toString().split('.');
  const integerPart = parts[0];
  
  // Thêm dấu chấm cho phần nguyên
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Nếu số quá lớn (>= 1 tỷ), chuyển sang định dạng tỷ
  if (amount >= 1000000000) {
    const billions = (amount / 1000000000).toFixed(1);
    return `${billions.replace('.', ',')} tỷ`;
  }
  
  // Nếu số quá lớn (>= 1 triệu), chuyển sang định dạng triệu
  if (amount >= 1000000) {
    const millions = (amount / 1000000).toFixed(1);
    return `${millions.replace('.', ',')} tr`;
  }

  return `${formattedInteger} đ`;
};

// Cập nhật hàm xác định classes cho doanh thu
const getRevenueClasses = (number) => {
  // Kiểm tra nếu là số tỷ hoặc triệu
  if (number >= 1000000000 || number >= 1000000) {
    return {
      container: 'flex flex-col items-start',
      number: 'text-3xl md:text-4xl font-bold tracking-tight',
      unit: 'text-xl md:text-2xl text-blue-600 font-semibold mt-1',
      label: 'text-sm text-slate-600 font-medium mb-2'
    };
  }
  
  // Xử lý dựa trên độ dài số
  const numberString = number.toString();
  if (numberString.length >= 13) {
    return {
      container: 'flex flex-col items-start',
      number: 'text-2xl md:text-3xl font-bold tracking-tight',
      unit: 'text-lg md:text-xl text-blue-600 font-semibold mt-1',
      label: 'text-sm text-slate-600 font-medium mb-2'
    };
  }
  
  return {
    container: 'flex flex-col items-start',
    number: 'text-3xl md:text-4xl font-bold tracking-tight',
    unit: 'text-xl md:text-2xl text-blue-600 font-semibold mt-1',
    label: 'text-sm text-slate-600 font-medium mb-2'
  };
};

// Cập nhật hàm xác định classes dựa trên độ dài số
const getResponsiveClasses = (number, isRevenue = false) => {
  const numberString = number.toString();
  if (isRevenue) {
    if (numberString.length >= 13) {
      return {
        number: 'text-2xl md:text-3xl',
        label: 'text-xs md:text-sm',
        icon: 'w-4 h-4'
      };
    }
    if (numberString.length >= 10) {
      return {
        number: 'text-3xl md:text-4xl',
        label: 'text-xs md:text-sm',
        icon: 'w-4 h-4'
      };
    }
    return {
      number: 'text-4xl md:text-5xl',
      label: 'text-sm md:text-base',
      icon: 'w-5 h-5'
    };
  }
  
  // Existing logic for other cards
  if (numberString.length >= 10) {
    return {
      number: 'text-xl md:text-2xl',
      icon: 'w-6 h-6',
      iconContainer: 'p-3',
      smallIcon: 'w-4 h-4',
      label: 'text-xs md:text-sm'
    };
  }
  if (numberString.length >= 7) {
    return {
      number: 'text-2xl md:text-3xl',
      icon: 'w-7 h-7',
      iconContainer: 'p-3.5',
      smallIcon: 'w-4.5 h-4.5',
      label: 'text-xs md:text-sm'
    };
  }
  return {
    number: 'text-3xl md:text-4xl',
    icon: 'w-8 h-8',
    iconContainer: 'p-4',
    smallIcon: 'w-5 h-5',
    label: 'text-sm md:text-base'
  };
};

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState('month');
  
  // Khởi tạo startDate là ngày đầu tháng hiện tại
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  
  // Khởi tạo endDate là ngày cuối tháng hiện tại
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  });

  // Tự động cập nhật khi component mount
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);
  
  // Tạo params dựa trên loại filter
  const filterParams = useMemo(() => {
    if (filterType === 'month') {
      return {
        fromDate: startDate,
        toDate: endDate
      };
    } else {
      return { year: selectedYear };
    }
  }, [filterType, selectedYear, startDate, endDate]);
  
  const { data: overview, isLoading: isLoadingOverview } = useGetDashboardOverviewQuery(filterParams);
  const { data: orderStats, isLoading: isLoadingOrderStats } = useGetOrderStatisticsQuery(filterParams);
  const { data: statusStats, isLoading: isLoadingStatusStats } = useGetOrderStatusStatisticsQuery(filterParams);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const statusConfig = useMemo(() => ({
    classes: {
      [ORDER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      [ORDER_STATUS.PROCESSING]: "bg-blue-100 text-blue-800",
      [ORDER_STATUS.SHIPPED]: "bg-indigo-100 text-indigo-800",
      [ORDER_STATUS.DELIVERED]: "bg-green-100 text-green-800",
      [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800",
      'completed': "bg-green-100 text-green-800"
    },
    names: {
      [ORDER_STATUS.PENDING]: "Chờ xử lý",
      [ORDER_STATUS.PROCESSING]: "Đang xử lý",
      [ORDER_STATUS.SHIPPED]: "Đang giao hàng",
      [ORDER_STATUS.DELIVERED]: "Đã giao hàng",
      [ORDER_STATUS.CANCELLED]: "Đã hủy",
      'completed': "Đã hoàn thành"
    }
  }), []);

  if (isLoadingOverview || isLoadingOrderStats || isLoadingStatusStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-full">
        <div className="flex flex-col gap-6">
          {/* Thống kê chính */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Doanh thu */}
            <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-5 md:p-6 border border-slate-200 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 transform group-hover:translate-x-full duration-1000 transition-transform"></div>
              <div className={getRevenueClasses(overview?.totalRevenue || 0).container}>
                <span className={getRevenueClasses(overview?.totalRevenue || 0).label}>
                  Tổng doanh thu
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`${getRevenueClasses(overview?.totalRevenue || 0).number} text-slate-900 group-hover:text-blue-600 transition-colors`}>
                    {formatCurrency(overview?.totalRevenue || 0).split(' ')[0]}
                  </span>
                  <span className={getRevenueClasses(overview?.totalRevenue || 0).unit}>
                    {formatCurrency(overview?.totalRevenue || 0).split(' ')[1]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 text-sm font-medium mt-2">
                  <BanknotesIcon className="w-4 h-4" />
                  <span>Từ đơn hoàn thành</span>
                </div>
              </div>
            </div>

            {/* Đơn hàng */}
            <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-5 md:p-6 border border-slate-200 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 transform group-hover:translate-x-full duration-1000 transition-transform"></div>
              <div className="flex items-center justify-between relative">
                <div className="space-y-2 md:space-y-3 flex-1">
                  <p className="text-slate-600 text-xs md:text-sm font-medium tracking-wide">Tổng đơn hàng</p>
                  <p className={`${getResponsiveClasses(overview?.totalOrders || 0).number} font-bold text-slate-900 tracking-tight group-hover:text-green-600 transition-colors`}>
                    {formatLargeNumber(overview?.totalOrders || 0)}
                  </p>
                  <div className="flex items-center text-green-600 text-xs md:text-sm font-medium">
                    <ShoppingBagIcon className={`${getResponsiveClasses(overview?.totalOrders || 0).smallIcon} mr-1.5 md:mr-2`} />
                    <span>Tất cả đơn hàng</span>
                  </div>
                </div>
                <div className="relative ml-3 md:ml-4">
                  <div className="absolute -inset-3 md:-inset-4 bg-green-50 rounded-full blur-2xl group-hover:bg-green-100/80 transition-colors duration-300"></div>
                  <div className={`relative bg-gradient-to-br from-green-500 to-green-600 rounded-xl md:rounded-2xl ${getResponsiveClasses(overview?.totalOrders || 0).iconContainer} group-hover:scale-110 transition-transform duration-300`}>
                    <ShoppingBagIcon className={`${getResponsiveClasses(overview?.totalOrders || 0).icon} text-white`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-5 md:p-6 border border-slate-200 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 transform group-hover:translate-x-full duration-1000 transition-transform"></div>
              <div className="flex items-center justify-between relative">
                <div className="space-y-2 md:space-y-3 flex-1">
                  <p className="text-slate-600 text-xs md:text-sm font-medium tracking-wide">Tổng sản phẩm</p>
                  <p className={`${getResponsiveClasses(overview?.totalProducts || 0).number} font-bold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors`}>
                    {formatLargeNumber(overview?.totalProducts || 0)}
                  </p>
                  <div className="flex items-center text-amber-600 text-xs md:text-sm font-medium">
                    <CubeIcon className={`${getResponsiveClasses(overview?.totalProducts || 0).smallIcon} mr-1.5 md:mr-2`} />
                    <span>Sản phẩm đang bán</span>
                  </div>
                </div>
                <div className="relative ml-3 md:ml-4">
                  <div className="absolute -inset-3 md:-inset-4 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100/80 transition-colors duration-300"></div>
                  <div className={`relative bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl md:rounded-2xl ${getResponsiveClasses(overview?.totalProducts || 0).iconContainer} group-hover:scale-110 transition-transform duration-300`}>
                    <CubeIcon className={`${getResponsiveClasses(overview?.totalProducts || 0).icon} text-white`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Đơn chờ xử lý */}
            <div className="bg-gradient-to-br from-white to-rose-50/50 rounded-2xl p-5 md:p-6 border border-slate-200 hover:border-rose-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/0 via-rose-400/5 to-rose-400/0 transform group-hover:translate-x-full duration-1000 transition-transform"></div>
              <div className="flex items-center justify-between relative">
                <div className="space-y-2 md:space-y-3 flex-1">
                  <p className="text-slate-600 text-xs md:text-sm font-medium tracking-wide">Đơn chờ xử lý</p>
                  <p className={`${getResponsiveClasses(overview?.pendingOrders || 0).number} font-bold text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors`}>
                    {formatLargeNumber(overview?.pendingOrders || 0)}
                  </p>
                  <div className="flex items-center text-rose-600 text-xs md:text-sm font-medium">
                    <ClipboardDocumentListIcon className={`${getResponsiveClasses(overview?.pendingOrders || 0).smallIcon} mr-1.5 md:mr-2`} />
                    <span>Cần xử lý ngay</span>
                  </div>
                </div>
                <div className="relative ml-3 md:ml-4">
                  <div className="absolute -inset-3 md:-inset-4 bg-rose-50 rounded-full blur-2xl group-hover:bg-rose-100/80 transition-colors duration-300"></div>
                  <div className={`relative bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl md:rounded-2xl ${getResponsiveClasses(overview?.pendingOrders || 0).iconContainer} group-hover:scale-110 transition-transform duration-300`}>
                    <ClipboardDocumentListIcon className={`${getResponsiveClasses(overview?.pendingOrders || 0).icon} text-white`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ doanh thu và đơn hàng */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                
                {/* Bộ lọc */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Loại thống kê:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="min-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="month">Theo khoảng thời gian</option>
                      <option value="year">Theo năm</option>
                    </select>
                  </div>

                  {filterType === 'month' ? (
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700 min-w-[80px]">Từ ngày:</span>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="min-w-[160px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700 min-w-[80px]">Đến ngày:</span>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="min-w-[160px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 min-w-[80px]">Năm:</span>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="min-w-[160px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>{year}</option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={orderStats?.labels.map((date, index) => ({
                      date: formatDate(date),
                      orders: orderStats.datasets[0].data[index],
                      revenue: orderStats.datasets[1].data[index],
                    })) || []}
                    margin={{ top: 20, right: 120, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                    <XAxis 
                      dataKey="date" 
                      stroke={THEME.text.secondary}
                      tick={{ fill: THEME.text.secondary }}
                      tickMargin={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke={THEME.accent.blue}
                      tick={{ fill: THEME.text.secondary }}
                      tickMargin={10}
                      label={{ 
                        value: 'Số đơn hàng',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: THEME.accent.blue },
                        offset: 0
                      }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      stroke={THEME.accent.green}
                      tick={{ fill: THEME.text.secondary }}
                      tickFormatter={(value) => formatCurrency(value)}
                      tickMargin={35}
                      width={150}
                      label={{ 
                        value: 'Doanh thu',
                        angle: 90,
                        position: 'insideRight',
                        style: { fill: THEME.accent.green },
                        offset: 20,
                        dy: -20
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      }}
                      formatter={(value, name) => {
                        if (name === 'Doanh thu') return [formatCurrency(value), name];
                        return [value + ' đơn', name];
                      }}
                      labelFormatter={(label) => `Ngày ${label}`}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{
                        paddingTop: '10px'
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="orders"
                      name="Số đơn hàng"
                      stroke={THEME.accent.blue}
                      strokeWidth={2}
                      dot={{ fill: THEME.accent.blue, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      name="Doanh thu"
                      stroke={THEME.accent.green}
                      strokeWidth={2}
                      dot={{ fill: THEME.accent.green, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Biểu đồ trạng thái đơn hàng */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900">Trạng thái đơn hàng</h2>
              <p className="text-slate-500 mt-1">Phân bố trạng thái các đơn hàng</p>
            </div>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 40, right: 80, left: 80, bottom: 40 }}>
                  <Pie
                    data={statusStats?.datasets[0]?.data.map((value, index) => ({
                      name: statusConfig.names[statusStats.labels[index]] || statusStats.labels[index],
                      value: value
                    })) || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={160}
                    paddingAngle={8}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ 
                      stroke: '#64748b', 
                      strokeWidth: 1, 
                      strokeDasharray: '3 3',
                      length: 30
                    }}
                  >
                    {statusStats?.datasets[0]?.backgroundColor.map((color, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={color} 
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} đơn hàng`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      fontSize: '0.875rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
