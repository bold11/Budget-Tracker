import { useState, useEffect } from 'react';
import { getTransactions, getBudgets, getCategories } from '../services/api';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { FaCreditCard, FaShoppingBag } from "react-icons/fa";
import { RiStockLine } from "react-icons/ri";
import { IoIosWarning } from "react-icons/io";


function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [chartPeriod, setChartPeriod] = useState('daily');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [tRes, bRes, cRes] = await Promise.all([getTransactions(), getBudgets(), getCategories()]);
      setTransactions(tRes.data);
      setBudgets(bRes.data);
      setCategories(cRes.data);
    } catch {
      setError('Failed to load dashboard data.');
    }
  };

  const totalIncome = transactions.filter(t => t.type?.toLowerCase() === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type?.toLowerCase() === 'expense').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
  ].filter(d => d.value > 0);
  const pieColors = ['#10b981', '#ef4444'];

  const getChartData = () => {
    const grouped = transactions.reduce((acc, t) => {
      const d = new Date(t.date);
      let key;
      if (chartPeriod === 'daily') {
        key = t.date.slice(0, 10);
      } else if (chartPeriod === 'weekly') {
        const day = d.getDay() || 7;
        const monday = new Date(d);
        monday.setDate(d.getDate() - day + 1);
        key = monday.toISOString().slice(0, 10);
      } else if (chartPeriod === 'monthly') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = String(d.getFullYear());
      }
      if (!acc[key]) acc[key] = { date: key, net: 0 };
      acc[key].net += t.type?.toLowerCase() === 'income' ? t.amount : -t.amount;
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  };

  const chartData = getChartData();

  const xAxisLabel = (value) => {
    if (chartPeriod === 'monthly') {
      const [y, m] = value.split('-');
      return new Date(y, m - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
    }
    if (chartPeriod === 'weekly') {
      const d = new Date(value);
      return d.toLocaleString('default', { month: 'short', day: 'numeric' });
    }
    return value;
  };

  const periods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  const budgetStatus = budgets.map(b => {
    const budgetDate = new Date(b.dates || b.Dates);
    const spent = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return (
          t.categoryId === (b.categoryId || b.CategoryId) &&
          t.type?.toLowerCase() === 'expense' &&
          tDate.getMonth() === budgetDate.getMonth() &&
          tDate.getFullYear() === budgetDate.getFullYear()
        );
      })
      .reduce((s, t) => s + t.amount, 0);
    const pct = (b.limit || b.Limit) > 0 ? Math.min((spent / (b.limit || b.Limit)) * 100, 100) : 0;
    return { ...b, spent, pct, limit: b.limit || b.Limit };
  });


  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const overspendingAlerts = budgetStatus.filter(b => b.spent > b.limit);



  return (
    <div className="page-content">
      <h2 className="page-title">Dashboard <span>Overview</span></h2>
      {error && <div className="alert alert-danger py-2 rounded-3">{error}</div>}


      {/* Overspending Alerts */}
      {overspendingAlerts.map(b => (
        <div key={b.id || b.ID} className="alert alert-danger py-2 rounded-3 d-flex align-items-center gap-2 mb-2">
          {/* Warning icon */}
          <IoIosWarning size={22} color="#dc3545" />
          {/* Alert message and category name, spent, and limit */}
          <span>
            <strong>You're overspending on {b.categoryDTO?.name}!</strong>
            {' '}You've spent <strong>${b.spent.toFixed(2)}</strong> but your budget is only <strong>${b.limit.toFixed(2)}</strong>.
          </span>
        </div>
      ))}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Income', value: totalIncome, cls: 'income', color: '#10b981', prefix: '+' },
          { label: 'Total Expenses', value: totalExpense, cls: 'expense', color: '#ef4444', prefix: '−' },
          { label: 'Net Balance', value: netBalance, cls: 'balance', color: '#3b82f6', prefix: netBalance >= 0 ? '+' : '−' },
        ].map(({ label, value, cls, color, prefix }) => (
          <div key={label} className="col-md-4">
            <div className={`card bt-card stat-card ${cls}`}>
              <div className="card-body py-3">
                <p className="text-muted mb-1" style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </p>
                <h3 className="mb-0 fw-bold" style={{ color, fontSize: '1.9rem' }}>
                  {prefix}${Math.abs(value).toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        {/* Pie chart */}
        <div className="col-md-5">
          <div className="card bt-card h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Income vs Expenses</h6>
              {pieData.length === 0 ? (
                <div className="text-center text-muted py-5">No transaction data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Budget status */}
        <div className="col-md-7">
          <div className="card bt-card h-100">
            <div className="card-header border-0 d-flex justify-content-between align-items-center pt-3 pb-0">
              <h6 className="fw-semibold mb-0">Budget Status</h6>
              <Link to="/budgets" className="btn btn-sm btn-outline-success" style={{ borderRadius: 7, fontSize: '0.8rem' }}>View All</Link>
            </div>
            <div className="card-body pt-3">
              {budgetStatus.length === 0
                ? <p className="text-muted text-center mt-3">No budgets set.</p>
                : budgetStatus.map(b => (
                  <div key={b.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-medium" style={{ fontSize: '0.9rem' }}>{b.categoryDTO?.name}</span>
                      <small className="text-muted">${b.spent.toFixed(2)} / ${b.limit.toFixed(2)}</small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar ${b.pct >= 90 ? 'bg-danger' : b.pct >= 70 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                    <small className="text-muted">{b.pct.toFixed(0)}% used</small>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card bt-card mb-4">
        <div className="card-header border-0 d-flex justify-content-between align-items-center pt-3 pb-0">
          <h6 className="fw-semibold mb-0">Recent Transactions</h6>
          <Link to="/transactions" className="btn btn-sm btn-outline-success" style={{ borderRadius: 7, fontSize: '0.8rem' }}>View All</Link>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr style={{ borderTop: '1px solid var(--bs-border-color)' }}>
                <th style={{ paddingLeft: '1rem', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', background: 'transparent' }}>Date</th>
                <th style={{ fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', background: 'transparent' }}>Description</th>
                <th style={{ fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', background: 'transparent' }}>Category</th>
                <th style={{ fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', background: 'transparent' }}>Amount</th>
                <th style={{ fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', background: 'transparent' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0
                ? <tr><td colSpan="5" className="text-center text-muted p-4">No transactions yet.</td></tr>
                : recent.map(t => (
                  <tr key={t.id}>
                    <td style={{ paddingLeft: '1rem', fontSize: '0.88rem' }}>{t.date.slice(0, 10)}</td>
                    <td style={{ fontSize: '0.88rem' }}>{t.description}</td>
                    <td style={{ fontSize: '0.88rem' }}>{t.categoryDTO?.name}</td>
                    <td>
                      <span className={t.type?.toLowerCase() === 'income' ? 'amount-income' : 'amount-expense'}>
                        {t.type?.toLowerCase() === 'income' ? '+' : '−'}${t.amount.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={t.type?.toLowerCase() === 'income' ? 'badge-income' : 'badge-expense'}>
                        {t.type}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Balance Line Chart */}
      <div className="card bt-card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">Balance Over Time</h6>
            <div className="btn-group btn-group-sm" role="group">
              {periods.map(p => (
                <button
                  key={p.key}
                  type="button"
                  className={`btn ${chartPeriod === p.key ? 'btn-bt-primary' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                  onClick={() => setChartPeriod(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {chartData.length === 0
            ? <div className="text-center text-muted py-4">No data yet.</div>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--bs-border-color)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={xAxisLabel} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={v => `$${v.toFixed(2)}`}
                    labelFormatter={label => {
                      if (chartPeriod === 'weekly') return `Week of ${label}`;
                      if (chartPeriod === 'monthly') return xAxisLabel(label);
                      if (chartPeriod === 'yearly') return `Year ${label}`;
                      return label;
                    }}
                  />
                  <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* Count stats */}
      <div className="row g-3">
        {[
          { label: 'Total Transactions', value: transactions.length, icon: <FaCreditCard size={28} color="#3b82f6" /> },
          { label: 'Categories', value: categories.length, icon: <FaShoppingBag size={28} color="#f59e0b" /> },
          { label: 'Active Budgets', value: budgets.length, icon: <RiStockLine size={28} color="#10b981" /> },
        ].map(stat => (
          <div className="col-md-4" key={stat.label}>
            <div className="card bt-card text-center">
              <div className="card-body py-3">
                <div style={{ marginBottom: '0.4rem' }}>{stat.icon}</div>
                <h4 className="fw-bold mb-0">{stat.value}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
