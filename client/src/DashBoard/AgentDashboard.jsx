import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Axios from "../utils/Axios.js";
import SummaryApi from "../common/SummaryApi.js";
import AxiosToastError from "../utils/AxiosToastError.js";

import RegisterClients from "./pages/actions/RegisterClients.jsx";
import SubmitLoan from "./pages/actions/SubmitLoan.jsx";

// ICONS
import {
  MdPeople,
  MdAttachMoney,
  MdPendingActions,
  MdCheckCircle,
  MdTrendingUp,
  MdWarning,
  MdInfo,
  MdAddCircle,
  MdSend,
  MdNotificationsActive,
  MdHistory,
  MdRefresh,
} from "react-icons/md";

function AgentDashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [cons, setCons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [registerClient, setRegisterClient] = useState(false);
  const [submitLoan, setSubmitLoan] = useState(false);

  const agentDashboard = async () => {
    try {
      setError(null);
      setRefreshing(true);

      const response = await Axios({
        ...SummaryApi.agentDashboard,
      });

      if (response.data.success) {
        const data = response.data.data;

        setStats(data.stats);
        setAlerts(data.alerts || []);
        setActivities(data.recentActivities || []);
        setCons(data.cons || []);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      AxiosToastError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    agentDashboard();

    const interval = setInterval(agentDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between gap-2 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Agent SaaS Panel</h1>
          <p className="text-gray-400 text-sm">
            Manage clients & loans efficiently
          </p>
        </div>

<button
  onClick={agentDashboard}
  disabled={refreshing}
  className="text-xs px-3 py-1.5 flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 active:scale-95 transition rounded-lg disabled:opacity-60"
>
  <MdRefresh className={`${refreshing ? "animate-spin" : ""} text-sm`} />

  <span>
    {refreshing ? "Refreshing" : "Refresh"}
  </span>
</button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 p-3 rounded-lg mb-4 flex items-center gap-2">
          <MdWarning className="text-red-400" />
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <StatCard icon={<MdPeople />} title="Clients Today" value={stats?.clientsToday} />
        <StatCard icon={<MdAttachMoney />} title="Loans Today" value={stats?.loansToday} />
        <StatCard icon={<MdPendingActions />} title="Pending" value={stats?.pending} />
        <StatCard icon={<MdTrendingUp />} title="Completed" value={stats?.successful} />

      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-2 gap-4 mb-8">

        <ActionCard
          icon={<MdAddCircle />}
          title="Register Client"
          color="bg-blue-600 text-xs lg:text-lg"
          onClick={() => setRegisterClient(true)}
        />

        <ActionCard
          icon={<MdSend />}
          title="Submit Loan"
          color="bg-green-600 text-xs lg:text-lg"
          onClick={() => setSubmitLoan(true)}
        />

      </div>

      {/* ALERTS */}
      <Section title="Guidance Alerts" icon={<MdNotificationsActive />}>
        {alerts.length ? (
          alerts.map((a, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-300 mb-2">
              <MdInfo className="text-blue-400 mt-1" />
              {a}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No alerts</p>
        )}
      </Section>

      {/* CONS */}
      <Section title="System Risks" icon={<MdWarning />}>
        {cons.length ? (
          cons.map((c, i) => (
            <div
              key={i}
              className="flex gap-2 text-sm text-red-300 bg-red-500/10 p-2 rounded mb-2"
            >
              <MdWarning className="text-red-400 mt-1" />
              {c}
            </div>
          ))
        ) : (
          <p className="text-gray-500">System stable</p>
        )}
      </Section>

      {/* ACTIVITY */}
      <Section title="Recent Activity" icon={<MdHistory />}>
        {activities.length ? (
          activities.map((item, i) => (
            <motion.div
              key={i}
              className="flex justify-between bg-gray-800 p-3 rounded-lg mb-2"
            >
              <div className="flex gap-2 text-sm">
                <MdCheckCircle className="text-green-400 mt-1" />
                {item.name} • {item.action}
              </div>

              <span
                className={`text-xs ${
                  item.status === "Success"
                    ? "text-green-400"
                    : item.status === "Pending"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {item.status}
              </span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No activity</p>
        )}
      </Section>

      {/* MODALS */}
      {registerClient && (
        <RegisterClients onClose={() => setRegisterClient(false)} />
      )}

      {submitLoan && (
        <SubmitLoan onClose={() => setSubmitLoan(false)} />
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
      <div className="flex justify-center text-2xl text-blue-400 mb-1">
        {icon}
      </div>
      <p className="text-xs text-gray-400">{title}</p>
      <h2 className="text-xl font-bold">{value ?? 0}</h2>
    </div>
  );
}

function ActionCard({ icon, title, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} p-5 rounded-xl flex items-center justify-center gap-2 font-semibold hover:opacity-90`}
    >
      {icon}
      {title}
    </button>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl mb-6">
      <h2 className="font-semibold mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

export default AgentDashboard;