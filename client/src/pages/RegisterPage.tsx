import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
export default function RegisterPage() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      useAuthStore.getState().login ? localStorage.setItem("token", data.accessToken) : null;
      navigate("/");
    } catch (e: any) { toast.error(e.message); }
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6"><MessageSquare className="w-6 h-6 text-blue-400"/><span className="text-xl font-bold text-white">ChatNest</span></div>
        <h2 className="text-lg font-semibold text-white mb-4">Create account</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {["name","email","password"].map(f => (
            <input key={f} type={f==="password"?"password":f==="email"?"email":"text"} placeholder={f.charAt(0).toUpperCase()+f.slice(1)}
              value={(form as any)[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))} required
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"/>
          ))}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl">Create Account</button>
        </form>
        <p className="text-center text-slate-500 text-sm mt-4">Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
