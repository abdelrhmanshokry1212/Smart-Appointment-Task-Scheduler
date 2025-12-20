import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Bell,
  LayoutDashboard,
  PlusCircle,
  List,
  LogOut,
  User,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  Sun,
  Moon,
  Activity,
  Paperclip
} from 'lucide-react';

import {
  loginUser,
  registerUser,
  getAppointments,
  createAppointment,
  getNotifications,
  updateAppointment,
  deleteAppointment,
  getProductivity,
  uploadFile
} from './api';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [productivity, setProductivity] = useState({ score: 0, message: '' });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isLoggedIn && user) {
      loadData();
    }
  }, [isLoggedIn, user]);

  const loadData = async () => {
    try {
      const apps = await getAppointments(user._id || user.id);
      setAppointments(apps);
      const notifs = await getNotifications(user._id || user.id);
      setNotifications(notifs);
      const prod = await getProductivity(user._id || user.id);
      setProductivity(prod);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
        setAppointments(appointments.filter(a => (a._id || a.id) !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete");
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const app = appointments.find(a => (a._id || a.id) === id);
      if (!app) return;
      const updated = await updateAppointment(id, { ...app, status });
      setAppointments(appointments.map(a => (a._id || a.id) === id ? updated : a));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const navigateTo = (page) => setCurrentPage(page);

  // Filter items based on search
  const filteredAppointments = appointments.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'JD';
  };

  if (!isLoggedIn) {
    return <AuthPage
      onLogin={async (email, password) => {
        const userData = await loginUser(email, password);
        setUser(userData);
        setIsLoggedIn(true);
      }}
      onRegister={async (name, email, password) => {
        const userData = await registerUser(name, email, password);
        setUser(userData);
        setIsLoggedIn(true);
      }}
    />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex transition-colors duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-indigo-900 dark:text-indigo-400">SmartPlan</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={currentPage === 'dashboard'}
            onClick={() => navigateTo('dashboard')}
          />
          <NavItem
            icon={<List size={20} />}
            label="Appointments"
            active={currentPage === 'list'}
            onClick={() => navigateTo('list')}
          />
          <NavItem
            icon={<PlusCircle size={20} />}
            label="Create New"
            active={currentPage === 'create'}
            onClick={() => navigateTo('create')}
          />
          <NavItem
            icon={<Bell size={20} />}
            label="Notifications"
            active={currentPage === 'notifications'}
            onClick={() => navigateTo('notifications')}
            badge={notifications.filter(n => !n.read).length}
          />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-3 w-full p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-3 w-full p-3 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 transition-colors duration-300">
          <h2 className="text-lg font-semibold capitalize">
            {currentPage.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none"
              />
            </div>

            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm" title={user?.name}>
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {currentPage === 'dashboard' && <DashboardPage appointments={filteredAppointments} productivity={productivity} navigateTo={navigateTo} />}
          {currentPage === 'list' && <AppointmentListPage appointments={filteredAppointments} onDelete={handleDelete} onUpdateStatus={handleUpdateStatus} />}
          {currentPage === 'create' && <CreateAppointmentPage onSave={async (app) => {
            try {
              console.log("Saving appointment...", app);
              const payload = { ...app, userId: user._id || user.id };
              const newApp = await createAppointment(payload);
              setAppointments([newApp, ...appointments]);
              navigateTo('list');
            } catch (err) {
              console.error(err);
              alert("Failed to save appointment: " + (err.response?.data?.message || err.message));
            }
          }} />}
          {currentPage === 'notifications' && <NotificationsPage notifications={notifications} setNotifications={setNotifications} />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${active
      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
      }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px]">
        {badge}
      </span>
    )}
  </button>
);

const AuthPage = ({ onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isLoginView) {
        await onLogin(formData.email, formData.password);
      } else {
        await onRegister(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-10">
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-600 p-4 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <Calendar className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isLoginView ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your time, master your life.</p>
        </div>

        <div className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
          </button>
        </div>

        <p className="text-center text-slate-500 mt-8 text-sm">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLoginView(!isLoginView)} className="text-indigo-600 font-bold hover:underline">
            {isLoginView ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

const DashboardPage = ({ appointments, productivity, navigateTo }) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Filter true upcoming appointments (future date + not completed)
  const upcomingAppointmentsList = appointments.filter(app => {
    const appDate = new Date(app.date);
    return app.status !== 'Completed' && appDate >= today;
  });

  const totalTasks = appointments.length;
  const upcomingTasks = upcomingAppointmentsList.length;
  const completedTasks = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={totalTasks.toString()} icon={<List className="text-blue-500" />} color="blue" />
        <StatCard title="Upcoming" value={upcomingTasks.toString()} icon={<Clock className="text-indigo-500" />} color="indigo" />
        <StatCard title="Completed" value={completedTasks.toString()} icon={<CheckCircle className="text-emerald-500" />} color="emerald" />
        <StatCard title="Productivity" value={`${productivity.score}%`} icon={<Activity className="text-rose-500" />} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Upcoming Appointments</h3>
            <button
              onClick={() => navigateTo('list')}
              className="text-indigo-600 font-medium text-sm hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAppointmentsList.slice(0, 3).map((app) => (
              <div key={app._id || app.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${app.category === 'Work' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                    {app.category === 'Work' ? <Calendar size={24} /> : <User size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{app.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <Clock size={14} /> {app.time} • {app.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => navigateTo('list')}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Quick Actions</h3>
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">Need a plan?</h4>
              <p className="text-indigo-100 text-sm mb-6">Schedule your next important meeting or task in seconds.</p>
              <button
                onClick={() => navigateTo('create')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create Now
              </button>
            </div>
            <Calendar className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/30 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentListPage = ({ appointments, onDelete, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [rowMenuOpen, setRowMenuOpen] = useState(null);

  const getFilteredAppointments = () => {
    let filtered = appointments;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (activeTab === 'upcoming') {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return app.status !== 'Completed' && appDate >= today;
      });
    } else if (activeTab === 'past') {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return app.status === 'Completed' || appDate < today;
      });
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(app => app.category === categoryFilter);
    }

    return filtered;
  };

  const displayedAppointments = getFilteredAppointments();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
          {['upcoming', 'past'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-medium transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
          >
            <Filter size={18} />
            {categoryFilter === 'All' ? 'Filters' : categoryFilter}
          </button>
          {showFilters && (
            <div className="absolute right-0 top-12 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-3 w-48 animate-in zoom-in-95">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Category</p>
              {['All', 'Work', 'Personal', 'Health', 'Finance'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setShowFilters(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${categoryFilter === cat ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-visible shadow-sm min-h-[300px]">
        {displayedAppointments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No appointments found</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {displayedAppointments.map((app) => (
                <tr key={app._id || app.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-5 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {app.title}
                    {app.fileUrl && (
                      <a href={`http://localhost:3000${app.fileUrl}`} target="_blank" rel="noopener noreferrer" title="View Attachment" className="text-slate-400 hover:text-indigo-600">
                        <Paperclip size={14} />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm">
                    <div className="font-medium text-slate-700 dark:text-slate-300">{app.date}</div>
                    <div className="dark:text-slate-500">{app.time}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${app.category === 'Work' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      app.category === 'Personal' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                        app.category === 'Health' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                      {app.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <span className={`w-2 h-2 rounded-full ${app.status === 'Upcoming' ? 'bg-emerald-500' :
                        app.status === 'Completed' ? 'bg-blue-500' : 'bg-slate-400'
                        }`}></span>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRowMenuOpen(rowMenuOpen === (app._id || app.id) ? null : (app._id || app.id));
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {rowMenuOpen === (app._id || app.id) && (
                      <div className="absolute right-8 top-12 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-1 w-40 animate-in zoom-in-95 origin-top-right text-left">
                        <button
                          onClick={() => { onUpdateStatus(app._id || app.id, 'Completed'); setRowMenuOpen(null); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-2"
                        >
                          <CheckCircle size={14} />
                          Mark Done
                        </button>
                        <button
                          onClick={() => { onDelete(app._id || app.id); setRowMenuOpen(null); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-medium flex items-center gap-2"
                        >
                          <LogOut size={14} className="rotate-180" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const CreateAppointmentPage = ({ onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    category: 'Work',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let fileUrl = '';

    if (file) {
      try {
        const uploadRes = await uploadFile(file);
        fileUrl = uploadRes.url; // Assuming url is returned as relative path from proxy or full url
        // Ideally we need full url if proxy handles /storage -> localhost:3006/storage
        // Our controller returns /storage/filename. API Gateway /storage -> storage-service.
        // So frontend call to /storage/upload returns { url: /storage/filename }
        // This relative URL is fine if frontend calls via gateway.
      } catch (err) {
        console.error("Upload failed", err);
        alert("File upload failed, creating appointment without file.");
      }
    }

    onSave({ ...formData, id: Date.now(), status: 'Upcoming', fileUrl });
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 transition-colors">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Schedule New Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Appointment Title</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
              placeholder="e.g. Project Kickoff Meeting"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date</label>
              <input
                required
                type="date"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Time</label>
              <input
                required
                type="time"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
            <div className="flex gap-4">
              {['Work', 'Personal', 'Health', 'Finance'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${formData.category === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Additional Notes</label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
              placeholder="Any details you want to add..."
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Attachments</label>
            <input
              type="file"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : (
              <>
                <CheckCircle size={22} />
                Confirm Appointment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const NotificationsPage = ({ notifications, setNotifications }) => {
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Notifications</h3>
        <button
          onClick={clearAll}
          className="text-slate-400 hover:text-rose-600 text-sm font-medium transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
            <Bell size={48} className="mx-auto text-slate-200 dark:text-slate-600 mb-4" />
            <p className="text-slate-400 dark:text-slate-500 font-medium">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-6 rounded-3xl border transition-all flex gap-4 ${notif.read ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-75' : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/50 shadow-md ring-1 ring-indigo-50 dark:ring-indigo-900/30'
                }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${notif.read ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                }`}>
                {notif.read ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold ${notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{notif.title}</h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{notif.time}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{notif.text}</p>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="mt-3 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors">
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{value}</h3>
    </div>
    <div className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

export default App;
