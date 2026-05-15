import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, User, Lock, Fingerprint, Activity, Cpu } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin(username);
      } else {
        alert('账号或密码错误 (提示: admin/admin)');
        setIsLoggingIn(false);
      }
    }, 800);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#030614] text-white flex-col lg:flex-row relative selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[30vw] h-[30vw] bg-cyan-600/10 rounded-full blur-[100px]" />
        
        {/* Tech Grid */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      {/* Left Panel - Branding & Vision */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10 border-r border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <Cpu size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">数智<span className="text-blue-400">中枢</span></span>
        </motion.div>

        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 mb-6 text-xs text-blue-300 backdrop-blur-md">
              <Activity size={14} className="animate-pulse" />
              智能调度引擎
            </div>
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight mb-8">
              大模型驱动的 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                新一代数字劳动力
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
              企业的超级智能大脑。让 AI 数字员工深度融入日常流程，为您带来前所未有的高效协同体验。
            </p>
          </motion.div>
        </div>

      </div>

      {/* Right Panel - Login Box */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-6 lg:p-12 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:hidden flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <Cpu size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">数智<span className="text-blue-400">中枢</span></span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-[420px]"
        >
          {/* Glass Card */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            
            {/* Top Right Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Fingerprint size={28} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">统一身份认证中心</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-black tracking-widest ml-1">账号</label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" size={18} />
                    <input 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:bg-slate-900/80 transition-all"
                      placeholder="请输入账号"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-black tracking-widest ml-1">密码</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" size={18} />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:bg-slate-900/80 transition-all font-mono"
                      placeholder="请输入密码"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full relative group overflow-hidden rounded-xl border border-blue-500/30 bg-blue-600/80 hover:bg-blue-500 transition-all py-3.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600/80"
                >
                  <span className="relative z-10 text-sm font-bold tracking-widest text-white flex items-center gap-2">
                    {isLoggingIn ? (
                      <>
                        <Activity size={18} className="animate-spin" />
                        验证中
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        授权登入
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </form>
            </div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}

