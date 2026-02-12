
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Chrome, ShieldCheck, Eye, EyeOff, UserCircle, Check, Facebook } from 'lucide-react';
import { User } from '../types';
import Logo from './Logo';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // High-fidelity accounts for the picker
  const googleAccounts = [
    { name: 'Intern Account', email: 'intern.dev@gmail.com', avatar: 'https://i.pravatar.cc/150?u=dev' },
    { name: 'Supervisor Admin', email: 'supervisor@enterprise.com', avatar: 'https://i.pravatar.cc/150?u=supervisor' }
  ];

  const handleSelectGoogleAccount = (account: any) => {
    setLoading(true);
    setShowGooglePicker(false);
    setTimeout(() => {
      const socialUser: User = { 
        id: `google_${Math.random().toString(36).substr(2, 5)}`, 
        name: account.name, 
        email: account.email,
        avatar: account.avatar
      };
      
      if (rememberMe) {
        localStorage.setItem('omni_current_user', JSON.stringify(socialUser));
      } else {
        sessionStorage.setItem('omni_current_user', JSON.stringify(socialUser));
      }
      onLogin(socialUser);
      setLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      setShowGooglePicker(true);
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const socialUser: User = { 
        id: `social_${Math.random().toString(36).substr(2, 5)}`, 
        name: `${provider} User`, 
        email: `user@${provider.toLowerCase()}.com`,
        avatar: `https://picsum.photos/seed/${provider}/150/150`
      };
      
      if (rememberMe) {
        localStorage.setItem('omni_current_user', JSON.stringify(socialUser));
      } else {
        sessionStorage.setItem('omni_current_user', JSON.stringify(socialUser));
      }
      onLogin(socialUser);
      setLoading(false);
    }, 800);
  };

  const handleUseAnotherAccount = () => {
    setShowGooglePicker(false);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      if (isLogin) {
        const users = JSON.parse(localStorage.getItem('omni_users') || '[]');
        const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          const loggedInUser: User = { id: user.id, name: user.name, email: user.email };
          if (rememberMe) {
            localStorage.setItem('omni_current_user', JSON.stringify(loggedInUser));
          } else {
            sessionStorage.setItem('omni_current_user', JSON.stringify(loggedInUser));
          }
          onLogin(loggedInUser);
        } else {
          setError('Invalid email or password. Please try again.');
          setLoading(false);
        }
      } else {
        const users = JSON.parse(localStorage.getItem('omni_users') || '[]');
        if (users.some((u: any) => u.email === formData.email)) {
          setError('User with this email already exists.');
          setLoading(false);
          return;
        }

        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        
        users.push(newUser);
        localStorage.setItem('omni_users', JSON.stringify(users));
        
        const loggedInUser: User = { id: newUser.id, name: newUser.name, email: newUser.email };
        localStorage.setItem('omni_current_user', JSON.stringify(loggedInUser));
        onLogin(loggedInUser);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Google Account Picker */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-[380px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
             <div className="p-10 text-center">
                <div className="flex justify-center mb-6">
                  <svg width="36" height="36" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <h3 className="text-[1.5rem] font-bold text-gray-900 tracking-tight">Choose an account</h3>
                <p className="text-[1rem] text-gray-500 mt-2">to continue to <span className="font-bold text-slate-800 underline decoration-blue-500 decoration-2 underline-offset-4">InvenTrack</span></p>
             </div>
             
             <div className="px-4 pb-4">
                {googleAccounts.map((acc, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 rounded-2xl transition-all group text-left border-t border-gray-100 first:border-none"
                  >
                    <img src={acc.avatar} alt="" className="w-10 h-10 rounded-full ring-2 ring-slate-100" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[0.95rem] font-bold text-gray-800 truncate">{acc.name}</p>
                      <p className="text-[0.8rem] text-gray-400 truncate leading-none mt-1 font-medium">{acc.email}</p>
                    </div>
                  </button>
                ))}
                
                <button onClick={handleUseAnotherAccount} className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 rounded-2xl transition-all text-left border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                    <UserCircle size={22} />
                  </div>
                  <p className="text-[0.95rem] font-bold text-gray-700">Use another account</p>
                </button>
             </div>

             <div className="p-6 bg-gray-50/50 flex flex-col gap-3 text-center text-[0.75rem] text-gray-400 font-bold uppercase tracking-widest">
                <div className="flex justify-center gap-4">
                  <button className="hover:text-blue-600 transition-colors">Help</button>
                  <button className="hover:text-blue-600 transition-colors">Privacy</button>
                  <button className="hover:text-blue-600 transition-colors">Terms</button>
                </div>
                <button onClick={() => setShowGooglePicker(false)} className="mt-2 text-blue-600 hover:text-blue-700 transition-colors">Cancel</button>
             </div>
          </div>
        </div>
      )}

      {/* Left side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="relative z-10">
          <Logo className="h-20 mb-16" textColor="light" />
          
          <div className="max-w-md space-y-8">
            <h2 className="text-5xl font-black text-white leading-[1.15] tracking-tight">
              Inventory Management Software for <span className="text-blue-400 underline decoration-blue-500/30">Growing Businesses.</span>
            </h2>
            <p className="text-slate-400 text-xl leading-relaxed font-medium">
              Scale your warehouse operations with AI insights <br /> and real-time stock orchestration.
            </p>
          </div>
        </div>

        <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center gap-6 max-w-sm">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40">
              <Check className="text-white" size={24} />
           </div>
           <div>
              <p className="text-sm font-bold text-white">Cloud Sync Active</p>
              <p className="text-xs text-slate-500 mt-1">Real-time backup across 12 zones</p>
           </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative bg-slate-50/20">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          <div className="flex justify-center -mb-4">
             <div className="p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <Logo className="h-10" textColor="dark" hideText={true} />
             </div>
          </div>

          <div className="text-center">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Get Started Now'}
            </h3>
            <p className="text-slate-500 mt-3 text-[1rem] font-medium leading-snug">
              {isLogin ? 'Sign in to access your inventory command center' : 'Create your enterprise workspace and start scaling'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input required type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold shadow-sm" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">Enterprise Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input required type="email" placeholder="name@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold shadow-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Security Key</label>
                {isLogin && <button type="button" className="text-[11px] font-black text-blue-600 hover:text-blue-700 transition-colors">Recover Account</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input required type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-14 py-4 bg-white border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5 focus:outline-none">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                  <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-2">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4.5 bg-blue-600 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-[0.98] shadow-xl shadow-blue-100/50">
              {loading ? 'Processing...' : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]"><span className="bg-slate-50/20 lg:bg-white px-6 text-slate-400">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" disabled={loading} onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-[1.25rem] hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm active:scale-[0.98]">
              <Chrome size={20} className="text-blue-500" /> Google
            </button>
            <button type="button" disabled={loading} onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-[1.25rem] hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm active:scale-[0.98]">
              <Facebook size={20} className="text-blue-600" /> Facebook
            </button>
          </div>

          <div className="text-center pt-4">
            <div className="inline-block bg-slate-100/50 p-2 rounded-2xl">
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setShowPassword(false); }} className="text-sm font-bold text-slate-600 flex items-center gap-3 px-6 py-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all">
                {isLogin ? "New to InvenTrack?" : "Already an enterprise user?"} 
                <span className="text-blue-600 font-black">{isLogin ? 'Join Workspace' : 'Log In'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
