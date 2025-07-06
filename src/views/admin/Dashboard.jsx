import React, { useState, useMemo, useEffect } from 'react'
import { FaShoppingBag, FaBoxes, FaListAlt, FaMoneyBillWave, FaChartLine, FaUserFriends } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ORDER_STATUS } from '../../constants';
import { 
  useGetDashboardOverviewQuery,
  useGetOrderStatisticsQuery,
  useGetOrderStatusStatisticsQuery,
} from '../../services/analytics.service';

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Doanh thu */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(overview?.totalRevenue || 0)}</p>
                  <div className="flex items-center text-blue-600 text-sm">
                    <FaChartLine className="mr-1.5" />
                    <span>Từ đơn hoàn thành</span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-full p-4">
                  <FaMoneyBillWave className="text-blue-500 text-2xl" />
                </div>
              </div>
            </div>

            {/* Đơn hàng */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-green-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-slate-900">{overview?.totalOrders || 0}</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <FaShoppingBag className="mr-1.5" />
                    <span>Tất cả đơn hàng</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-full p-4">
                  <FaShoppingBag className="text-green-500 text-2xl" />
                </div>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-yellow-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold text-slate-900">{overview?.totalProducts || 0}</p>
                  <div className="flex items-center text-yellow-600 text-sm">
                    <FaBoxes className="mr-1.5" />
                    <span>Sản phẩm đang bán</span>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-full p-4">
                  <FaBoxes className="text-yellow-600 text-2xl" />
                </div>
              </div>
            </div>

            {/* Đơn chờ xử lý */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-red-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Đơn chờ xử lý</p>
                  <p className="text-2xl font-bold text-slate-900">{overview?.pendingOrders || 0}</p>
                  <div className="flex items-center text-red-600 text-sm">
                    <FaUserFriends className="mr-1.5" />
                    <span>Cần xử lý ngay</span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-full p-4">
                  <FaListAlt className="text-red-500 text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ doanh thu và đơn hàng */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Thống kê doanh thu và đơn hàng</h2>
                  <p className="text-slate-500 mt-1">Biểu đồ thể hiện doanh thu và số lượng đơn hàng theo thời gian</p>
                </div>
                {/* Bộ lọc */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">Loại thống kê:</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="month">Theo khoảng thời gian</option>
                      <option value="year">Theo năm</option>
                    </select>
                  </div>

                  {filterType === 'month' ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-700">Từ ngày:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-700">Đến ngày:</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-700">Năm:</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
