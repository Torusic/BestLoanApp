import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Axios from "../utils/Axios.js";
import SummaryApi from "../common/SummaryApi.js";
import AxiosToastError from "../utils/AxiosToastError.js";
import RegisterClients from "./pages/actions/RegisterClients.jsx";
import SubmitLoan from "./pages/actions/SubmitLoan.jsx";

function AgentDashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
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
        setStats(response.data.data.stats);
        setAlerts(response.data.data.alerts || []);
        setActivities(response.data.data.recentActivities || []);
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

    // optional live refresh every 60s (SaaS feel)
    const interval = setInterval(() => {
      agentDashboard();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Smart Panel</h1>
          <p className="text-gray-400 text-sm">
            Assist clients with registration and loan processing
          </p>
        </div>

        <button
          onClick={agentDashboard}
          className="text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : stats && (
              <>
                <StatCard title="Clients Today" value={stats.clientsToday} />
                <StatCard title="Loans Submitted" value={stats.loansToday} />
                <StatCard title="Pending" value={stats.pending} />
                <StatCard title="Completed" value={stats.successful} />
              </>
            )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
        <ActionCard
          title="Register Client"
          color="bg-blue-600"
          onClick={() => setRegisterClient(true)}
        />
        <ActionCard title="Submit Loan" color="bg-green-600"onClick={() => setSubmitLoan(true)} />
       
      </div>

      {/* Alerts */}
      <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl mb-8">
        <h2 className="mb-3 font-semibold">Guidance</h2>

        <ul className="space-y-2 text-sm text-gray-300">
          {loading ? (
            <p className="text-gray-500">Loading alerts...</p>
          ) : alerts.length > 0 ? (
            alerts.map((alert, i) => <li key={i}>⚡ {alert}</li>)
          ) : (
            <li className="text-gray-500">No alerts available</li>
          )}
        </ul>
      </div>

      {/* Activity */}
      <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl">
        <h2 className="mb-4 font-semibold">Recent Actions</h2>

        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Loading activity...</p>
          ) : activities.length > 0 ? (
            activities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between bg-gray-800 p-3 rounded-lg"
              >
                <p className="text-sm">
                  {item.name} • {item.action}
                </p>

                <span
                  className={`text-sm font-medium ${
                    item.status === "Success" || item.status === "Approved"
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
            <p className="text-gray-500">No activity yet</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {registerClient && (
        <RegisterClients onClose={() => setRegisterClient(false)} />
      )}
      {
        submitLoan&&(
          <SubmitLoan onClose={() => setSubmitLoan(false)}/>
        )
      }
    </div>
  );
}

/* -------------------- Components -------------------- */

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl text-center">
      <p className="text-gray-400 text-xs">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value ?? 0}</h2>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gray-800 animate-pulse p-4 rounded-xl h-20" />
  );
}

function ActionCard({ title, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} p-6 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all`}
    >
      {title}
    </button>
  );
}

export default AgentDashboard;