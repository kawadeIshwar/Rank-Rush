import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { api, API_URL } from "./api";
import UserSelect from "./components/UserSelect";
import AddUserForm from "./components/AddUserForm";
import { toast } from "react-toastify";

const SOCKET_URL = API_URL.replace(/\/api$/, "");

export default function App() {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selected, setSelected] = useState("");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    pointClaims: 0,
    topScore: 0,
  });
  const [busy, setBusy] = useState(false);
  const [lastAward, setLastAward] = useState(null);

  async function load() {
    const [u, lb, st, h] = await Promise.all([
      api.get("/users"),
      api.get("/leaderboard"),
      api.get("/stats"),
      api.get("/history?limit=20&page=1"),
    ]);
    setUsers(u.data);
    setLeaderboard(lb.data);
    setStats(st.data);
    setHistory(h.data.items);
    if (u.data[0] && !selected) setSelected(u.data[0]._id);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    s.on("update", (payload) => {
      setLeaderboard(payload.leaderboard);
      setStats(payload.stats);
      setHistory((prev) => [payload.claim, ...prev].slice(0, 20));
      api.get("/users").then(({ data }) => setUsers(data));
      setLastAward({
        user: payload.claim.userName,
        points: payload.claim.points,
      });

      toast.info(`🎉 ${payload.claim.userName} got +${payload.claim.points} pts!`, {
        position: "top-center",
      });
    });
    return () => s.disconnect();
  }, []);

  async function claim() {
    if (!selected) return;
    setBusy(true);
    try {
      await api.post("/claim", { userId: selected });
      // success handled via websocket
    } catch (err) {
      toast.error("❌ Failed to claim points!");
    } finally {
      setBusy(false);
    }
  }

  async function onAdded() {
    await load();
    toast.success("🙌 User added successfully!");
  }

  const readyText = useMemo(() => {
    const u = users.find((x) => x._id === selected);
    return u ? `Ready to claim points for ${u.name}` : "Select a user";
  }, [users, selected]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 min-h-screen text-text-primary font-inter p-4 md:p-5">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-shadow-purple">Rank Rush</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-3 tracking-wide ">
            Competitive Leaderboard System
          </p>
          <p className="text-sm md:text-base text-yellow-400 font-medium animate-pulse">
            Select users, claim random points, and climb the rankings!
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 ">
          {[
            { icon: "👥", value: stats.totalUsers, label: "Total Users" },
            { icon: "⚡", value: stats.totalPoints, label: "Total Points" },
            { icon: "📊", value: stats.pointClaims, label: "Point Claims" },
            { icon: "🏆", value: stats.topScore, label: "Top Score" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-dark-bg rounded-2xl p-5 text-center border border-border hover:shadow-lg hover:scale-[1.07] transition-all duration-300"
            >
              <span className="text-3xl mb-2 block">{item.icon}</span>
              <div className="text-4xl font-extrabold mb-1">{item.value}</div>
              <div className="text-sm text-text-muted font-medium">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Game Controls + Leaderboard */}
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8">
          {/* Left column: Game Controls + Points History */}
          <div className="flex flex-col gap-8">
            {/* Game Controls Panel */}
            <div className="bg-dark-bg rounded-2xl p-6 border border-border h-fit hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">⚡ Game Controls</h2>
              <div className="mb-6">
                <div className="text-base font-semibold mb-3 flex items-center gap-2 text-text-primary ">
                  👤 Select User
                </div>
                <div className="flex gap-3 mb-4">
                  <UserSelect users={users} selected={selected} onChange={setSelected} />
                </div>
              </div>

              <button
                className="w-full bg-accent-green border-none text-white p-4 rounded-xl text-base font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 mb-4 hover:bg-emerald-600 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed "
                onClick={claim}
                disabled={!selected || busy}
              >
                {busy ? "Claiming..." : "⚡ Claim Random Points"}
              </button>

              <div className="text-sm text-text-muted text-center">{readyText}</div>

              {lastAward && (
                <div className="mt-4 p-3 bg-accent-green bg-opacity-10 rounded-xl border border-accent-green border-opacity-20 animate-pulse">
                  Awarded <b>+{lastAward.points}</b> points to <b>{lastAward.user}</b>
                </div>
              )}

              <div className="mt-6">
                <AddUserForm onAdded={onAdded} />
              </div>
            </div>

            {/* Points History Panel */}
            <div className="bg-dark-bg rounded-2xl p-6 border border-border hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">⏱️ Points History</h2>
              <div className="relative">
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-dark-panel scrollbar-thumb-accent-purple hover:scrollbar-thumb-accent-purple/80">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center p-3 bg-dark-panel rounded-xl mb-2 border border-border hover:bg-dark-bg hover:scale-[1] transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center mr-3 font-bold text-black">
                        +
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-text-primary">{item.userName}</div>
                        <div className="text-sm text-text-muted">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="font-bold text-accent-green">+{item.points} points</div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none "></div>
              </div>
            </div>
          </div>

          {/* Right column: Leaderboard */}
          <div className="bg-dark-bg rounded-2xl p-6 border border-border hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 text-accent-purple">
              🏆 Leaderboard
            </h2>
            {leaderboard.map((player, index) => {
              const maxPoints = Math.max(...leaderboard.map((p) => p.totalPoints), 1);
              const progressPercentage = (player.totalPoints / maxPoints) * 100;

              const getRankBadgeClasses = () => {
                if (index === 0) return "bg-accent-gold text-black border border-accent-gold ";
                if (index === 1) return "bg-gray-400 text-black";
                if (index === 2) return "bg-accent-orange text-white";
                return "bg-gray-600 text-white";
              };

              const getItemClasses = () => {
                let base =
                  "flex items-center p-4 bg-dark-panel rounded-xl mb-4 border border-border relative overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300";
                if (index === 0) return base + " bg-gradient-gold border-yellow-400 shadow-lg shadow-yellow-700";
                if (index === 1) return base + " bg-gradient-silver border-gray-400";
                if (index === 2) return base + " bg-gradient-bronze border-orange-700";
                return base;
              };

              return (
                <div key={player._id} className={getItemClasses()}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm mr-4 ${getRankBadgeClasses()}`}
                  >
                    {player.rank}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-base text-text-primary">{player.name}</span>
                      {index === 0 && (
                        <span className="bg-accent-gold text-black px-3 py-1 rounded-full text-xs font-bold ml-3">
                          Champion
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-base text-text-primary">{player.totalPoints}</div>
                      <div className="text-xs text-text-muted">points</div>
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-accent-gold rounded-b-xl transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
